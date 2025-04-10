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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { DatePicker } from "../../../_components/common/date-picker";
import React, { useActionState } from "react";
import { createCompetition } from "@/app/_actions/competition.action";
import { CompetitionFormData } from "@/types/form/competition";
import { toast } from "sonner";
import { ActionResponse } from "@/types/form/action-response";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: ActionResponse<CompetitionFormData> = {
  success: false,
  message: "",
}
export function CreateCompetitionDialog() {
  const [state, action, isPending] = useActionState(createCompetition, initialState)

  const [fromDate, setFromDate] = React.useState<Date | undefined>(new Date())
  const [toDate, setToDate] = React.useState<Date | undefined>(new Date())

  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      setFromDate(new Date())
      setToDate(new Date())
      toast.success("Verseny sikeresen létrehozva!")
    }
  }, [state.success])

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-fit" onClick={() => setOpen(true)}><Plus /> Új verseny</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Verseny létrehozása
          </DialogTitle>
          <DialogDescription>
            Itt hozhat létre egy új versenyt. A verseny létrejötte után szerkesztheti azt.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col space-y-4" action={action}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="title">Verseny neve</Label>
            <Input id="title" name="title" type="text" className={state?.errors?.title && "border-red-500"} defaultValue={state.inputs?.title} />
            {
              state?.errors?.title && <p className="text-red-500 text-sm">{state.errors.title}</p>
            }
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="startDate">Kezdés</Label>
            <DatePicker date={fromDate} setDate={setFromDate} label="Válasszon dátumot" />
            <Input type="hidden" name="startDate" value={fromDate?.toISOString()} />
            {
              state?.errors?.startDate && <p className="text-red-500 text-sm">{state.errors.startDate}</p>
            }
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="endDate">Befejezés</Label>
            <DatePicker date={toDate} setDate={setToDate} label="Válasszon dátumot" />
            <Input type="hidden" name="endDate" value={toDate?.toISOString()} />
            {
              state?.errors?.endDate && <p className="text-red-500 text-sm">{state.errors.endDate}</p>
            }
          </div>
          {
            (state?.errors && state?.message ) && <>
            <Alert variant={state.success ? "default" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            </>
          }

          
          <DialogFooter>
            <Button type="submit">Létrehozás</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
