"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ClipboardListIcon,
  DownloadIcon,
  SheetIcon,
} from "lucide-react"
import { Category, File, Stage } from "@prisma/client"
import { CreateStageDialog } from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/create-stage-dialog"
import Link from "next/link"
import TaskFiles from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/_components/task-files"

// Define types
type Round = {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  participantCount?: number
  description?: string
  tasks?: { id: string; name: string }[]
}

type Student = {
  id: string
  name: string
  school: string
  grade: string
  points?: number
  status?: "submitted" | "not_submitted" | "evaluated"
  avatarUrl?: string
}

type AdminTask = {
  id: string
  name: string
  description: string
  dueDate: string
  status: "pending" | "in_progress" | "completed"
  assignedTo?: string
}

export function FordulokListing({ category, stages, isAdmin = false }: { category: Category & { stages: Stage[] }, stages: (Stage & { files: File[] })[], isAdmin?: boolean }) {
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(stages.length > 0 ? stages[0].id : null)
  const [students, setStudents] = useState<Student[]>([])
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Nincsenek fordulók.</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6">Ehhez a kategóriához még nem tartoznak fordulók.</p>
        {isAdmin && (
          <CreateStageDialog category={category} trigger={{
            variant: "default",
            className: "w-fit",
          }} />)}
      </div>
    )
  }

  const selectedRound = stages.find((stage) => stage.id === selectedRoundId) || stages[0];

  const handleRoundSelect = (stage: string) => {
    setSelectedRoundId(stage)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          {stages.map((round) => (
            <Card
              key={round.id}
              className={`cursor-pointer transition-all hover:border-primary ${selectedRoundId === round.id ? "border-primary ring-1 ring-primary" : ""
                }`}
              onClick={() => handleRoundSelect(round.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{round.name}</CardTitle>
                  <StatusBadge status={round.status} />
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateRange(round.startDate, round.endDate)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  {(
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>{10} résztvevő</span>
                    </div>
                  )}

                  {/*{round.tasks && round.tasks.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FileTextIcon className="h-4 w-4" />
                      <span>{round.tasks.length} feladat</span>
                    </div>
                  )}*/}
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="pt-0 flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Forduló törlése</DialogTitle>
                        <DialogDescription>
                          Biztosan törölni szeretnéd a(z) {round.name} fordulót? Ez a művelet nem vonható vissza.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Mégsem</Button>
                        <Button variant="destructive">Törlés</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              )}
            </Card>
          ))}

          {isAdmin && (
            <CreateStageDialog category={category} trigger={{
              variant: "outline",
              size: "sm",
              className: "w-full",
            }} />
          )}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedRound.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDateRange(selectedRound.startDate, selectedRound.endDate)}</span>
                    </div>
                  </CardDescription>
                </div>
                <StatusBadge status={selectedRound.status} />
              </div>
            </CardHeader>
            <CardContent>
              {selectedRound.description && (
                <p className="text-sm text-muted-foreground mb-4">{selectedRound.description}</p>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Áttekintés</TabsTrigger>
                  <TabsTrigger value="students">Diákok</TabsTrigger>
                  {isAdmin && <TabsTrigger value="admin">Admin feladatok</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex flex-col pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Feladatok</h4>
                    {selectedRoundId && <TaskFiles stageId={selectedRoundId} files={selectedRound.files} />}
                    </div>
                    <div className="flex flex-col gap-4 border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Értékelő-táblázat</h4>
                      <Link href={`/admin/versenyek/${category.competitionId}/kategoria/${category.id}/fordulo/${selectedRound.id}/task`}>
                        <Button variant="outline" className="w-fit">
                          <SheetIcon className="h-4 w-4 mr-2" />
                          Értékelő
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-col gap-4 border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Statisztika</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <UsersIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <div className="text-2xl font-bold">{0}</div>
                              <p className="text-xs text-muted-foreground">Résztvevők</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <CheckCircleIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <div className="text-2xl font-bold">
                                {students.filter((s) => s.status === "submitted" || s.status === "evaluated").length}
                              </div>
                              <p className="text-xs text-muted-foreground">Beadott feladatok</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <ClipboardListIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <div className="text-2xl font-bold">
                                {students.filter((s) => s.status === "evaluated").length}
                              </div>
                              <p className="text-xs text-muted-foreground">Értékelt feladatok</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Név</TableHead>
                          <TableHead>Iskola</TableHead>
                          <TableHead>Osztály</TableHead>
                          <TableHead>Állapot</TableHead>
                          {isAdmin && <TableHead>Pontszám</TableHead>}
                          {isAdmin && <TableHead className="text-right">Műveletek</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {student.avatarUrl ? (
                                    <AvatarImage src={student.avatarUrl || "/placeholder.svg"} alt={student.name} />
                                  ) : null}
                                  <AvatarFallback>
                                    <UserIcon className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                {student.name}
                              </div>
                            </TableCell>
                            <TableCell>{student.school}</TableCell>
                            <TableCell>{student.grade}. osztály</TableCell>
                            <TableCell>
                              <StudentStatusBadge status={student.status} />
                            </TableCell>
                            {isAdmin && <TableCell>{student.points !== undefined ? student.points : "-"}</TableCell>}
                            {isAdmin && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <EditIcon className="h-4 w-4 mr-1" />
                                    Értékelés
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="admin" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Admin feladatok:</h3>
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Új feladat
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {adminTasks.map((task) => (
                          <Card key={task.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{task.name}</CardTitle>
                                <AdminTaskStatusBadge status={task.status} />
                              </div>
                              <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>Határidő: {formatDate(task.dueDate)}</span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-sm mt-1">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>Felelős: {task.assignedTo}</span>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <EditIcon className="h-4 w-4 mr-1" />
                                Szerkesztés
                              </Button>
                              <Button variant={task.status === "completed" ? "outline" : "default"} size="sm">
                                {task.status === "completed" ? (
                                  <>
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Újranyitás
                                  </>
                                ) : (
                                  <>
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Kész
                                  </>
                                )}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Stage["status"] }) {
  switch (status) {
    case "UPCOMING":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Következő
        </Badge>
      )
    case "ONGOING":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Aktív
        </Badge>
      )
    case "FINISHED":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Lezárult
        </Badge>
      )
    default:
      return null
  }
}

function StudentStatusBadge({ status }: { status?: Student["status"] }) {
  switch (status) {
    case "submitted":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Beadva
        </Badge>
      )
    case "not_submitted":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Nincs beadva
        </Badge>
      )
    case "evaluated":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Értékelve
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          -
        </Badge>
      )
  }
}

function AdminTaskStatusBadge({ status }: { status: AdminTask["status"] }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Függőben
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Folyamatban
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Kész
        </Badge>
      )
    default:
      return null
  }
}

function formatDateRange(startDate: Date, endDate: Date | null) {
  const start = new Date(startDate)
  if (!endDate) return start.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const end = new Date(endDate)

  const startFormatted = start.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const endFormatted = end.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return `${startFormatted} - ${endFormatted}`
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default FordulokListing;