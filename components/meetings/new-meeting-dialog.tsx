'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { MeetingForm } from "./meetings-form";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

export const NewMeetingDialog = () => {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const trigger = (
        <Button className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Meeting
        </Button>
    );

    return (
        <ResponsiveDialog
            isOpen={open}
            setIsOpen={setOpen}
            title="New Meeting"
            description="Create a new meeting"
            trigger={trigger}
        >
            <MeetingForm 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </ResponsiveDialog>
    );
};
