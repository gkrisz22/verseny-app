"use client";

import FormField from "@/app/(dashboard)/_components/common/form-field";
import { createTaskGroup } from "@/app/_actions/task.action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useActionForm } from "@/hooks/use-action-form";
import { LoaderIcon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import React from "react";

const CreateTaskGroupDialog = ({ stageId, onAdded }: { stageId: string, onAdded: (tg: { id: string, stageId: string, title: string}) => void }) => {
    const [opened, setOpened] = React.useState(false);

    const [state, action, isPending] = useActionForm(createTaskGroup, {
        onSuccess: (data: { id: string, stageId: string, title: string}) => {
            onAdded(data as { id: string, stageId: string, title: string});
            setOpened(false);

        }
    });

    return (
        <Dialog modal open={opened} onOpenChange={setOpened}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="w-fit">
                    <PlusIcon className="h-4 w-4 mr-1" /> Új feladatcsoport létrehozása
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Új feladatcsoort</DialogTitle>
                    <DialogDescription>
                        Kérem, adja meg a feladatcsoport nevét.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4" action={action}>
                    <input type="hidden" name="stageId" value={stageId} />
                    <div className="grid gap-2">
                        <FormField type="text" label="Név" id="title" name="title" errors={state?.errors?.title} defaultValue={state?.inputs?.title} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button type="button" variant="outline">
                            <XIcon className="h-4 w-4 mr-1" /> Mégsem
                        </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <LoaderIcon className="animate-spin h-4 w-4 mr-2" /> Mentés...
                                </>
                            ) : (
                                <>
                                    <SaveIcon className="h-4 w-4 mr-1" /> Mentés
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTaskGroupDialog;