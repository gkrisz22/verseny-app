"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActionState } from "react";
import { signUpCompleteAction } from "@/app/_actions/auth.action";

const SignUpComplete = ({
    userId,
    email,
}: {
    userId: string,
    email: string,
}) => {
    const [state, action, isPending] = useActionState(signUpCompleteAction, {
        message: "",
        success: false,
    });

    return (
        <form
            action={action}
            className="w-full max-w-md mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background"
        >
            <div className="mb-4">
                <h1 className="text-lg font-medium">Jelszó beállítása</h1>
                <p className="text-sm text-muted-foreground">
                    Kérjük, állítsa be a jelszavát a regisztráció befejezéséhez.
                </p>
            </div>

            <Input type="hidden" name="userId" value={userId} readOnly />
            <Input type="hidden" name="email" value={email} readOnly />

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">Jelszó</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        defaultValue={state?.inputs?.password}
                        placeholder="Adja meg a jelszavát"
                        required
                    />
                    {state?.errors?.password && (
                        <Alert variant="destructive">
                            <AlertTitle className="font-medium">
                                Hiba
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                {state.errors.password}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="passwordConfirm">Jelszó megerősítése</Label>
                    <Input
                        id="passwordConfirm"
                        type="password"
                        name="passwordConfirm"
                        defaultValue={state?.inputs?.passwordConfirm}
                        placeholder="Erősítse meg a jelszavát"
                        required
                    />
                    {state?.errors?.passwordConfirm && (
                        <Alert variant="destructive">
                            <AlertTitle className="font-medium">
                                Hiba
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                {state.errors.passwordConfirm}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Feldolgozás..." : "Regisztráció befejezése"}
            </Button>
        </form>
    );
};

export default SignUpComplete;
