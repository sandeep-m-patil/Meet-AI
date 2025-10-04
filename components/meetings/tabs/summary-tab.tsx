'use client';

import { Clock, Sparkles } from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";

interface SummaryTabProps {
    meeting: {
        name: string;
        startedAt?: string;
        endedAt?: string;
        summary?: string;
    };
    agent?: {
        name: string;
    };
}

export const SummaryTab = ({ meeting, agent }: SummaryTabProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDuration = () => {
        if (!meeting.startedAt || !meeting.endedAt) return null;
        const start = new Date(meeting.startedAt);
        const end = new Date(meeting.endedAt);
        const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
        return `${duration} seconds`;
    };

    const duration = getDuration();

    return (
        <div className="space-y-6 py-6">
            {/* Meeting Title */}
            <div>
                <h1 className="text-3xl font-bold mb-4">{meeting.name}</h1>
                
                {/* Agent and Date Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {agent && (
                        <div className="flex items-center gap-2">
                            <GeneratedAvatar
                                variant="botttsNeutral"
                                seed={agent.name}
                                className="h-6 w-6 rounded-full border"
                            />
                            <span className="font-medium text-foreground">{agent.name}</span>
                        </div>
                    )}
                    {meeting.startedAt && (
                        <span>{formatDate(meeting.startedAt)}</span>
                    )}
                </div>
            </div>

            {/* General Summary Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">General summary</h2>
                </div>
                
                {duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{duration}</span>
                    </div>
                )}
            </div>

            {/* Overview Section */}
            <div>
                <h3 className="text-base font-semibold mb-3">Overview</h3>
                <div className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                        {meeting.summary || "In this brief session, John Doe engaged with MathTutor, an AI-driven math assistance platform. The conversation highlights MathTutor's capability to provide quick and accurate solutions to basic arithmetic inquiries. This interaction demonstrates the platform's user-friendly nature and readiness to tackle further mathematical queries."}
                    </p>
                </div>
            </div>

            {/* Notes Section */}
            <div>
                <h3 className="text-base font-semibold mb-3">Notes</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Simple Arithmetic Query</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>John Doe asks: "What's 1 plus 1?"</li>
                            <li>MathTutor promptly and accurately responds with "1 plus 1 equals 2."</li>
                            <li>MathTutor encourages further engagement by asking if there are more math questions.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
