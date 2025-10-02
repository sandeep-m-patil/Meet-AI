'use client';
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  Clock, Calendar } from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";


interface Meeting {
    id: string;
    name: string;
    agentId: string;
    status: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface Agent {
    id: string;
    name: string;
    instructions: string;
}

interface MeetingsTableProps {
    meetings: Meeting[];
    agents: Agent[];
}

export const MeetingsTable = ({ meetings, agents }: MeetingsTableProps) => {
    const getAgent = (agentId: string): Agent => {
        return (
            agents.find((agent) => agent.id === agentId) || {
                id: agentId,
                name: "Unknown Agent",
                instructions: "",
            }
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            upcoming: {
                label: "Upcoming",
                variant: "secondary" as const,
                icon: Calendar,
            },
            active: {
                label: "Active",
                variant: "default" as const,
                icon: Clock,
            },
            completed: {
                label: "Completed",
                variant: "outline" as const,
                icon: Clock,
            },
            processing: {
                label: "Processing",
                variant: "secondary" as const,
                icon: Clock,
            },
            cancelled: {
                label: "Cancelled",
                variant: "destructive" as const,
                icon: Clock,
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
        const Icon = config.icon;

        return (
            <Badge
                variant={config.variant}
                className="flex items-center gap-1 text-sm px-2 py-1 rounded-md"
            >
                <Icon className="w-4 h-4" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    if (meetings.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
                <p className="text-gray-500 mb-4">Create your first meeting to get started.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg bg-white overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-3 font-semibold text-sm text-gray-700">
                            Meeting
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-sm text-gray-700">
                            Agent
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-sm text-gray-700">
                            Status
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-sm text-gray-700">
                            Duration
                        </TableHead>
                        <TableHead className="px-4 py-3 w-12" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {meetings.map((meeting) => {
                        const agent = getAgent(meeting.agentId);
                        return (
                            <TableRow key={meeting.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="px-4 py-3">
                                    <Link
                                        href={`/meetings/${meeting.id}`}
                                        className="block hover:text-blue-600 transition"
                                    >
                                        <span className="font-medium text-gray-900">
                                            {meeting.name}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <GeneratedAvatar
                                            variant="botttsNeutral"
                                            seed={agent.name}
                                            className="h-8 w-8 rounded-full border"
                                        />
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-medium text-gray-900">
                                                {agent.name}
                                            </span>
                                            {agent.instructions && (
                                                <p className="text-xs text-gray-500 max-w-[220px] truncate">
                                                    {agent.instructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    {getStatusBadge(meeting.status)}
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>No Duration</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    {/* Future dropdown menu/actions can go here */}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
