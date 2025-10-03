'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    User,
    Play,
    Pause,
    Square,
    Download,
    FileText,
    Settings,
    ArrowLeft,
    MoreVertical
} from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMeetingDialog } from "./edit-meeting-dialog";
import { DeleteMeetingDialog } from "./delete-meeting-dialog";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface MeetingDetailsProps {
    meeting: {
        id: string;
        name: string;
        agentId: string;
        status: string;
        startedAt?: string;
        endedAt?: string;
        transcriptUrl?: string;
        recordingUrl?: string;
        summary?: string;
        createdAt: string;
        updatedAt: string;
    };
    agent?: {
        id: string;
        name: string;
        instructions: string;
    };
}

export const MeetingDetails = ({ meeting, agent }: MeetingDetailsProps) => {
    const [isRecording, setIsRecording] = useState(meeting.status === 'active');

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            upcoming: { label: 'Upcoming', variant: 'secondary' as const, icon: Calendar },
            active: { label: 'Active', variant: 'default' as const, icon: Clock },
            completed: { label: 'Completed', variant: 'outline' as const, icon: Clock },
            processing: { label: 'Processing', variant: 'secondary' as const, icon: Clock },
            cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: Clock },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 text-sm px-2 py-1 rounded-md">
                <Icon className="w-4 h-4" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDuration = () => {
        if (!meeting.startedAt || !meeting.endedAt) return 'No Duration';
        const start = new Date(meeting.startedAt);
        const end = new Date(meeting.endedAt);
        const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
        return `${duration} minutes`;
    };

    const handleStartMeeting = () => {
        setIsRecording(true);
        // TODO: Implement start meeting logic
    };

    const handleStopMeeting = () => {
        setIsRecording(false);
        // TODO: Implement stop meeting logic
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/meetings">Meetings</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{meeting.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/meetings">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Meetings
                        </Button>
                    </Link>
                </div>

                {/* Action buttons: Edit & Delete */}
                <div className="flex items-center gap-2">
                    <EditMeetingDialog
                        meeting={{
                            id: meeting.id,
                            name: meeting.name,
                            agentId: meeting.agentId
                        }}
                    />
                    <DeleteMeetingDialog
                        meeting={{
                            id: meeting.id,
                            name: meeting.name
                        }}
                        
                    />
                </div>
            </div>


            {/* Meeting Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold">{meeting.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {getStatusBadge(meeting.status)}
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Meeting Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={agent?.name || 'Unknown Agent'}
                                        className="h-10 w-10 rounded-full border"
                                    />
                                    <div>
                                        <p className="font-medium">Agent</p>
                                        <p className="text-sm text-muted-foreground">
                                            {agent?.name || 'Unknown Agent'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Created</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(meeting.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Duration</p>
                                    <p className="text-sm text-muted-foreground">
                                        {getDuration()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Last Updated</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(meeting.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Meeting Controls */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center space-y-4">
                            <h3 className="font-semibold text-lg">Meeting Controls</h3>
                            <div className="flex items-center justify-center gap-4">
                                {meeting.status === 'upcoming' && (
                                   <Link href={`/call/${meeting.id}`}> <Button onClick={handleStartMeeting} size="lg" className="px-8">
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Meeting
                                    </Button></Link>
                                )}
                                {meeting.status === 'active' && (
                                    <>
                                        <Button onClick={handleStopMeeting} variant="destructive" size="lg" className="px-8">
                                            <Square className="w-5 h-5 mr-2" />
                                            End Meeting
                                        </Button>
                                        <Link href={`/call/${meeting.id}`}> <Button onClick={handleStartMeeting} size="lg" className="px-8">
                                        <Play className="w-5 h-5 mr-2" />
                                        Continue Meeting
                                    </Button></Link>
                                    </>
                                )}
                                {meeting.status === 'completed' && (
                                    <div className="text-center">
                                        <p className="text-muted-foreground">Meeting has been completed</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agent Information Card */}
            {agent && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            Agent Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <GeneratedAvatar
                                    variant="botttsNeutral"
                                    seed={agent.name}
                                    className="h-16 w-16 rounded-full border"
                                />
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                                        <p className="text-sm text-muted-foreground">AI Agent</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Instructions</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {agent.instructions}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Meeting Resources */}
            {(meeting.transcriptUrl || meeting.recordingUrl || meeting.summary) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Meeting Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {meeting.transcriptUrl && (
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <FileText className="w-6 h-6" />
                                    <span>Transcript</span>
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                            {meeting.recordingUrl && (
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <Play className="w-6 h-6" />
                                    <span>Recording</span>
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                            {meeting.summary && (
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <FileText className="w-6 h-6" />
                                    <span>Summary</span>
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Meeting Summary */}
            {meeting.summary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Meeting Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {meeting.summary}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
