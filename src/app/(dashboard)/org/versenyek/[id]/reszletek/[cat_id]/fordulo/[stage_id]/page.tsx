import ForduloContent from "@/app/(dashboard)/_components/competition/fordulo-content";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Stage } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { formatDateRange } from "@/lib/utils";
import LocalOrgStageMenu from "./_components/local-org-stage-menu";
import { getStageById } from "@/app/_data/stage.data";

const ForduloDetailsPage = async ({
    params,
}: {
    params: Promise<{ stage_id: string }>;
}) => {
    const id = (await params).stage_id;
    const stage = await getStageById(id);

    if (!stage) {
        return <div>Nem található a forduló.</div>;
    }
    
    return (
        <div>
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <StatusBadge status={stage.status} />
                    <h2 className="text-xl">{stage.name}</h2>
                    <p className="text-sm text-muted-foreground">
                        {stage.description}
                    </p>

                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                            {formatDateRange(stage.startDate, stage.endDate)}
                        </span>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <LocalOrgStageMenu>
                <ForduloContent
                    stage={stage}
                    category={stage.category}
                    files={stage.files.map((f) => f.file)}
                />
            </LocalOrgStageMenu>
        </div>
    );
};

function StatusBadge({ status }: { status: Stage["status"] }) {
    switch (status) {
        case "UPCOMING":
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 w-fit dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                >
                    Következő
                </Badge>
            );
        case "ONGOING":
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 w-fit dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                >
                    Folyamatban
                </Badge>
            );
        case "FINISHED":
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200 w-fit dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                >
                    Befejezett
                </Badge>
            );
        default:
            return null;
    }
}

export default ForduloDetailsPage;
