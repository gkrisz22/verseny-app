"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icons from "@/components/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoaderCircle, SchoolIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { signUpFirstStep } from "@/app/_actions/auth.action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionForm } from "@/hooks/use-action-form";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [state, action, isPending] = useActionForm(signUpFirstStep);

    return (
        <div className={cn("flex flex-col gap-6 mt-8 bg-background p-6 shadow border rounded-xl w-full", className)} {...props}>
            <form action={action}>
                <div className="flex flex-col gap-6">
                    <header className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex flex-col items-center gap-4 font-medium">
                            <div className="flex size-10 lg:size-14 items-center justify-center rounded-md">
                                <Icons.logo className="size-10 lg:size-14" />
                            </div>
                            <span className="sr-only">ELTE IK Tehetség</span>
                        </Link>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-medium text-center">
                            Üdvözöljük az IK Tehetség felületén!
                        </h1>
                        <div className="text-center text-sm">
                            Már regisztrált?{" "}
                            <Link href="/sign-in" className="underline underline-offset-4 text-muted-foreground hover:text-primary">
                                Jelentkezzen be fiókjával!
                            </Link>
                        </div>
                    </header>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label>Regisztrálás, mint:</Label>
                            <RadioGroup name="role" className="grid  gap-4" required defaultValue={state.inputs?.role}>
                                <Label htmlFor="school" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                    <RadioGroupItem value="school" id="school" className="sr-only" />
                                    <SchoolIcon className="mb-3 h-6 w-6" />
                                    Szervezet
                                </Label>
                            </RadioGroup>
                            {state.errors?.role && (
                                <div className="text-red-500 text-sm">{state.errors.role}</div>
                            )}
                        </div>

                        {state.errors && state.message && (
                            <Alert variant="destructive">
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> <span>Átirányítás...</span>
                                </>
                            ) : (
                                "Tovább"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
