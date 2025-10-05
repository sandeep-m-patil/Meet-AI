import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
    try {
        console.log("Ask AI API called");
        const { meetingId, question } = await req.json();
        console.log("Request data:", { meetingId, question });

        if (!meetingId || !question) {
            console.log("Missing required parameters");
            return NextResponse.json(
                { error: "Missing required parameters: meetingId and question" },
                { status: 400 }
            );
        }

        // Get meeting data
        const [meeting] = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, meetingId));
        
        if (!meeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        // Get agent information
        const [agent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, meeting.agentId));
        
        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        // Create context for AI
        const context = `
Meeting: ${meeting.name}
Agent: ${agent.name}
Summary: ${meeting.summary || 'No summary available'}

User Question: ${question}

Please provide a helpful answer based on the meeting information above. Format your response with:
- Clear headings using **bold text**
- Bullet points for lists
- Proper line breaks between sections
- Timestamps when referencing specific parts
- Use numbered lists for step-by-step information

If you need more specific information from the transcript, please let the user know.
        `.trim();

        // Generate AI response using OpenAI
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

Format your responses for readability:
- Use **bold text** for headings and important points
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) for step-by-step information
- Include proper line breaks between sections
- Use timestamps in format (MM:SS-MM:SS) when referencing specific parts
- Keep paragraphs short and focused

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

        const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

        return NextResponse.json({
            success: true,
            response: aiResponse,
            meetingId,
            question
        });

    } catch (error) {
        console.error("Error processing Ask AI query:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                meetingId: req.body?.meetingId,
                question: req.body?.question
            },
            { status: 500 }
        );
    }
}
