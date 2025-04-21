"use client";

import { createTaskGroup } from "@/app/_actions/task.action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@/hooks/use-action-form";
import { TaskGroup } from "@prisma/client";
import { PlusIcon, SaveIcon, XIcon } from "lucide-react";
import React from "react";



const CreateTaskGroupDialog = ({ stageId, onAdded }: { stageId: string, onAdded: (tg: TaskGroup) => void }) => {
    const [state, action, isPending] = useActionForm(createTaskGroup);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (state?.success) {
            setIsEditDialogOpen(false);
            if(state.data)  onAdded(state.data);
        }
    }, [state?.success, onAdded, state?.data]);

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} modal>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" onClick={() => setIsEditDialogOpen(true)} className="w-fit">
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
                    <Input type="hidden" name="stageId" value={stageId} />
                    <div className="grid gap-2">
                        <Label htmlFor="title">Név</Label>
                        <Input id="title" name="title" type="text" defaultValue={state?.inputs?.title} />
                        {state?.errors?.title && <p className="text-red-500 text-sm">{state.errors.title}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            <XIcon className="h-4 w-4 mr-1" /> Mégsem
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" /> Mentés...
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