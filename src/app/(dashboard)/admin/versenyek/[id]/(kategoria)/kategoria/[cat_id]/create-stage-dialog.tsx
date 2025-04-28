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
import { createStage } from "@/app/_actions/competition.action";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { useActionForm } from "@/hooks/use-action-form";
import FormField from "@/app/(dashboard)/_components/common/form-field";

export function CreateStageDialog({ category, trigger }: {
  category: Category, trigger: {
    variant: "default" | "outline",
    size?: "sm" | "md" | "lg" | "xl",
    className?: string,
    icon?: React.ReactNode,
  }
}) {
  const [open, setOpen] = React.useState(false);

  const [state, action, isPending] = useActionForm(createStage, {
    onSuccess: () => {
      toast.success("Forduló sikeresen létrehozva!");
      setOpen(false);
    }
  });



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={trigger.variant}
          className={trigger.className}
          onClick={() => setOpen(true)}
        >
          {trigger.icon ? trigger.icon : <Plus />} Új forduló létrehozása
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forduló létrehozása</DialogTitle>
          <DialogDescription>
            Itt hozhat létre egy új fordulót a verseny kategóriájához.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col space-y-4" action={action}>
          <input type="hidden" name="categoryId" value={category.id} />
          <FormField
            type="text"
            name="catName"
            id="catName"
            label="Kategória"
            defaultValue={category.name}
            readOnly
            disabled
          />
          <FormField
            type="text"
            name="name"
            id="name"
            label="Forduló neve"
            defaultValue={state.inputs?.name}
            errors={state.errors?.name}
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