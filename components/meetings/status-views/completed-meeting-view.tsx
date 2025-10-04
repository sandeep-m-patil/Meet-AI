'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, FileText, Video, Sparkles } from "lucide-react";
import { SummaryTab } from "../tabs/summary-tab";
import { TranscriptTab } from "../tabs/transcript-tab";
import { RecordingTab } from "../tabs/recording-tab";
import { AskAITab } from "../tabs/ask-ai-tab";

interface CompletedMeetingViewProps {
    meeting: {
        id: string;
        name: string;
        status: string;
        startedAt?: string;
        endedAt?: string;
        transcriptUrl?: string;
        recordingUrl?: string;
        summary?: string;
        createdAt: string;
    };
    agent?: {
        name: string;
        instructions: string;
    };
}

export const CompletedMeetingView = ({ meeting, agent }: CompletedMeetingViewProps) => {
    const [activeTab, setActiveTab] = useState("summary");

    return (
        <div className="max-w-6xl mx-auto px-4 pb-5 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tabs List */}
          <TabsList
            className="
              grid grid-cols-2 sm:grid-cols-4 gap-2
              w-full mb-4
              lg:w-auto lg:gap-4 lg:mb-6
            "
          >
            <TabsTrigger
              value="summary"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Summary</span>
            </TabsTrigger>
      
            <TabsTrigger
              value="transcript"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FileText className="w-4 h-4" />
              <span>Transcript</span>
            </TabsTrigger>
      
            <TabsTrigger
              value="recording"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Video className="w-4 h-4" />
              <span>Recording</span>
            </TabsTrigger>
      
            <TabsTrigger
              value="ask-ai"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI</span>
            </TabsTrigger>
          </TabsList>
      
          {/* Tabs Content */}
          <TabsContent value="summary" className="mt-0 p-4 sm:p-6 bg-background rounded-2xl shadow-sm">
            <SummaryTab meeting={meeting} agent={agent} />
          </TabsContent>
      
          <TabsContent value="transcript" className="mt-0 p-4 sm:p-6 bg-background rounded-2xl shadow-sm">
            <TranscriptTab meeting={meeting} />
          </TabsContent>
      
          <TabsContent value="recording" className="mt-0 p-4 sm:p-6 bg-background rounded-2xl shadow-sm">
            <RecordingTab meeting={meeting} />
          </TabsContent>
      
          <TabsContent value="ask-ai" className="mt-0 p-4 sm:p-6 bg-background rounded-2xl shadow-sm">
            <AskAITab meeting={meeting} />
          </TabsContent>
        </Tabs>
      </div>
      
    );
};
