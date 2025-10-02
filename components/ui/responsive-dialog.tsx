'use client';

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    description?: string;
    trigger: React.ReactNode;
}

export function ResponsiveDialog({
    children,
    isOpen,
    setIsOpen,
    title,
    description,
    trigger,
}: ResponsiveDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="text-left pb-2">
                    <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription className="text-sm text-muted-foreground">
                            {description}
                        </DrawerDescription>
                    )}
                </DrawerHeader>
                <div className="px-4 pb-6 overflow-y-auto">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

