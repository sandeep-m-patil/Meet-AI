"use client"
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/dialog/responsive-dialog';
export default function AgentsPage() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.agents.getMany.queryOptions());
  console.log('Query data:', data);

  if (isLoading) {
    return <LoadingState title='Loading Agents' description='Please wait while we load the agents' />
  }
  if (error) {
    return <ErrorState title='Error Loading Agents' description={error.message} />
  }



  return (
    <>
      <h1>

        {JSON.stringify(data, null, 2)} Agents Found
        <ResponsiveDialog title="My Dialog" description="This is a responsive dialog" open={false} onOpenChange={() => { }}>
          <Button>Open Dialog</Button>
        </ResponsiveDialog>
      </h1></>
  );
}
