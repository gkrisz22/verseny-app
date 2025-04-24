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
import { useActionForm } from "@/hooks/use-action-form";
import { inviteUser } from "@/app/_actions/user.action";


export function InviteAdminDialog({
    children,
}: {
    children: React.ReactNode;
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
                            Új adminisztrátor meghívása
                        </DialogTitle>
                        <DialogDescription>
                            Itt hozhat létre egy új adminisztrátort.
                        </DialogDescription>
                    </DialogHeader>
                    <InviteForm closeDialog={handleClose} />
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
                        Új adminisztrátor meghívása
                    </DrawerTitle>
                    <DrawerDescription>
                        Itt hozhat létre egy új adminisztrátort.
                    </DrawerDescription>
                </DrawerHeader>
                <InviteForm className="px-4" closeDialog={handleClose} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Mégsem</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function InviteForm({
    className,
    closeDialog,
}: React.ComponentProps<"form"> & {closeDialog: () => void }) {
    const [state, action, isPending] = useActionForm(inviteUser, {
        onSuccess: () => {
            closeDialog();
        }
    });
    return (
        <form className={cn("grid items-start gap-4", className)} action={action}>
            <input type="hidden" name="superAdmin" value="true" />
            <FormField
                label="Név"
                name="name"
                id="name"
                type="text"
                defaultValue={state?.inputs?.name}
                errors={state?.errors?.name}
                required
                placeholder="Felhasználó neve"
            />

            <FormField
                label="E-mail cím"
                name="email"
                id="email"
                type="text"
                defaultValue={state?.inputs?.email}
                errors={state?.errors?.email}
                required
                placeholder="felhasználó@domain.hu"
            />
            <small>
                Ha már meglévő felhasználó, úgy innentől kezdve adminisztrátorként is beléphet.
            </small>
            
            {!state?.success && (
                <p className="text-red-500 text-sm">{state?.message}</p>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Küldés..." : "Meghívás küldése"}
            </Button>
        </form>
    );
}
