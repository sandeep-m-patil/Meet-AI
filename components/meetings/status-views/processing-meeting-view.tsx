'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";

interface ProcessingMeetingViewProps {
    meeting: {
        id: string;
        name: string;
        endedAt?: string;
    };
    agent?: {
        name: string;
        instructions: string;
    };
}

export const ProcessingMeetingView = ({ meeting, agent }: ProcessingMeetingViewProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardContent className="pt-12 pb-12">
                    <div className="text-center space-y-6">
                        {/* Animated Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
                            </div>
                        </div>

                        {/* Meeting Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{meeting.name}</h1>
                            <p className="text-muted-foreground">
                                {meeting.endedAt && `Ended ${formatDate(meeting.endedAt)}`}
                            </p>
                        </div>

                        {/* Processing Status */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing Meeting Data</span>
                            </div>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                We're analyzing your meeting and generating the transcript, summary, and recording. 
                                This usually takes a few minutes.
                            </p>
                        </div>

                        {/* Agent Info */}
                        {agent && (
                            <Card className="max-w-md mx-auto">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <GeneratedAvatar
                                            variant="botttsNeutral"
                                            seed={agent.name}
                                            className="h-12 w-12 rounded-full border"
                                        />
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold mb-1">{agent.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Assisted in this meeting
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Progress Indicators */}
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                <span className="text-muted-foreground">Generating transcript...</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                <span className="text-muted-foreground">Creating summary...</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                <span className="text-muted-foreground">Processing recording...</span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            You'll be notified when everything is ready. Feel free to close this page.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
