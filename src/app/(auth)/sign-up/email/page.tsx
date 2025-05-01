"use client";
import { signUpEmail } from "@/app/_actions/auth.action";
import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";

const EmailRegPage = () => {
    const searchParams = useSearchParams();
    const orgId = searchParams.get("org");
    const [state, action, isPending] = useActionState(signUpEmail, {
        success: false,
        message: "",
    });

    return (
        <div className="w-full max-w-lg flex flex-col gap-4">
            <form
                action={action}
                className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background"
            >
                <Icons.logo className="size-8 mx-auto" />
                <h1 className="text-center text-2xl font-bold">Regisztráció</h1>
                <p className="text-center text-sm text-gray-500">
                    Szervezet adminisztrátori fiók regisztrációja
                </p>

                <Input type="hidden" name="orgId" defaultValue={orgId || ''} />
                <div className="grid gap-2">
                    <Label htmlFor="email">E-mail cím</Label>
                    <Input
                        id="email"
                        type="text"
                        name="email"
                        defaultValue={state?.inputs?.email}
                        placeholder="fiok@inf.elte.hu"
                        className={state?.errors?.email ? "border-red-500" : ""}
                        required
                        autoFocus
                    />
                    {
                        state?.errors?.email && (
                            <p className="text-red-500 text-sm">
                                {state?.errors?.email[0]}
                            </p>
                        )
                    }
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Név</Label>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        defaultValue={state?.inputs?.name}
                        placeholder="Teszt Név"
                        className={state?.errors?.name ? "border-red-500" : ""}
                        required
                    />
                    {
                        state?.errors?.name && (
                            <p className="text-red-500 text-sm">
                                {state?.errors?.name[0]}
                            </p>
                        )
                    }
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    Tovább <ArrowRightIcon className="ml-2" />
                </Button>
            </form>
        </div>
    );
};

export default EmailRegPage;
