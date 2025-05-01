import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    UsersIcon,
    CheckCircleIcon,
    ClipboardListIcon,
    SheetIcon,
    EditIcon,
} from "lucide-react";
import { Category, File, Stage } from "@prisma/client";
import Link from "next/link";
import ForduloStudentsTable from "./fordulo-students-table";
import ForduloUpcoming from "./upcoming/fordulo-upcoming";
import ForduloOngoing from "./ongoing/fordulo-ongoing";
import ForduloFinished from "./finished/fordulo-finished";
import TaskUploader from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/_components/task-uploader";
import ListFiles from "../common/list-files";
import { getSessionRole } from "@/lib/utilities";
import { formatDate } from "@/lib/utils";
import { getStageStatistics } from "@/app/_data/stage.data";

export async function ForduloContent({
    stage,
    category,
    files,
    isAdmin = false,
}: {
    stage: Stage;
    category: Category;
    files: File[];
    isAdmin?: boolean;
}) {

    const statistics = await getStageStatistics(stage.id);
    const role = await getSessionRole();

    const canViewTasks = () => {
        if (isAdmin) return true;
        if (stage.status === "FINISHED") return true;
        if (role === "admin") {
            if (
                stage.status === "ONGOING" &&
                stage.accessStartDate &&
                new Date(stage.accessStartDate) < new Date()
            ) {
                if (stage.accessEndDate) {
                    return new Date(stage.accessEndDate) > new Date();
                }
                return true;
            }
        }
        if (
            stage.evaluationStartDate &&
            new Date(stage.evaluationStartDate) < new Date()
        ) {
            if (stage.evaluationEndDate) {
                return new Date(stage.evaluationEndDate) > new Date();
            }
            return true;
        }
        return false;
    };

    const canViewEvaluation = () => {
        if (isAdmin) return true;
        if (role === "admin") {
            if (stage.status === "FINISHED") return true;
        }
        if (
            stage.status === "ONGOING" &&
            stage.evaluationStartDate &&
            new Date(stage.evaluationStartDate) < new Date()
        ) {
            if (stage.evaluationEndDate) {
                return new Date(stage.evaluationEndDate) > new Date();
            }
            return true;
        }
        return false;
    };

    const getEvaluationUrl = () => {
        if (isAdmin)
            return `/admin/versenyek/${category.competitionId}/kategoria/${stage.categoryId}/fordulo/${stage.id}/ertekeles`;
        if (canViewEvaluation()) {
            return `/org/versenyek/${category.competitionId}/reszletek/${stage.categoryId}/fordulo/${stage.id}/ertekeles`;
        }
        return "#";
    };

    return (
        <div className="space-y-6">
            <TabsContent value="attekintes" className="mt-4">
                <div className="space-y-4">
                    <div className="flex flex-col gap-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">
                            Statisztika
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <UsersIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <div className="text-2xl font-bold">
                                            {statistics?.participants || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Résztvevők
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <CheckCircleIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <div className="text-2xl font-bold">
                                            {statistics?.submittedTasks || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Beadott feladatok
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <ClipboardListIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <div className="text-2xl font-bold">
                                            {statistics?.evaluatedTasks || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Értékelt feladatok
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="feladatok">
                <div className="space-y-4">
                    <div className="flex flex-col pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Feladatok</h4>
                        {stage.id && canViewTasks() ? (
                            <ListFiles files={files} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm text-muted-foreground">
                                    A feladatok még nem érhetők el.
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {role === "admin" &&
                                        stage.accessStartDate &&
                                        `Kezdés: ${formatDate(
                                            stage.accessStartDate
                                        )}`}
                                    {role === "admin" &&
                                        stage.accessEndDate &&
                                        ` - Befejezés: ${formatDate(
                                            stage.accessEndDate
                                        )}`}
                                </p>
                            </div>
                        )}
                        {isAdmin && (
                            <TaskUploader stageId={stage.id} files={files} />
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-t pt-4">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-medium mb-2">
                                Értékelő-táblázat
                            </h4>
                            {canViewEvaluation() ? (
                                <Link href={getEvaluationUrl()}>
                                    <Button variant="outline" className="w-fit">
                                        <SheetIcon className="h-4 w-4 mr-2" />
                                        Csoportos értékelő indítása
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm text-muted-foreground">
                                        Az értékelő-táblázat még nem érhető el.
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {stage.evaluationStartDate &&
                                            `Kezdés: ${formatDate(
                                                stage.evaluationStartDate
                                            )}`}
                                        {stage.evaluationEndDate &&
                                            ` - Befejezés: ${formatDate(
                                                stage.evaluationEndDate
                                            )}`}
                                    </p>
                                </div>
                            )}
                        </div>
                        {isAdmin && (
                            <Link
                                href={`/admin/versenyek/${category.competitionId}/kategoria/${stage.categoryId}/fordulo/${stage.id}/task`}
                            >
                                <Button variant="default" className="w-fit">
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Értékelő-szerkesztő
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="diakok" className="mt-4">
                <ForduloStudentsTable stageId={stage.id} />
            </TabsContent>
            {isAdmin && (
                <TabsContent value="adminisztracio" className="mt-4">
                    <div className="space-y-4">
                        <div className="flex flex-col pt-4 border-t">
                            {stage.status === "UPCOMING" && (
                                <ForduloUpcoming stage={stage} />
                            )}
                            {stage.status === "ONGOING" && (
                                <ForduloOngoing stage={stage} />
                            )}
                            {stage.status === "FINISHED" && (
                                <ForduloFinished stage={stage} />
                            )}
                        </div>
                    </div>
                </TabsContent>
            )}
        </div>
    );
}

export default ForduloContent;
