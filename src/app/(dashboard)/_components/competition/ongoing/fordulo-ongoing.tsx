import React from "react";
import { Stage } from "@prisma/client";
import ForduloCloseDialog from "./fordulo-close-dialog";
import SetDeadlines from "./set-deadlines";
import { Separator } from "@/components/ui/separator";

const ForduloOngoing = ({ stage }: { stage: Stage }) => {
    return (
        <div className="text-sm  mt-2">
            <div className="flex flex-col gap-4 w-full">
                <h4 className="text-lg font-medium mb-2">Beállítások</h4>
                <SetDeadlines stage={stage} />
                <Separator className="my-1" />
                <div className="flex items-end justify-end w-full">
                <ForduloCloseDialog stageId={stage.id} />
                </div>
            </div>
        </div>
    );
};

export default ForduloOngoing;
