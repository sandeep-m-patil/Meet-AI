"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

export default function MeetingsView() {
  const trpc = useTRPC();
  const { data ,isLoading,error} = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({})
  );
  if (isLoading) {
    return <LoadingState title="Loading Meetings" description="Please wait while we load the agents" />;
  }

  if (error) {
    return <ErrorState title="Error Loading Meetings" description={error.message} />;
  }

  if (!data) {
    return <ErrorState title="No Data" description="Meetings data not found." />;
  }
  return (
    <div>{JSON.stringify(data)}</div>
  )
}
