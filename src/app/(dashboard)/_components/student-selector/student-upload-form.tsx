"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createStudent, updateStudent } from "@/app/_actions/student.action"
import { Loader2 } from "lucide-react"
import { Student } from "@prisma/client"
import { useActionForm } from "@/hooks/use-action-form"
import { Label } from "@/components/ui/label"


interface StudentUploadFormProps {
  student?: Student
  onSuccess?: () => void
}

export function StudentUploadForm({ student, onSuccess }: StudentUploadFormProps) {
  const [state, action, isPending] = useActionForm(createStudent);

  return (
    <form action={action} className="grid md:grid-cols-2 gap-4 w-full">
      <div className="grid gap-6">
        <Input name="name" type="text" placeholder="Név" />
      </div>

      <div className="grid gap-6">
        <Select name="grade" defaultValue={student?.grade?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Osztály" />
          </SelectTrigger>
          <SelectContent>
            {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade, index) => (
              <SelectItem key={index} value={grade.toString()}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full col-span-2  flex justify-end gap-2">
        <Button type="button" variant="outline">
          Mégsem
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {student ? "Módosítás" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  )
}

