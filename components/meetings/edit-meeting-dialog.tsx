'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { MeetingForm } from "./meetings-form";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface EditMeetingDialogProps {
    meeting: {
        id: string;
        name: string;
        agentId: string;
    };
}

export const EditMeetingDialog = ({ meeting }: EditMeetingDialogProps) => {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const trigger = (
        <Button variant="outline" size="sm">
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
        </Button>
    );

    return (
        <ResponsiveDialog
            isOpen={open}
            setIsOpen={setOpen}
            title="Edit Meeting"
            trigger={trigger}
        >
            <MeetingForm 
                initialValues={meeting}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </ResponsiveDialog>
    );
};
