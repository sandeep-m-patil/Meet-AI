import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MeetingsView from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "@/components/error-state";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  // prefetch meetings for hydration
  await queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <>
    <MeetingsListHeader/>
      <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ErrorBoundary fallback={<ErrorState title="Something went wrong" description="Error Loading Meetings" />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    
    </>
  
  );
}
