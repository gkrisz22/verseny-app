"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@/hooks/use-action-form";
import { BanIcon, SaveIcon, XIcon } from "lucide-react";
import React from "react";
import { closeStage } from "@/app/_actions/stage.action";
import { Checkbox } from "@/components/ui/checkbox";

const ForduloCloseDialog = ({ stageId }: { stageId: string }) => {
    const [state, action, isPending] = useActionForm(closeStage);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (state?.success) setIsEditDialogOpen(false);
    }, [state?.success]);

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} modal>
            <DialogTrigger asChild>
                <Button variant="destructive" onClick={() => setIsEditDialogOpen(true)} className="w-fit">
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
                    <Input type="hidden" name="stageId" value={stageId} />
                    <div className="grid gap-2">
                        <Label htmlFor="points">Minimum pontszám továbbjutáshoz</Label>
                        <Input id="points" name="points" type="number" min={0} defaultValue={state?.inputs?.points || 0} />
                        {state?.errors?.points && <p className="text-red-500 text-sm">{state.errors.points}</p>}
                    </div>
                    <div className="items-top flex space-x-2">
                        <Checkbox id="confirm" name="confirm" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Tudomásul veszem, hogy a forduló lezárásra kerül.
                            </Label>
                            <p className="text-sm text-muted-foreground">A művelet visszavonhatatlan, és a forduló véglegesen lezárásra kerül.</p>
                        </div>
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

export default ForduloCloseDialog;