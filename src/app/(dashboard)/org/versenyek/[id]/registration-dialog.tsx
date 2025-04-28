'use client';
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
import { toast } from "sonner";
import { registerAsOrganization } from "@/app/_actions/competition.action";

export function CompetitionRegistrationDialog({ competitionId }: { competitionId: string }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Regisztráció</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Regisztráció a versenyre</DialogTitle>
                        <DialogDescription>
                            Kérem erősítse meg iskolája jelentkezési szándékát.
                        </DialogDescription>
                    </DialogHeader>
                    <CompetitionRegistrationConfirmation competitionId={competitionId} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Regisztráció</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Regisztráció versenyre</DrawerTitle>
                    <DrawerDescription>
                        Kérem erősítse meg iskolája jelentkezési szándékát.
                    </DrawerDescription>
                </DrawerHeader>
                <CompetitionRegistrationConfirmation className="px-4" competitionId={competitionId} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Mégsem</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function CompetitionRegistrationConfirmation({ className, competitionId }: React.ComponentProps<"form"> & { competitionId: string }) {

    const submitRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        toast.promise(registerAsOrganization(competitionId),
        {
            success: "Sikeres regisztráció",
            loading: "Regisztráció folyamatban",
            error: "Regisztráció sikertelen",
        });
            
    }
    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={submitRegistration}>
            <h3 className="text-muted-foreground">
                Ön elfogadja a versenyen való részvétel feltételeit
            </h3>
            <div className="space-y-2">

            </div>
            <Button type="submit">Jelentkezés</Button>
        </form>
    )
}
