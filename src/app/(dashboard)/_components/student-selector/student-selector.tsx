"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentUploadForm } from "./student-upload-form"
import { StudentLibrary } from "./student-library"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, X } from "lucide-react"
import { Student } from "@prisma/client"

interface StudentSelectorProps {
  onSelect?: (student: Student) => void
  onSelectMultiple?: (students: Student[]) => void
  buttonLabel?: string
  selectedStudent?: Student | null
  selectedStudents?: Student[]
  multipleSelection?: boolean
  showSelected?: boolean
  exclude?: string[]
}

export function StudentSelector({
  onSelect,
  onSelectMultiple,
  buttonLabel = "Diákok kiválasztása",
  selectedStudent = null,
  selectedStudents = [],
  multipleSelection = false,
  showSelected = true,
  exclude = [],
}: StudentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("library")
  const [internalSelectedStudents, setInternalSelectedStudents] = useState<Student[]>(selectedStudents)

  const handleSelect = (student: Student) => {
    if (!multipleSelection && onSelect) {
      onSelect(student)
      setOpen(false)
    }
  }

  const handleMultipleSelect = (students: Student[]) => {
    setInternalSelectedStudents(students)
  }

  const handleConfirmMultipleSelection = () => {
    if (onSelectMultiple) {
      onSelectMultiple(internalSelectedStudents)
    }
    setOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (open) {
      setActiveTab("library")
      setInternalSelectedStudents(selectedStudents)
    }
  }

  const removeSelectedStudent = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalSelectedStudents(internalSelectedStudents.filter((s) => s.id !== student.id))
    if (onSelectMultiple) {
      onSelectMultiple(internalSelectedStudents.filter((s) => s.id !== student.id))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start" asChild>
          {showSelected && multipleSelection ? (
            internalSelectedStudents.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 text-left">
                <Users className="h-4 w-4 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {internalSelectedStudents.map((student) => (
                    <Badge key={student.id} variant="secondary" className="flex items-center gap-1">
                      {student.name}
                      <button
                        onClick={(e) => removeSelectedStudent(student, e)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">{student.name} törlése</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{buttonLabel}</span>
              </div>
            )
          ) : showSelected && selectedStudent ? (
            <div className="flex items-center gap-2 text-left">
              <Users className="h-4 w-4" />
              <div className="flex-1 truncate">
                <span className="font-medium">{selectedStudent.name}</span>
                <span className="ml-2 text-muted-foreground">({selectedStudent.uniqueId})</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{buttonLabel}</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogTitle>Diákok</DialogTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="library">Diákok</TabsTrigger>
              <TabsTrigger value="upload">Létrehozás</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("upload")} className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Új diák
            </Button>
          </div>

          <TabsContent value="upload" className="mt-4">
            <StudentUploadForm onSuccess={() => setActiveTab("library")} />
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            <StudentLibrary
              onSelect={handleSelect}
              onSelectMultiple={handleMultipleSelect}
              selectedStudents={internalSelectedStudents}
              multipleSelection={multipleSelection}
              exclude={exclude}
            />
            {multipleSelection && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {internalSelectedStudents.length} kiválasztva
                </div>
                <Button onClick={handleConfirmMultipleSelection}>Kiválasztás</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

