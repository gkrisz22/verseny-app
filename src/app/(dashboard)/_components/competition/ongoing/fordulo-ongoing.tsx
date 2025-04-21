import React from "react";
import { Stage } from "@prisma/client";
import ForduloCloseDialog from "./fordulo-close-dialog";
import SetDeadlines from "./set-deadlines";
import { Separator } from "@/components/ui/separator";

const ForduloOngoing = ({ selectedRound }: { selectedRound: Stage }) => {
    return (
        <div className="text-sm  mt-2">
            <div className="flex flex-col gap-4">
                <h4 className="text-lg font-medium mb-2">Beállítások</h4>
                <SetDeadlines stageId={selectedRound.id} />
                <Separator className="my-1" />
                <ForduloCloseDialog stageId={selectedRound.id} />
            </div>
        </div>
    );
};

export default ForduloOngoing;
