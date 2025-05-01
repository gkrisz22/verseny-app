
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileTextIcon, UsersIcon } from "lucide-react";
import { Category, File, Stage, Student, StudentStage } from "@prisma/client";
import { CreateStageDialog } from "../../admin/versenyek/[id]/(kategoria)/kategoria/[cat_id]/create-stage-dialog";
import Link from "next/link";
import { formatDateRange } from "@/lib/utils";

export function FordulokListingCards({category, stages, isAdmin }: {
    category: Category & { stages: Stage[] };
    stages: (Stage & { files: File[]; students: ({ student: Student; } & StudentStage)[]; })[];
    isAdmin?: boolean;
}) {

    if (!stages || stages.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium">Nincsenek fordulók.</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6">Ehhez a kategóriához még nem tartoznak fordulók.</p>
                {isAdmin && <CreateStageDialog category={category} trigger={{ variant: "default", className: "w-fit" }} />}
            </div>
        );
    }

    const getUrl = (stage: Stage) => {
        if(isAdmin) {
            return `/admin/versenyek/${category.competitionId}/kategoria/${category.id}/fordulo/${stage.id}`;
        }
        return `/org/versenyek/${category.competitionId}/reszletek/${category.id}/fordulo/${stage.id}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {isAdmin && <CreateStageDialog category={category} trigger={{ variant: "default", size: "sm", className: "w-fit" }} />}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stages.map((round) => (
                        <Link key={round.id} href={getUrl(round)} className="w-full">
                            <Card className={`cursor-pointer transition-all hover:border-primary h-full`} title={round.id}>
                                <div className="flex flex-col h-full">
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
                                    <CardContent className="pb-3 flex-grow">
                                        <div className="flex flex-wrap gap-2 items-center text-sm">
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
                                </div>
                            </Card>
                        </Link>
                    ))}
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


export default FordulokListingCards;
