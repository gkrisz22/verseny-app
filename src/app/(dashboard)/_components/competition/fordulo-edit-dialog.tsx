"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@/hooks/use-action-form";
import { Stage } from "@prisma/client";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import React from "react";
import { DatePicker } from "../common/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { updateStage } from "@/app/_actions/stage.action";

const ForduloEditDialog = ({ stage }: { stage: Stage }) => {
    const [state, action, isPending] = useActionForm(updateStage, {
        onSuccess: () => {
            setIsEditDialogOpen(false);
            if(state.inputs?.startDate) {
                setStartDate(new Date(state.inputs?.startDate));
            }
            if(state.inputs?.endDate) {
                setEndDate(new Date(state.inputs?.endDate));
            }
            setIsEditDialogOpen(false);
        },
    });
    const [startDate, setStartDate] = React.useState<Date | undefined>(stage.startDate || undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(stage.endDate || undefined);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} modal>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                    <EditIcon className="h-4 w-4 mr-1" />
                    Szerkesztés
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Forduló szerkesztése</DialogTitle>
                    <DialogDescription>Módosítsd a forduló adatait, majd kattints a Mentés gombra.</DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4" action={action}>
                    <Input type="hidden" name="stageId" value={stage.id} />
                    <div className="grid gap-2">
                        <Label htmlFor="name">Forduló neve</Label>
                        <Input id="name" name="name" defaultValue={state?.inputs?.name || stage.name || ""} />
                        {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Kezdő dátum</Label>
                            <DatePicker label="Kezdő dátum" date={startDate} setDate={setStartDate} />
                            <Input type="hidden" name="startDate" value={startDate?.toISOString()} />
                            {state?.errors?.startDate && <p className="text-red-500 text-sm">{state.errors.startDate}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">Záró dátum</Label>
                            <DatePicker label="Záró dátum" date={endDate} setDate={setEndDate} />
                            <Input type="hidden" name="endDate" value={endDate?.toISOString()} />
                            {state?.errors?.endDate && <p className="text-red-500 text-sm">{state.errors.endDate}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Leírás</Label>
                        <Textarea id="description" defaultValue={state?.inputs?.description || stage.description || ""} name="description" rows={3} />
                        {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
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

export default ForduloEditDialog;