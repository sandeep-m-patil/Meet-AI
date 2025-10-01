"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import { EditAgentDialog } from "@/components/agents/edit-agent-dialog";
import { DeleteAgentDialog } from "@/components/agents/delete-agent-dialog";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AgentDetailsProps {
  agentId: string;
}

export const AgentDetails = ({ agentId }: AgentDetailsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const trpc = useTRPC();

  const { data: agent, isLoading, error } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const deleteAgent = useMutation(
    trpc.agents.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Agent deleted successfully");
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  if (isLoading) {
    return <LoadingState title="Loading Agent" description="Please wait while we load the agent details" />;
  }

  if (error) {
    return <ErrorState title="Error Loading Agent" description={error.message} />;
  }

  if (!agent) {
    return <ErrorState title="Agent Not Found" description="The requested agent could not be found." />;
  }

  const handleDelete = () => {
    deleteAgent.mutate({ id: agentId });
  };


  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <EditAgentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        agent={agent}
      />

      <DeleteAgentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        agentName={agent.name}
        onConfirm={handleDelete}
        isLoading={deleteAgent.isPending}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/agents")}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Agents
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Agent Info Card */}
      <Card>
       
        <CardHeader>
          <div className="flex items-center gap-4">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agent.name}
              className="h-16 w-16 rounded-full border"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-semibold">{agent.name}</h1>
            </div>


            <div>
    {/* 🟢 Add meeting count badge here */}
        {agent.meetingCount !== undefined && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {agent.meetingCount} meetings
          </span>
        )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">

          <Separator />

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Instructions</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{agent.instructions}</p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>Created {formatDistanceToNow(new Date(agent.createdAt))} ago</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              <span>Updated {formatDistanceToNow(new Date(agent.updatedAt))} ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
