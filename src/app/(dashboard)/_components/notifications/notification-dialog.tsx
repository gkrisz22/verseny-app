"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { XIcon } from "lucide-react"

interface NotificationDialogProps {
    children: React.ReactNode;
    emails: string[];
}

export function NotificationDialog({ children, emails }: NotificationDialogProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm md:max-w-screen-md">
                    <DialogHeader>
                        <DialogTitle>Értesítés küldése</DialogTitle>
                        <DialogDescription>
                            Lehetősége van, hogy értesítsen egy adott felhasználócsoportot.
                        </DialogDescription>
                    </DialogHeader>
                    <NotificationDialogEditor emails={emails} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Értesítés küldése</DrawerTitle>
                    <DrawerDescription>
                        Lehetősége van, hogy értesítsen egy adott felhasználócsoportot.
                    </DrawerDescription>
                </DrawerHeader>
                <NotificationDialogEditor className="px-4" emails={emails} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Mégsem</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function NotificationDialogEditor({ className, emails }: { className?: string, emails?: string[] }) {
    const [emailsState, setEmailsState] = React.useState<string[]>(emails || []);
    return (
        <form className={cn("grid items-start gap-4", className)}>
            <input type="hidden" name="emails" value={emails?.join(",")} />
            <div className="grid gap-2">
                <Label htmlFor="email">Email címek</Label>
                <div className="flex flex-col md:flex-row gap-2">
                    {
                        emailsState?.map((email, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs bg-accent p-2 rounded-lg w-fit">
                                <span>{email}</span>
                                <Button type="button" variant="outline" size="sm" className="h-6 w-6" onClick={() => {
                                    const newEmails = emailsState.filter((e) => e !== email);
                                    setEmailsState(newEmails);
                                }}>
                                    <XIcon className="h-6 w-6" />
                                    <span className="sr-only">Törlés</span>
                                </Button>
                            </div>
                        ))
                    }
                    {
                        emailsState.length === 0 && (
                            <small className="text-sm text-muted-foreground italic">
                                Nincs egy email cím sem megadva.
                            </small>
                        )
                    }
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subject">Tárgy</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="Jelentkezéssel kapcsolatos információk"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="message">Üzenet</Label>
                <Textarea
                    id="message"
                    rows={4}
                    placeholder="Ide írhatja a felhasználókhoz címzett üzenetet."
                />
            </div>
            <Button type="submit">Küldés</Button>
        </form>
    )
}
