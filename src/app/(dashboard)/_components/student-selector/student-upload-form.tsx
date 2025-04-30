"use client"

import { Button } from "@/components/ui/button"
import { createStudent } from "@/app/_actions/student.action"
import { Loader2 } from "lucide-react"
import { Student } from "@prisma/client"
import { useActionForm } from "@/hooks/use-action-form"
import FormField from "../common/form-field"
import { DialogClose } from "@/components/ui/dialog"


interface StudentUploadFormProps {
  student?: Student;
  onSuccess?: () => void;
}

export function StudentUploadForm({ student, onSuccess }: StudentUploadFormProps) {
  const [state, action, isPending] = useActionForm(createStudent, {
    onSuccess: () => {
      onSuccess?.();
    }
  });

  return (
    <form action={action} className="grid md:grid-cols-2 gap-4 w-full">
      {
        student && (
          <input type="hidden" name="id" value={student?.id} />
        )
      }
      <div className="grid gap-6">
        <FormField id="name" name="name" type="text" placeholder="Név" errors={state?.errors?.name} label={"Név"} defaultValue={state?.inputs?.name || student?.name || ""} />
      </div>

      <div className="grid gap-2">
        <FormField
          id="grade"
          name="grade"
          type="select"
          placeholder="Osztály"
          errors={state?.errors?.grade}
          label={"Osztály"}
          defaultValue={state?.inputs?.grade || student?.grade?.toString() || "0"}
          options={[
            { value: "0", label: "Válasszon osztályt" },
            ...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((grade) => ({
              value: grade.toString(),
              label: grade.toString(),
            })),
          ]}
        />
      </div>
      <div className="grid gap-2 col-span-2">
        <p className="text-sm text-muted-foreground">
          Már létezik a tanuló a rendszerben egy másik szervezetnél?<br />Használja a diák egyedi azonosítóját, hogy szervezetéhez csatolja őt.
        </p>
      </div>
      <div className="grid gap-6">
        <FormField id="uniqueId" name="uniqueId" type="text" placeholder="Diák egyedi azonosítója" errors={state?.errors?.uniqueId} label={"Diák azonosítója"} defaultValue={state?.inputs?.uniqueId || student?.uniqueId || ""} readOnly={!!student} />
      </div>

      {
        state?.message && !state?.success &&
        <div className="col-span-2 text-red-500">
          {state?.message}
        </div>
      }

      <div className="w-full col-span-2  flex justify-end gap-2">
        <DialogClose asChild>
        <Button type="button" variant="outline">
          Mégsem
        </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {student ? "Módosítás" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  )
}