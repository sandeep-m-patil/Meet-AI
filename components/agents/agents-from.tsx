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
import { Switch } from "@/components/ui/switch";
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
    
    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                toast.success("Agent created successfully");
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id })
                    );
                }
                
                toast.success("Agent updated successfully");
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit && initialValues?.id) {
            updateAgent.mutate({
                id: initialValues.id,
                data: values,
            });
        } else {
            createAgent.mutate(values);
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
