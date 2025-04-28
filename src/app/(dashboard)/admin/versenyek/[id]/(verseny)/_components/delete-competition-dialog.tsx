"use client";
import { deleteCompetition } from "@/app/_actions/competition.action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

export function DeleteCompetitionDialog({ id, title }: { id: string, title: string }) {
    const handleDelete = async () => {
        const res = await deleteCompetition(id)
        if (!res.success) {
            toast.error(res.message)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2Icon /> Verseny törlése</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Biztosan törli a {title} versenyt?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ez a művelet nem visszavonható.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <p className="font-medium text-sm mb-2">A verseny törlésével törlődnek az alábbiak is:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Az összes kategória,</li>
                        <li>Az összes forduló,</li>
                        <li>Az összes versenyző és szervezet,</li>
                        <li>Az összes versenyeredmény.</li>
                    </ul>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel autoFocus>Mégsem</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
