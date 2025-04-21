"use client";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import React from "react";

const EvaluationSaveTrigger = ({
    onSave,
    disabled,
}: {
    onSave: () => void;
    disabled: boolean;
}) => {
    return (
        <Button
            onClick={onSave}
            disabled={disabled}
            size={"lg"}
            variant={"destructive"}
            className="w-fit rounded-full p-4 pt-4 fixed bottom-4 right-4"
        >
            <span className="flex items-center">
                <SaveIcon className="h-4 w-4 mr-2" />
                Mentés
            </span>
        </Button>
    );
};

export default EvaluationSaveTrigger;
