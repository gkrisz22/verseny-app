"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileTextIcon, UsersIcon, CheckCircleIcon, ClipboardListIcon, SheetIcon, EditIcon } from "lucide-react";
import { Category, File, Stage, Student, StudentCategory, StudentStage } from "@prisma/client";
import { CreateStageDialog } from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/create-stage-dialog";
import Link from "next/link";
import TaskFiles from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/_components/task-files";
import ForduloEditDialog from "./fordulo-edit-dialog";
import ForduloDeleteDialog from "./fordulo-delete-dialog";
import ForduloStudentsTable from "./fordulo-students-table";
import ForduloUpcoming from "./upcoming/fordulo-upcoming";
import ForduloOngoing from "./ongoing/fordulo-ongoing";
import ForduloFinished from "./finished/fordulo-finished";

export function FordulokListing({ category, stages, students, isAdmin = false }: { 
    category: Category & { stages: Stage[] }; 
    stages: (Stage & { files: File[]; students: ({ student: Student; } & StudentStage)[]; })[]; 
    students: ({ student: Student; } & StudentCategory)[]; isAdmin?: boolean; }) {
    const [selectedRoundId, setSelectedRoundId] = useState<string | null>(stages.length > 0 ? stages[0].id : null);
    const [activeTab, setActiveTab] = useState("overview");

    if (!stages || stages.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium">Nincsenek fordulók.</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6">Ehhez a kategóriához még nem tartoznak fordulók.</p>
                {isAdmin && <CreateStageDialog category={category} trigger={{ variant: "default", className: "w-fit" }} />}
            </div>
        );
    }

    const selectedRound = stages.find((stage) => stage.id === selectedRoundId) || stages[0];
    const handleRoundSelect = (stage: string) => setSelectedRoundId(stage);

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {isAdmin && <CreateStageDialog category={category} trigger={{ variant: "default", size: "sm", className: "w-fit" }} />}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stages.map((round) => (
                        <Card key={round.id} className={`cursor-pointer transition-all hover:border-primary ${selectedRoundId === round.id ? "border-primary ring-1 ring-primary" : ""}`} onClick={() => handleRoundSelect(round.id)}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text">{round.name}</CardTitle>
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
                                    <div className="flex items-center gap-1">
                                        <UsersIcon className="h-4 w-4" />
                                        <span>{round.students.length || 0} résztvevő</span>
                                    </div>
                                    {round.files && round.files.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <FileTextIcon className="h-4 w-4" />
                                            <span>{round.files.length} fájl</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between gap-2">
                                <div>
                                    {round.status === "FINISHED" && (
                                        <div className="flex items-center gap-1">
                                            <Badge variant={"outline"} className="text-xs text-muted-foreground">Továbbjutás {round.minPoints} ponttól</Badge>
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="">
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
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={selectedRound.status} />
                                    <div className="flex items-center gap-2">
                                    {isAdmin && (
                                        <>
                                            <ForduloEditDialog stage={selectedRound} />
                                            <ForduloDeleteDialog stageId={selectedRound.id} />
                                        </>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedRound.description && <p className="text-sm text-muted-foreground mb-4">{selectedRound.description}</p>}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                                <TabsList className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
                                    <TabsTrigger value="overview">Áttekintés</TabsTrigger>
                                    <TabsTrigger value="students">Diákok</TabsTrigger>
                                    {isAdmin && <TabsTrigger value="admintasks">Adminisztráció</TabsTrigger>}
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
                                                    <EditIcon className="h-4 w-4 mr-2" />Értékelő-szerkesztő
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/versenyek/${category.competitionId}/kategoria/${category.id}/fordulo/${selectedRound.id}/ertekeles`}>
                                                <Button variant="outline" className="w-fit">
                                                    <SheetIcon className="h-4 w-4 mr-2" />Csoportos értékelő
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
                                                            <div className="text-2xl font-bold">0</div>
                                                            <p className="text-xs text-muted-foreground">Beadott feladatok</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <Card>
                                                    <CardContent className="pt-6">
                                                        <div className="text-center">
                                                            <ClipboardListIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                            <div className="text-2xl font-bold">0</div>
                                                            <p className="text-xs text-muted-foreground">Értékelt feladatok</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="students" className="mt-4">
                                    <ForduloStudentsTable stageId={selectedRound.id} />
                                </TabsContent>
                                {isAdmin && (
                                    <TabsContent value="admintasks" className="mt-4">
                                        <div className="space-y-4">
                                            <div className="flex flex-col pt-4 border-t">
                                                {selectedRound.status === "UPCOMING" && <ForduloUpcoming selectedRound={selectedRound} />}
                                                {selectedRound.status === "ONGOING" && <ForduloOngoing selectedRound={selectedRound} />}
                                                {selectedRound.status === "FINISHED" && <ForduloFinished selectedRound={selectedRound} />}
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
    );
}

function StatusBadge({ status }: { status: Stage["status"] }) {
    switch (status) {
        case "UPCOMING":
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">Következő</Badge>;
        case "ONGOING":
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit dark:bg-green-900 dark:text-green-300 dark:border-green-800">Folyamatban</Badge>;
        case "FINISHED":
            return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 w-fit dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">Befejezett</Badge>;
        default:
            return null;
    }
}

function formatDateRange(startDate: Date, endDate: Date | null) {
    const start = new Date(startDate);
    if (!endDate) return start.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
    const end = new Date(endDate);
    const startFormatted = start.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
    const endFormatted = end.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
    return `${startFormatted} - ${endFormatted}`;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

export default FordulokListing;
