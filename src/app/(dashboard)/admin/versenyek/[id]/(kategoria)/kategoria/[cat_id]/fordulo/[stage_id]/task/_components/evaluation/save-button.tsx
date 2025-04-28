"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SaveIcon } from "lucide-react";
import React from "react";

const EvaluationSaveTrigger = ({
    onSave,
    isLoading,
}: {
    onSave: () => void;
    isLoading: boolean;
}) => {
    return (
        <Button
            onClick={onSave}
            disabled={isLoading}
            size={"lg"}
            variant={"default"}
            className="w-fit rounded-full p-4 pt-4 fixed bottom-4 right-4"
        >
            {isLoading ? (
                <span className="flex items-center">
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Mentés...
                </span>
            ) : (
                <span className="flex items-center">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Mentés
                </span>
            )}
        </Button>
    );
};

export default EvaluationSaveTrigger;
