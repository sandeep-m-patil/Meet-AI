import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { meetingsProcessing, askAIQuery, formatTranscript } from "@/inngest/functions";

// Create an API that serves all Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    meetingsProcessing,
    askAIQuery,
    formatTranscript,
  ],
});