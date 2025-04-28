"use client";
import { Label } from "@/components/ui/label";
import React from "react";
import { Button } from "@/components/ui/button";
import { EditIcon, EyeIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import { openStage, updateOngoinStage } from "@/app/_actions/stage.action";
import FormField from "../../common/form-field";
import { Stage } from "@prisma/client";

const SetDeadlines = ({ stage }: { stage: Stage }) => {
    const [state, action, isPending] = useActionForm(updateOngoinStage);

    return (
        <form className="space-y-4" action={action}>
            <input type="hidden" name="id" value={stage.id} />
            <div className="grid md:lg-grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="accessDate" className="inline-flex items-center">
                        <EyeIcon className="mr-1 size-4" /> Hozzáférési dátum
                    </Label>
                    <FormField
                        type="date"
                        name="accessStartDate"
                        id="accessStartDate"
                        label="Hozzáférési dátum"
                        defaultValue={state?.inputs?.accessStartDate || stage.accessStartDate || ""}
                        required
                    />
                    <FormField
                        type="date"
                        name="accessEndDate"
                        id="accessEndDate"
                        label="Hozzáférési dátum vége"
                        defaultValue={state?.inputs?.accessEndDate || stage.accessEndDate || ""}
                    />
                    <small className="text-muted-foreground">
                        A megbízott felhasználó (adminisztrátor) ekkortól eddig éri el a feladatokat.
                    </small>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="evaluationStartDate" className="inline-flex items-center">
                        <EditIcon className="mr-1 size-4" /> Értékelési dátum
                    </Label>
                    <FormField
                        type="date"
                        name="evaluationStartDate"
                        id="evaluationStartDate"
                        label="Értékelési dátum"
                        defaultValue={state?.inputs?.evaluationStartDate || stage.evaluationStartDate || ""}
                    />
                    <FormField
                        type="date"
                        name="evaluationEndDate"
                        id="evaluationEndDate"
                        label="Értékelési dátum vége"
                        defaultValue={state?.inputs?.evaluationEndDate || stage.evaluationEndDate || ""}
                    />
                    <small className="text-muted-foreground">
                        A forduló értékelése ekkor kezdődik és eddig tart.
                    </small>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="reevaluationStartDate" className="inline-flex items-center">
                        <EditIcon className="mr-1 size-4" /> Felülértékelés dátum
                    </Label>
                    <FormField
                        type="date"
                        name="reevaluationStartDate"
                        id="reevaluationDate"
                        label="Újraértékelési dátum"
                        defaultValue={state?.inputs?.reevaluationStartDate || stage.reevaluationStartDate || ""}
                    />
                    <FormField
                        type="date"
                        name="reevaluationEndDate"
                        id="reevaluationEndDate"
                        label="Újraértékelési dátum vége"
                        defaultValue={state?.inputs?.reevaluationEndDate || stage.reevaluationEndDate || ""}
                    />
                    <small className="text-muted-foreground">
                        A forduló újraértékelése ekkor kezdődik és eddig tart.
                    </small>
                </div>
            </div>
            {
                !state?.success && state?.message && (
                    <div className="text-sm text-red-500">
                        {state?.message}
                    </div>
                )
            }
            
            <Button variant="default" className="mt-2" disabled={isPending} type="submit">
                {isPending ? (
                    <><Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Mentés...</>
                ) : (
                <><SaveIcon className="h-4 w-4 mr-2" /> Mentés </>
                )}
            </Button>
        </form>
    );
};

export default SetDeadlines;