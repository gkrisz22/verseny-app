"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useActionForm } from "@/hooks/use-action-form";
import { BanIcon, SaveIcon, XIcon } from "lucide-react";
import React from "react";
import { closeStage } from "@/app/_actions/stage.action";
import FormField from "@/app/(dashboard)/_components/common/form-field";

const ForduloCloseDialog = ({ stageId }: { stageId: string }) => {
    const [open, setOpen] = React.useState(false);
    const [state, action, isPending] = useActionForm(closeStage, {
        onSuccess: () => {
            setOpen(false);
        }
    });

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-fit">
                    <BanIcon className="h-4 w-4 mr-1" /> Forduló lezárása
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Forduló lezárása</DialogTitle>
                    <DialogDescription>
                        Kérem, adja meg azt a pontszámot, amely alatt a diákok nem jutnak tovább a következő fordulóba.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4" action={action}>
                    <input type="hidden" name="stageId" value={stageId} />
                    <FormField
                        type="number"
                        name="points"
                        id="points"
                        min={0}
                        defaultValue={state?.inputs?.points || 0}
                        errors={state.errors?.points}
                        label="Minimum pontszám továbbjutáshoz"
                    />
                    <FormField
                        type="checkbox"
                        name="confirm"
                        id="confirm"
                        label="Tudomásul veszem, hogy a forduló lezárásra kerül."
                        errors={state.errors?.confirm}
                        defaultValue={state?.inputs?.confirm}
                    />
                    <p className="text-sm text-muted-foreground">A művelet visszavonhatatlan, és a forduló véglegesen lezárásra kerül.</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                <XIcon className="h-4 w-4 mr-1" /> Mégsem
                            </Button>
                        </DialogClose>
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

export default ForduloCloseDialog;