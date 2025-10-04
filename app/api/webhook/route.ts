import { and, eq, not } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk"
import { db } from "@/db"
import { agents, meetings } from "@/db/schema"
import { streamVideo } from "@/lib/stream-video"
import { inngest } from "@/inngest/client"

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get("x-signature");
        const apiKey = req.headers.get("x-api-key");

        if (!signature || !apiKey) {
            console.error("Missing signature or API Key in webhook request");
            return NextResponse.json(
                { error: "Missing signature or API Key" },
                { status: 400 },
            )
        }
        const body = await req.text();

        if (!verifySignatureWithSDK(body, signature)) {
            console.error("Invalid signature in webhook request");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        let payload: unknown;
        try {
            payload = JSON.parse(body);
        }
        catch (error) {
            console.error("Invalid JSON in webhook request:", error);
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const eventType = (payload as Record<string, unknown>)?.type;
        console.log(`Processing webhook event: ${eventType}`);
        console.log(`Full webhook payload:`, JSON.stringify(payload, null, 2));
        if (eventType === "call.session_started") {
            const event = payload as CallSessionStartedEvent;
            const meetingId = event.call.custom?.meetingId;

            console.log(`Session started event - meetingId: ${meetingId}`);
            console.log(`Call custom data:`, event.call.custom);

            if (!meetingId) {
                console.error("Missing meetingId in session_started event");
                return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
            }

            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(eq(meetings.id, meetingId));

            console.log(`Found existing meeting:`, existingMeeting);

            if (!existingMeeting) {
                console.error(`Meeting not found for ID: ${meetingId}`);
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }

            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    status: "active",
                    startedAt: new Date(),
                })
                .where(eq(meetings.id, meetingId))
                .returning();

            console.log(`Updated meeting status to active:`, updatedMeeting);

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, existingMeeting.agentId));

            if (!existingAgent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

            const call = streamVideo.video.call("default", meetingId);

            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id,
            });

            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
            });

            console.log(`Meeting ${meetingId} started successfully`);
        }

        else if (eventType === "call.session_participant_left") {
            const event = payload as CallSessionParticipantLeftEvent;
            const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

            if (!meetingId) return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });

            const call = streamVideo.video.call("default", meetingId);
            await call.end();
            console.log(`Call ended for meeting ${meetingId} due to participant leaving`);
        }

        else if (eventType === "call.session_ended") {
            const event = payload as CallEndedEvent;
            const meetingId = event.call.custom?.meetingId;

            if (!meetingId) {
                return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
            }

            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    status: "processing",
                    endedAt: new Date(),
                })
                .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")))
                .returning();

            if (updatedMeeting) {
                console.log(`Meeting ${meetingId} ended and set to processing status`);
            } else {
                console.log(`Meeting ${meetingId} not found or not in active status`);
            }
        }

        else if (eventType === "call.transcription_ready") {
            const event = payload as CallTranscriptionReadyEvent;
            const meetingId = event.call_cid.split(":")[1];

            console.log(`Transcription ready event - meetingId: ${meetingId}`);
            console.log(`Transcription data:`, event.call_transcription);

            if (!meetingId) {
                console.error("Missing meetingId in transcription_ready event");
                return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
            }

            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    transcriptUrl: event.call_transcription?.url || null,
                })
                .where(eq(meetings.id, meetingId))
                .returning();

            if (!updatedMeeting) {
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }

            console.log(`Transcription ready for meeting ${meetingId}: ${event.call_transcription?.url}`);

            await inngest.send({
                name: "meetings/processing",
                data: {
                    meetingId: updatedMeeting.id,
                    transcriptUrl: updatedMeeting.transcriptUrl,
                }
            })

        }

        else if (eventType === "call.recording_ready") {
            const event = payload as CallRecordingReadyEvent;
            const meetingId = event.call_cid.split(":")[1];

            console.log(`Recording ready event - meetingId: ${meetingId}`);
            console.log(`Recording data:`, event.call_recording);

            if (!meetingId) {
                console.error("Missing meetingId in recording_ready event");
                return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
            }

            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    recordingUrl: event.call_recording?.url || null,
                })
                .where(eq(meetings.id, meetingId))
                .returning();

            if (!updatedMeeting) {
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }

            console.log(`Recording ready for meeting ${meetingId}: ${event.call_recording?.url}`);
        }



        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}