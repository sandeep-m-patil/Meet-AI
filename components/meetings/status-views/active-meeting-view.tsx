'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ActiveMeetingViewProps {
    meeting: {
        id: string;
        name: string;
        startedAt?: string;
    };
    agent?: {
        name: string;
        instructions: string;
    };
}

export const ActiveMeetingView = ({ meeting, agent }: ActiveMeetingViewProps) => {
    const [duration, setDuration] = useState('00:00');

    useEffect(() => {
        if (!meeting.startedAt) return;

        const interval = setInterval(() => {
            const start = new Date(meeting.startedAt!);
            const now = new Date();
            const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            setDuration(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [meeting.startedAt]);

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardContent className="pt-12 pb-12">
                    <div className="text-center space-y-6">
                        {/* Animated Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-10 h-10 text-blue-600" />
                                </div>
                                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500"></span>
                                </span>
                            </div>
                        </div>

                        {/* Meeting Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{meeting.name}</h1>
                            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-blue-600">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span>Meeting in Progress</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="text-4xl font-mono font-bold text-muted-foreground">
                            {duration}
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
                                                Currently assisting in this meeting
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Your meeting is currently active. You can continue or end it.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link href={`/call/${meeting.id}`}>
                                    <Button size="lg" variant="outline" className="px-8">
                                        <Play className="w-5 h-5 mr-2" />
                                        Continue Meeting
                                    </Button>
                                </Link>
                                <Button size="lg" variant="destructive" className="px-8">
                                    <Square className="w-5 h-5 mr-2" />
                                    End Meeting
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
