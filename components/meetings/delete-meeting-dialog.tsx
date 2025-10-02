'use client';

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteMeetingDialogProps {
    meeting: {
        id: string;
        name: string;
    };
}

export const DeleteMeetingDialog = ({ meeting }: DeleteMeetingDialogProps) => {
    const [open, setOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const deleteMeeting = useMutation(
        trpc.meetings.delete.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ['meetings', 'getMany'] });
                toast.success("Meeting deleted successfully");
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const handleDelete = () => {
        deleteMeeting.mutate({ id: meeting.id });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-red-500 text-white">
                    <TrashIcon className="mr-2 h-4 w-4 " />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Meeting</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{meeting.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={deleteMeeting.isPending}
                    >
                        {deleteMeeting.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
