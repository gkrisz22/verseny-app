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
import { DatePicker } from "../../_components/common/date-picker";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useActionState } from "react";
import { createCompetition } from "@/actions/competition.action";
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
            <Label htmlFor="name">Verseny neve</Label>
            <Input id="name" name="name" type="text" className={state?.errors?.name && "border-red-500"} defaultValue={state.inputs?.name} />
            {
              state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>
            }
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="from">Kezdés</Label>
            <DatePicker date={fromDate} setDate={setFromDate} label="Válasszon dátumot" />
            <Input type="hidden" name="from" value={fromDate?.toISOString()} />
            {
              state?.errors?.from && <p className="text-red-500 text-sm">{state.errors.from}</p>
            }
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="to">Befejezés</Label>
            <DatePicker date={toDate} setDate={setToDate} label="Válasszon dátumot" />
            <Input type="hidden" name="to" value={toDate?.toISOString()} />
            {
              state?.errors?.to && <p className="text-red-500 text-sm">{state.errors.to}</p>
            }
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="type">Verseny típusa</Label>
            <Select  name="type">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Válasszon egy típust!" />
              </SelectTrigger>
              <SelectContent id="type">
                <SelectGroup>
                  <SelectLabel>Informatika</SelectLabel>
                  <SelectItem value="grafika">Grafika</SelectItem>
                  <SelectItem value="oktv">OKTV</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {
              state?.errors?.type && <p className="text-red-500 text-sm">{state.errors.type}</p>
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
