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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import React, { useActionState } from "react";
import { createStage } from "@/actions/competition.action";
import { StageFormData } from "@/types/form/competition";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { ActionResponse } from "@/types/form/action-response";

const initialState: ActionResponse<StageFormData> = {
  success: false,
  message: "",
};
export function CreateStageDialog({ category }: { category: Category }) {
  const [state, action, isPending] = useActionState(
    createStage,
    initialState
  );

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success("Forduló sikeresen létrehozva!");
    }

    console.log(state);
  }, [state.success, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-fit"
          onClick={() => setOpen(true)}
        >
          <Plus /> Új forduló
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
          <div className="flex flex-col space-y-2">
            <Label htmlFor="compName">Kategória</Label>
            <Input
              id="catName"
              name="catName"
              type="text"
              readOnly
              value={category.name}
              disabled
            />
            <Input
              id="categoryId"
              name="categoryId"
              type="hidden"
              value={category.id}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="cat_name">Forduló neve</Label>
            <Input
              id="name"
              name="name"
              type="text"
              className={state?.errors?.name && "border-red-500"}
              defaultValue={state?.inputs?.name}
            />
            {state?.errors?.name && (
              <p className="text-red-500 text-sm">{state.errors.name}</p>
            )}
          </div>

          {state?.errors && state?.message && (
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
