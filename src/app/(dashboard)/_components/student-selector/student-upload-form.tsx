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
import type { Student } from "@/types/student"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  grade: z.string().min(1, {
    message: "Please select a grade.",
  }),
})

interface StudentUploadFormProps {
  student?: Student
  onSuccess?: () => void
}

export function StudentUploadForm({ student, onSuccess }: StudentUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: student?.id || undefined,
      name: student?.name || "",
      email: student?.email || "",
      grade: student?.grade || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      if (values.id) {
        await updateStudent({
          ...values,
          id: values.id,
          addedAt: student?.addedAt || new Date().toISOString(),
        })
        toast("Diák frissítve");
      } else {
        await createStudent({
          ...values,
          id: crypto.randomUUID(),
          addedAt: new Date().toISOString(),
        })
        toast("Diák hozzáadva");
      }

      form.reset({
        id: undefined,
        name: "",
        email: "",
        grade: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast("Hiba", {
        description: "Failed to save student. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teljes név</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Osztály</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Osztály" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">7</SelectItem>
                  <SelectItem value="B">8</SelectItem>
                  <SelectItem value="C">9</SelectItem>
                  <SelectItem value="D">10</SelectItem>
                  <SelectItem value="F">11</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Jelenlegi osztály</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
            }}
            disabled={isSubmitting}
          >
            Mégsem
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {student ? "Módosítás" : "Hozzáadás"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

