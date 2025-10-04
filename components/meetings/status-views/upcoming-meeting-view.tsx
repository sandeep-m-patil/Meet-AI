'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import Link from "next/link";

interface UpcomingMeetingViewProps {
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

export const UpcomingMeetingView = ({ meeting, agent }: UpcomingMeetingViewProps) => {
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
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-10 h-10 text-blue-600" />
                            </div>
                        </div>

                        {/* Meeting Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{meeting.name}</h1>
                            <p className="text-muted-foreground">
                                Scheduled for {formatDate(meeting.createdAt)}
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
                                                {agent.instructions}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action */}
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                This meeting hasn't started yet. Click below to begin.
                            </p>
                            <Link href={`/call/${meeting.id}`}>
                                <Button size="lg" className="px-8">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Start Meeting
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
