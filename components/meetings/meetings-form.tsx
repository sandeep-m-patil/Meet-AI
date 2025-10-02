"use client";

import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AgentSearchSelect } from "./agent-search-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

interface MeetingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name?: string;
    agentId?: string;
  };
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const [selectedAgentId, setSelectedAgentId] = useState(
    initialValues?.agentId || ""
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name || "",
      agentId: initialValues?.agentId || "",
    },
  });

  // Fetch agents
  const {
    data: agentsData,
    isLoading: agentsLoading,
    error: agentsError,
  } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 1,
      pageSize: 50,
    })
  );

  const isEdit = !!initialValues?.id;
  const queryClient = useQueryClient();

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["meetings", "getMany"],
        });
        toast.success("Meeting created successfully");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["meetings", "getMany"],
        });

        if (initialValues?.id) {
          await queryClient.invalidateQueries({
            queryKey: ["meetings", "getOne", { id: initialValues.id }],
          });
        }

        toast.success("Meeting updated successfully");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateMeeting.mutate({
        id: initialValues.id,
        data: values,
      });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Startup Coaching Call"
                    {...field}
                    disabled={isPending}
                    className="mt-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Agent */}
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Agent</FormLabel>
                <FormControl>
                  <div className="mt-1">
                    <AgentSearchSelect
                      agents={agentsData?.items || []}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedAgentId(value);
                      }}
                      placeholder="Select an agent"
                      disabled={isPending}
                      isLoading={agentsLoading}
                    />
                  </div>
                </FormControl>

                {/* Subtext */}
                <p className="text-sm text-muted-foreground mt-1">
                  Not found what you're looking for?{" "}
                  <Link
                    href="/agents"
                    className="hover:underline"
                  >
                    Create new agent
                  </Link>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isPending || agentsLoading}
              className="px-6"
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
