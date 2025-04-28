import React from "react";
import ForduloStartForm from "./fordulo-start-form";
import { Stage } from "@prisma/client";

const ForduloUpcoming = ({ stage }: { stage: Stage }) => {
    return (
        <div className="text-sm  mt-2">
            <div className="flex flex-col gap-4">
                <h4 className="text-lg font-medium mb-2">Beállítások</h4>
                <ForduloStartForm stageId={stage.id} />
            </div>
        </div>
    );
};

export default ForduloUpcoming;
