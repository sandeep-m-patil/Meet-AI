'use client';

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
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
import { UpcomingMeetingView } from "./status-views/upcoming-meeting-view";
import { ActiveMeetingView } from "./status-views/active-meeting-view";
import { ProcessingMeetingView } from "./status-views/processing-meeting-view";
import { CancelledMeetingView } from "./status-views/cancelled-meeting-view";
import { CompletedMeetingView } from "./status-views/completed-meeting-view";

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
    // Render different components based on meeting status
    const renderContent = () => {
        switch (meeting.status) {
            case 'upcoming':
                return <UpcomingMeetingView meeting={meeting} agent={agent} />;
            case 'active':
                return <ActiveMeetingView meeting={meeting} agent={agent} />;
            case 'processing':
                return <ProcessingMeetingView meeting={meeting} agent={agent} />;
            case 'cancelled':
                return <CancelledMeetingView meeting={meeting} agent={agent} />;
            case 'completed':
                return <CompletedMeetingView meeting={meeting} agent={agent} />;
            default:
                return <UpcomingMeetingView meeting={meeting} agent={agent} />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
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
                            <Link href="/meetings">My Meetings</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{meeting.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header with Actions - Only show for completed meetings */}
            {meeting.status === 'completed' && (
                <div className="flex items-center justify-end gap-2">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link href={`/call/${meeting.id}`} className="w-full">
                                    Start New Meeting
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Status-based Content */}
            {renderContent()}
        </div>
    );
};
