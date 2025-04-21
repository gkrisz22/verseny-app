import React from "react";
import { Stage } from "@prisma/client";

const ForduloFinished = ({ selectedRound }: { selectedRound: Stage }) => {
    return (
        <div className="text-sm  mt-2">
            <div className="flex flex-col gap-4">
                <h4 className="text-lg font-medium mb-2">Beállítások</h4>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        A forduló már befejeződött, így nem végezhet el rajta módosítást.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        A forduló állapotát a verseny adminisztrátorai tudják módosítani.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForduloFinished;
