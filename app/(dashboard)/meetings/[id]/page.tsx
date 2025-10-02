import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { MeetingDetailsView } from "@/components/meetings/meeting-details-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function MeetingPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  try {
    // Prefetch meeting data
    await queryClient.prefetchQuery(
      trpc.meetings.getOne.queryOptions({ id: params.id })
    );
  } catch (error) {
    // Handle case where meeting doesn't exist
    return (
      <ErrorState 
        title="Meeting Not Found" 
        description="The meeting you're looking for doesn't exist or you don't have permission to view it." 
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState title="Loading Meeting" description="Please wait while we load the meeting details" />}>
        <ErrorBoundary fallback={<ErrorState title="Something went wrong" description="Error loading meeting details" />}>
          <MeetingDetailsView meetingId={params.id} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
