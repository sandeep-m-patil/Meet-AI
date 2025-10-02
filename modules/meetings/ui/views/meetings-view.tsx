"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { MeetingsTable } from '@/components/meetings/meetings-table';

export default function MeetingsView() {
  const trpc = useTRPC();
  
  const { data: meetingsData, isLoading: meetingsLoading, error: meetingsError } = useQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 1,
      pageSize: 50, // Get more agents for the table
    })
  );

  if (meetingsLoading || agentsLoading) {
    return <LoadingState title="Loading Meetings" description="Please wait while we load the meetings" />;
  }

  if (meetingsError) {
    return <ErrorState title="Error Loading Meetings" description={meetingsError.message} />;
  }

  if (agentsError) {
    return <ErrorState title="Error Loading Agents" description={agentsError.message} />;
  }

  if (!meetingsData) {
    return <ErrorState title="No Data" description="Meetings data not found." />;
  }

  // The server returns { data, pagination }
  const meetings = meetingsData.data || [];
  const agents = agentsData?.items || [];
  const pagination = meetingsData.pagination;

  return (
    <div className="space-y-4">
      <MeetingsTable meetings={meetings} agents={agents} />
      
      {/* Pagination info */}
      {meetings.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {meetings.length} of {pagination?.total || 0} meetings
        </div>
      )}
    </div>
  )
}
