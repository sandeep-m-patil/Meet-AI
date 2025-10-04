'use client';

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import Link from "next/link";

interface CancelledMeetingViewProps {
    meeting: {
        id: string;
        name: string;
        createdAt: string;
    };
    agent?: {
        name: string;
        instructions: string;
    };
}

export const CancelledMeetingView = ({ meeting, agent }: CancelledMeetingViewProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardContent className="pt-12 pb-12">
                    <div className="text-center space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>

                        {/* Meeting Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{meeting.name}</h1>
                            <p className="text-muted-foreground">
                                Created on {formatDate(meeting.createdAt)}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
                                <AlertCircle className="w-5 h-5" />
                                <span>Meeting Cancelled</span>
                            </div>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                This meeting was cancelled and no data is available.
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
                                            className="h-12 w-12 rounded-full border opacity-50"
                                        />
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold mb-1 text-muted-foreground">{agent.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Was assigned to this meeting
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action */}
                        <div className="pt-4">
                            <Link href="/meetings">
                                <Button variant="outline" size="lg">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Back to Meetings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
