"use client";
import { deleteCategory } from "@/app/_actions/competition.action";
import { deleteAcademicYear } from "@/app/_actions/settings.action";
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

export function DeleteAcademicYearDialog({ id, title }: { id: string, title: string }) {
    const handleDelete = async () => {
        const res = await deleteAcademicYear(id)
        if (!res.success) {
            toast.error(res.message)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-8 w-8 p-0"><Trash2Icon /> <span className="sr-only">Tanév törlése</span></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Biztosan törli a {title} tanévet?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ez a művelet nem visszavonható.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <p className="font-medium text-sm mb-2">A tanév törlésével törlődnek a hozzárendelt diákok is.</p>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel autoFocus>Mégsem</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
