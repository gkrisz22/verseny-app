"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
import FormField from "@/app/(dashboard)/_components/common/form-field";
import { AcademicYear } from "@prisma/client";
import { useActionForm } from "@/hooks/use-action-form";
import { handleAcademicYear } from "@/app/_actions/settings.action";

const _CONTENT = {
    new: {
        title: "Új tanév létrehozása",
        description:
            "Hozzon létre egy új tanévet. A tanév létrejötte után szerkesztheti azt.",
    },
    edit: {
        title: "Tanév szerkesztése",
        description: "Szerkessze a tanévet.",
    },
};

export function ManageTanevDialog({
    children,
    tanev,
}: {
    children: React.ReactNode;
    tanev?: AcademicYear;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleClose = () => {
        setOpen(false);
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen} modal>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {tanev ? _CONTENT.edit.title : _CONTENT.new.title}
                        </DialogTitle>
                        <DialogDescription>
                            {tanev
                                ? _CONTENT.edit.description
                                : _CONTENT.new.description}
                        </DialogDescription>
                    </DialogHeader>
                    <TanevForm tanev={tanev} closeDialog={handleClose} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} modal>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>
                        {tanev ? _CONTENT.edit.title : _CONTENT.new.title}
                    </DrawerTitle>
                    <DrawerDescription>
                        {tanev
                            ? _CONTENT.edit.description
                            : _CONTENT.new.description}
                    </DrawerDescription>
                </DrawerHeader>
                <TanevForm className="px-4" tanev={tanev} closeDialog={handleClose} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Mégsem</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function TanevForm({
    tanev,
    className,
    closeDialog,
}: React.ComponentProps<"form"> & { tanev?: AcademicYear, closeDialog: () => void }) {
    const [state, action, isPending] = useActionForm(handleAcademicYear, {
        onSuccess: () => {
            closeDialog();
        }
    });
    return (
        <form
            className={cn("grid items-start gap-4", className)}
            action={action}
        >
            {tanev && <input type="hidden" name="id" value={tanev.id} />}
            <FormField
                type="text"
                name="name"
                id="name"
                label="Tanév neve"
                placeholder="2023/2024"
                colSpan={12}
                required
                defaultValue={state.inputs?.name || tanev?.name}
            />
            <FormField
                type="date"
                name="startDate"
                id="startDate"
                label="Kezdés dátuma"
                placeholder="2023-09-01"
                colSpan={12}
                required
                defaultValue={state.inputs?.startDate || tanev?.startDate}
            />
            <FormField
                type="date"
                name="endDate"
                id="endDate"
                label="Befejezés dátuma"
                placeholder="2024-06-30"
                colSpan={12}
                required
                defaultValue={state.inputs?.endDate || tanev?.endDate}
            />
            {state?.errors?.startDate && (
                <p className="text-red-500 text-sm">{state.errors.startDate}</p>
            )}
            {state?.errors?.endDate && (
                <p className="text-red-500 text-sm">{state.errors.endDate}</p>
            )}
            {!state?.success && (
                <p className="text-red-500 text-sm">{state?.message}</p>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending
                    ? "Kérem várjon..."
                    : tanev
                    ? "Tanév szerkesztése"
                    : "Tanév létrehozása"}
            </Button>
        </form>
    );
}
