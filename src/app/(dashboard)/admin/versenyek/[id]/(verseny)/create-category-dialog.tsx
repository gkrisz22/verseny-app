"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";
import { createCategory } from "@/app/_actions/category.action";
import { toast } from "sonner";
import { Competition } from "@prisma/client";
import { useActionForm } from "@/hooks/use-action-form";
import FormField from "@/app/(dashboard)/_components/common/form-field";

export function CreateCategoryDialog({
  competition,
}: {
  competition: Competition;
}) {
  const [open, setOpen] = React.useState(false);

  const [state, action, isPending] = useActionForm(createCategory, {
    onSuccess: () => {
      toast.success("Kategória sikeresen létrehozva!");
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-fit"
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <Plus /> Új kategória
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kategória létrehozása</DialogTitle>
          <DialogDescription>
            Itt hozhat létre egy új kategóriát a versenyhez.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col space-y-4" action={action}>
          <FormField
            type="text"
            name="compName"
            id="compName"
            label="Verseny"
            defaultValue={competition.title}
            required
            readOnly
            disabled
          />
          <input type="hidden" name="competitionId" value={competition.id} />
          <FormField
            type="text"
            name="name"
            id="name"
            label="Kategória neve"
            defaultValue={state.inputs?.name}
            errors={state.errors?.name}
            required
          />
          {state.errors && state.message && (
            <p
              className={
                (state.success ? "text-green-500" : "text-red-500") + " text-sm"
              }
            >
              {state.message}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Létrehozás..." : "Létrehozás"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}