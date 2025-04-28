"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import { openStage } from "@/app/_actions/stage.action";
import FormField from "@/app/(dashboard)/_components/common/form-field";

const ForduloStartForm = ({ stageId } : { stageId: string}) => {
    const [state, action, isPending] = useActionForm(openStage);
    return (
        <form className="gap-4 max-w-sm flex flex-col" action={action}>
            <input type="hidden" name="stageId" value={stageId} />
            <div className="grid grid-cols-1 gap-4">
                <FormField
                    type="date"
                    name="accessStartDate"
                    id="accessStartDate"
                    defaultValue={state?.inputs?.accessStartDate}
                    errors={state.errors?.accessStartDate}
                    label="Hozzáférési dátum"
                />
                <small className="text-muted-foreground">
                    A megbízott felhasználó (adminisztrátor) ekkortól éri el a feladatokat.
                </small>
            </div>
            <FormField
                type="checkbox"
                name="confirm"
                id="confirm"
                label="Tudomásul veszem, hogy a forduló indításra kerül."
                errors={state.errors?.confirm}
                defaultValue={state?.inputs?.confirm}
            />
            <small className="text-muted-foreground col-span-2">
                A művelettel automatikusan átmásolódnak a diákok az előző fordulóból (vagy ha ez az első, a kategóriából).
            </small>

            <Button variant="default" className="mt-2" disabled={isPending}>
                <PlayIcon className="h-4 w-4 mr-2" />
                Forduló indítása
            </Button>
        </form>
    );
};

export default ForduloStartForm;