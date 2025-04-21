import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  title: string,
  description: string,
  open: boolean,
  setOpen: (open: boolean) => void,
  confirmButton: React.ReactNode,
  children?: React.ReactNode
}

export function ConfirmDialog({ children, confirmButton, title, description, open, setOpen }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Mégsem</Button>
          {confirmButton}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Example:
/*
<ConfirmDialog
  title="Biztosan törölni szeretné a feladatot?"
  description="Ez a művelet visszafordíthatatlan!"
  open={isOpen}
  setOpen={setIsOpen}
  confirmButton={
    <Button variant="destructive" onClick={() => handleDelete(task.id)}>
      Törlés
    </Button>
  }
>
  <Button variant="destructive" onClick={() => setIsOpen(true)}>
    <Trash2 className="h-4 w-4 mr-1" /> Törlés
  </Button>
</ConfirmDialog>
*/