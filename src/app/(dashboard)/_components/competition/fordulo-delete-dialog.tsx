"use client";
import { deleteStage } from "@/app/_actions/stage.action";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ForduloDeleteDialog = ({ stageId }: { stageId: string; }) => {

    const handleDelete = async () => {
        toast.promise(
            deleteStage(stageId),
            {
                loading: "Törlés folyamatban...",
                success: () => {
                    return "Sikeresen törölve!";
                },
                error: (err) => {
                    return err.message || "Hiba történt a törlés során!";
                },
            }
        );
    };

    return (
        <Dialog modal>
            <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AlertDialogHeader>
                    <DialogTitle>Forduló törlése</DialogTitle>
                    <DialogDescription>
                        Biztosan törölni szeretné a fordulót? Ez a művelet nem vonható vissza.
                    </DialogDescription>
                </AlertDialogHeader>
                <DialogFooter>
                    <Button variant="outline">Mégsem</Button>
                    <Button variant="destructive" onClick={handleDelete}>Törlés</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ForduloDeleteDialog;
