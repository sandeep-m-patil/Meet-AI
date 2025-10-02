'use client';

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { MeetingDetails } from "./meeting-details";

interface MeetingDetailsViewProps {
    meetingId: string;
}

export const MeetingDetailsView = ({ meetingId }: MeetingDetailsViewProps) => {
    const trpc = useTRPC();

    const { data: meeting, isLoading: meetingLoading, error: meetingError } = useQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    const { data: agentsData, isLoading: agentsLoading } = useQuery(
        trpc.agents.getMany.queryOptions({
            page: 1,
            pageSize: 50,
        })
    );

    if (meetingLoading || agentsLoading) {
        return <LoadingState title="Loading Meeting" description="Please wait while we load the meeting details" />;
    }

    if (meetingError) {
        return <ErrorState title="Error Loading Meeting" description={meetingError.message} />;
    }

    if (!meeting) {
        return <ErrorState title="Meeting Not Found" description="The meeting you're looking for doesn't exist." />;
    }

    // Find the agent for this meeting
    const agent = agentsData?.items?.find(a => a.id === meeting.agentId);

    return <MeetingDetails meeting={meeting} agent={agent} />;
};
