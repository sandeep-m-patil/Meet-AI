"use client"
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
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
      </h1></>
  );
}
