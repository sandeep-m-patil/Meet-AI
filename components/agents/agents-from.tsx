'use client';

import { agentsInsertSchema } from "@/modules/agents/schemas";
import { AgentGetOne } from "@/modules/agents/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "../avatar/generated-avatar";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
    const trpc = useTRPC();

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const queryClient = new QueryClient();
    const createAgentMutation = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

                if (initialValues) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id })
                    );
                }

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const isPending = createAgentMutation.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("Edit mode - submission not implemented yet");
        } else {
            console.log("Create mode - submitting", values);
            createAgentMutation.mutate(values);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center space-x-4">
                    <GeneratedAvatar
                        seed={form.watch("name") || "A"}
                        variant="botttsNeutral"
                        className="rounded-full"
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Agent Name" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Instructions..." {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        {isEdit ? "Update Agent" : "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
