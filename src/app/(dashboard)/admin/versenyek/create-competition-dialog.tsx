'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { DatePicker } from "../../_components/common/date-picker";
import React from "react";
import { createCompetition } from "@/app/_actions/competition.action";
import { CompetitionFormData } from "@/types/form/competition";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormField from "../../_components/common/form-field";
import { useActionForm } from "@/hooks/use-action-form";

export function CreateCompetitionDialog() {
  const [open, setOpen] = React.useState(false);

  const [state, action, isPending] = useActionForm<CompetitionFormData>(createCompetition, {
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="w-fit" onClick={() => setOpen(true)}>
          <Plus /> Új verseny létrehozása
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verseny létrehozása</DialogTitle>
          <DialogDescription>
            Itt hozhat létre egy új versenyt. A verseny létrejötte után szerkesztheti azt.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col space-y-4" action={action}>
          <FormField
            type="text"
            name="title"
            id="title"
            label="Verseny neve"
            placeholder="Adja meg a verseny nevét"
            errors={state?.errors?.title}
            defaultValue={state.inputs?.title}
            required
          />
          <FormField
            type="date"
            name="startDate"
            id="startDate"
            label="Kezdés"
            defaultValue={state.inputs?.startDate}
            errors={state?.errors?.startDate}
          />
          <FormField
            type="date"
            name="endDate"
            id="endDate"
            label="Befejezés"
            defaultValue={state.inputs?.endDate}
            errors={state?.errors?.endDate}
          />
          {state?.errors && state?.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Folyamatban..." : "Létrehozás"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}