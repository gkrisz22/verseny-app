import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"

export function AddTaskDialog({ stageId} : { stageId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="ml-2"><PlusIcon /> <span className="sr-only">Új feladat</span></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Új feladat létrehozása</DialogTitle>

        </DialogHeader>
        <form>

        <DialogFooter>
          <Button type="submit">
            Létrehozás
          </Button>
        </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
