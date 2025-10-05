import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";

import { StreamTranscriptItem } from "@/modules/meetings/types";

const summarizer = createAgent({
    name: "summarizer",
    system: `
    You are an expert meeting summarizer. Read the transcript and write a short, clear, and engaging summary in a single paragraph. Focus on the main discussion points, key decisions, and important takeaways. Keep the tone professional and easy to read. Avoid unnecessary details or repetition. `.trim(),
    model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingsProcessing = inngest.createFunction(
    { id: "meetings/processing" },
    { event: "meetings/processing" },
    async ({ event, step }) => {
        const response = await step.run("fetch-transcript", async () => {
            return fetch(event.data.transcriptUrl).then((res) => res.text());
        });

        const transcript = await step.run("parse-transcript", async () => {
            return JSONL.parse<StreamTranscriptItem>(response);
        });

        const transcriptWithSpeakers = await step.run("add-speakers", async () => {
            const speakerIds = [
                ...new Set(transcript.map((item) => item.speaker_id)),
            ];

            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))
                .then((users) =>
                    users.map((user) => ({
                        ...user,
                    }))
                );

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))
                .then((agents) =>
                    agents.map((agent) => ({
                        ...agent,
                    }))
                );

            const speakers = [...userSpeakers, ...agentSpeakers];

            return transcript.map((item) => {
                const speaker = speakers.find(
                    (speaker) => speaker.id === item.speaker_id
                );

                if (!speaker) {
                    return {
                        ...item,
                        user: {
                            name: "Unknown",
                        },
                    };
                }

                return {
                    ...item,
                    user: {
                        name: speaker.name,
                    },
                };
            });
        });

        const { output } = await summarizer.run(
            "Summarize the following transcript: " +
            JSON.stringify(transcriptWithSpeakers)
        );

        await step.run("save-summary", async () => {
            await db
                .update(meetings)
                .set({
                    summary: (output[0] as TextMessage).content as string,
                    status: "completed",
                })
                .where(eq(meetings.id, event.data.meetingId))
        })
    },
);

// Ask AI function for handling user questions about meetings
export const askAIQuery = inngest.createFunction(
    { id: "meetings/ask-ai" },
    { event: "meetings/ask-ai" },
    async ({ event, step }) => {
        const { meetingId, question } = event.data;

        // Get meeting data
        const meeting = await step.run("get-meeting", async () => {
            const [meeting] = await db
                .select()
                .from(meetings)
                .where(eq(meetings.id, meetingId));
            return meeting;
        });

        if (!meeting) {
            throw new Error("Meeting not found");
        }

        // Get agent information
        const agent = await step.run("get-agent", async () => {
            const [agent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, meeting.agentId));
            return agent;
        });

        if (!agent) {
            throw new Error("Agent not found");
        }

        // Create context for AI
        const context = `
Meeting: ${meeting.name}
Agent: ${agent.name}
Summary: ${meeting.summary || 'No summary available'}

User Question: ${question}

Please provide a helpful answer based on the meeting information above. If you need more specific information from the transcript, please let the user know.
        `.trim();

        // Generate AI response
        const aiResponse = await step.run("generate-ai-response", async () => {
            const { OpenAI } = await import("openai");
            const openaiClient = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const completion = await openaiClient.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant that helps users understand and analyze meeting content. You have access to meeting data, summaries, and recordings.

When answering questions about meetings:
1. Be specific and reference exact quotes or timestamps when possible
2. Provide context and background information
3. If you don't have enough information, clearly state what's missing
4. Suggest related topics or follow-up questions
5. Be conversational but professional

Always base your answers on the actual meeting content provided.`
                    },
                    {
                        role: "user",
                        content: context
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";
        });

        return {
            success: true,
            response: aiResponse,
            meetingId,
            question
        };
    }
);

// Format transcript function for displaying structured transcript data
export const formatTranscript = inngest.createFunction(
    { id: "meetings/format-transcript" },
    { event: "meetings/format-transcript" },
    async ({ event, step }) => {
        const { meetingId, transcriptUrl } = event.data;

        // Fetch and parse transcript
        const transcript = await step.run("fetch-and-parse-transcript", async () => {
            const response = await fetch(transcriptUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch transcript: ${response.statusText}`);
            }
            const text = await response.text();
            return JSONL.parse<StreamTranscriptItem>(text);
        });

        // Get speaker information
        const transcriptWithSpeakers = await step.run("add-speaker-info", async () => {
            const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];

            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds));

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds));

            const allSpeakers = [...userSpeakers, ...agentSpeakers];

            return transcript.map((item) => {
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
        });

        // Format for display
        const formattedTranscript = await step.run("format-for-display", async () => {
            return transcriptWithSpeakers.map((item) => ({
                id: `${item.speaker_id}-${item.start_ts}`,
                timestamp: formatTimestamp(item.start_ts),
                speaker: item.speaker.name,
                speakerType: item.speaker.type,
                text: item.text,
                duration: item.stop_ts - item.start_ts,
                startTime: item.start_ts,
                endTime: item.stop_ts
            }));
        });

        // Generate statistics
        const stats = await step.run("generate-stats", async () => {
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

            return {
                totalDuration,
                totalSegments: transcript.length,
                totalWords: transcript.reduce((sum, item) => sum + item.text.split(' ').length, 0),
                speakers: Object.values(speakerStats)
            };
        });

        return {
            success: true,
            transcript: formattedTranscript,
            stats,
            meetingId
        };
    }
);

// Helper function to format timestamps
function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}