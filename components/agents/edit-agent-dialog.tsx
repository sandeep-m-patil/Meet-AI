import ResponsiveDialog from "../dialog/responsive-dialog";
import { AgentForm } from "./agents-from";
import { AgentGetOne } from "@/modules/agents/types";

interface EditAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: AgentGetOne;
}

export const EditAgentDialog = ({ open, onOpenChange, agent }: EditAgentDialogProps) => {
    return (
        <ResponsiveDialog 
            title="Edit Agent" 
            description="Update agent details and configuration" 
            open={open} 
            onOpenChange={onOpenChange}
        >
            <AgentForm 
                initialValues={agent}
                onSuccess={() => onOpenChange(false)} 
                onCancel={() => onOpenChange(false)} 
            />
        </ResponsiveDialog>
    );
};
