"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "@/components/agents/new-agent-dialog";
import ResponsiveDialog from "@/components/dialog/responsive-dialog";

export const AgentsList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.agents.getMany.queryOptions());

  if (isLoading) {
    return <LoadingState title="Loading Agents" description="Please wait while we load the agents" />;
  }

  if (error) {
    return <ErrorState title="Error Loading Agents" description={error.message} />;
  }

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Agents</h1>
        <Button className="mb-4" onClick={() => setIsDialogOpen(true)}>
          <PlusIcon />
          New Agent
        </Button>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      <ResponsiveDialog
        title="My Dialog"
        description="This is a responsive dialog"
        open={false}
        onOpenChange={() => {}}
      >
        <Button>Open Dialog</Button>
      </ResponsiveDialog>
    </>
  );
};
