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
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { columns } from "@/modules/agents/ui/components/columns";
import { AgentGetOne } from "@/modules/agents/types";
import EmptyState from "../empty-state";


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

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
        <DataTable data={(data ?? []) as AgentGetOne[]} columns={columns} />
        {data.length === 0 &&
          <div className="h-[300px]">
            <EmptyState title="Create your first agent" 
            description="Create a new agent to join your meetings. 
            Each agent will follow your instructions and can interact with participants during the call." />
          </div>
        }
      </div>

      <ResponsiveDialog
        title="My Dialog"
        description="This is a responsive dialog"
        open={false}
        onOpenChange={() => { }}
      >
        <Button>Open Dialog</Button>
      </ResponsiveDialog>
    </>
  );
};
