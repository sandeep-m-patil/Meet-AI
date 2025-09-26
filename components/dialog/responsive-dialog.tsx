import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface ResponsiveDialogProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export default function ResponsiveDialog({
    title,
    description,
    children,
    open,
    onOpenChange,
}: ResponsiveDialogProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        if (isMobile) return <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerClose />
                </DrawerHeader>
                <DrawerDescription>{description}</DrawerDescription>
                <div className="p-4">
                    {children}
                </div>
                \
            </DrawerContent>
        </Drawer>;

    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <DialogDescription>{description}</DialogDescription>
                {children}

            </DialogContent>
        </Dialog>
    )
}

