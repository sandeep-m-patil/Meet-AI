import { NextRequest, NextResponse } from "next/server";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { StreamTranscriptItem } from "@/modules/meetings/types";

export async function POST(req: NextRequest) {
    try {
        console.log("Transcript formatting API called");
        const { meetingId, transcriptUrl } = await req.json();
        console.log("Request data:", { meetingId, transcriptUrl });

        if (!meetingId || !transcriptUrl) {
            console.log("Missing required parameters");
            return NextResponse.json(
                { error: "Missing required parameters: meetingId and transcriptUrl" },
                { status: 400 }
            );
        }

        // Fetch and parse transcript
        console.log("Fetching transcript from:", transcriptUrl);
        const response = await fetch(transcriptUrl);
        console.log("Transcript fetch response status:", response.status);
        
        if (!response.ok) {
            console.error("Failed to fetch transcript:", response.status, response.statusText);
            throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        console.log("Transcript text length:", text.length);
        
        if (!text.trim()) {
            throw new Error("Transcript is empty");
        }

        const transcript = JSONL.parse<StreamTranscriptItem>(text);
        console.log("Parsed transcript items:", transcript.length);

        // Get speaker information
        const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];
        console.log("Speaker IDs found:", speakerIds);

        let userSpeakers = [];
        let agentSpeakers = [];

        try {
            userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds));
            console.log("User speakers found:", userSpeakers.length);

            agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds));
            console.log("Agent speakers found:", agentSpeakers.length);
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with empty speaker arrays if database fails
        }

        const allSpeakers = [...userSpeakers, ...agentSpeakers];

        const transcriptWithSpeakers = transcript.map((item) => {
            const speaker = allSpeakers.find((s) => s.id === item.speaker_id);
            
            return {
                ...item,
                speaker: speaker ? {
                    id: speaker.id,
                    name: speaker.name || "Unknown",
                    type: userSpeakers.some(u => u.id === speaker.id) ? 'user' : 'agent'
                } : {
                    id: item.speaker_id,
                    name: "Unknown",
                    type: 'unknown'
                }
            };
        });

        // Format for display
        const formattedTranscript = transcriptWithSpeakers.map((item) => ({
            id: `${item.speaker_id}-${item.start_ts}`,
            timestamp: formatTimestamp(item.start_ts),
            speaker: item.speaker.name,
            speakerType: item.speaker.type,
            text: item.text,
            duration: item.stop_ts - item.start_ts,
            startTime: item.start_ts,
            endTime: item.stop_ts
        }));

        // Generate statistics
        const totalDuration = Math.max(...transcript.map(item => item.stop_ts));
        const speakerStats = transcriptWithSpeakers.reduce((acc, item) => {
            const speakerName = item.speaker.name;
            if (!acc[speakerName]) {
                acc[speakerName] = {
                    name: speakerName,
                    type: item.speaker.type,
                    segments: 0,
                    totalDuration: 0,
                    wordCount: 0
                };
            }
            acc[speakerName].segments++;
            acc[speakerName].totalDuration += item.stop_ts - item.start_ts;
            acc[speakerName].wordCount += item.text.split(' ').length;
            return acc;
        }, {} as Record<string, any>);

        const stats = {
            totalDuration,
            totalSegments: transcript.length,
            totalWords: transcript.reduce((sum, item) => sum + item.text.split(' ').length, 0),
            speakers: Object.values(speakerStats)
        };

        return NextResponse.json({
            success: true,
            transcript: formattedTranscript,
            stats,
            meetingId
        });

    } catch (error) {
        console.error("Error formatting transcript:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                meetingId: req.body?.meetingId
            },
            { status: 500 }
        );
    }
}

// Helper function to format timestamps
function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
