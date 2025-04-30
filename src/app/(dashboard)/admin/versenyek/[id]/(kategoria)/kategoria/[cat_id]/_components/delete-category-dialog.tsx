"use client";
import { deleteCategory } from "@/app/_actions/category.action";
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

export function DeleteCategoryDialog({ id, title }: { id: string, title: string }) {
    const handleDelete = async () => {
        const res = await deleteCategory(id)
        if (!res.success) {
            toast.error(res.message)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2Icon /> Kategória törlése</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Biztosan törli a {title} kategóriát?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ez a művelet nem visszavonható.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <p className="font-medium text-sm mb-2">A kategória törlésével törlődnek az alábbiak is:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Az összes forduló,</li>
                        <li>Az összes kategóriában induló versenyző,</li>
                        <li>Az összes kategóriához tartozó versenyeredmény.</li>
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
