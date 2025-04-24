"use client";

import React, { useActionState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import regions from "@/lib/regions.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, CheckCircle2Icon, InfoIcon, MailIcon, RotateCwIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { signUpSchoolSkeleton } from "@/app/_actions/auth.action";
import { FormField } from "@/components/ui/form";
import Icons from "@/components/icons";


const SignUpOrganizationForm = () => {
    const [state, action, isPending] = useActionState(signUpSchoolSkeleton, { message: '', success: false })
    const [region, setRegion] = React.useState<string>('');
    const [auth, setAuth] = React.useState<string>('email');
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = (auth: string) => {
        setAuth(auth);
        formRef.current?.requestSubmit();
    }

    return (
        <form ref={formRef} action={action} className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background">
            <div className="mb-4">
                <h1 className="text-lg font-medium">1/2. lépés: Iskola adatai</h1>
                <p className="text-sm text-muted-foreground">
                    Kérjük, adja meg az iskola adatait.
                </p>
            </div>
            
            <h3 className="text-sm text-muted-foreground font-medium">
                Szervezeti adatok
            </h3>

            <div className="flex flex-col gap-6">
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">

                    <div className="grid gap-2 lg:col-span-2">
                        <Label htmlFor="school">Iskola neve</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            defaultValue={state?.inputs?.name}
                            placeholder="Eötvös Loránd Tudományegyetem"
                            className={state?.errors?.name ? "border-red-500" : ""}
                            required
                            autoFocus
                        />

                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="om">OM (ha van)</Label>
                        <Input
                            id="om"
                            type="text"
                            name="om"
                            placeholder="123456"
                            defaultValue={state?.inputs?.om}
                            className={state?.errors?.om ? "border-red-500" : ""}
                        />
                    </div>


                </div>
                {
                    state?.errors?.name &&
                    <p className="text-xs font-medium text-red-500">
                        {state.errors?.name[0]}
                    </p>
                }
                {
                    state?.errors?.om &&
                    <p className="text-xs font-medium text-red-500">
                        {state.errors?.om[0]}
                    </p>
                }
                <div className="grid gap-2">

                    <Label htmlFor="regio">Vármegye / Régió</Label>
                    <Select
                        defaultValue={state?.inputs?.region}
                        name="region"
                        onValueChange={setRegion}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pest" />
                        </SelectTrigger>
                        <SelectContent id="regio">
                            <SelectGroup>
                                <SelectLabel>Régiók</SelectLabel>
                                {regions.regions.map((r) => {
                                    return (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>Vármegyék</SelectLabel>
                                {regions.counties.map((r) => {
                                    return (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {
                        state?.errors?.region &&
                        <p className="text-xs font-medium text-red-500">
                            {state.errors?.region[0]}
                        </p>
                    }
                    <Input type="hidden" name="region" value={region || "pest"} />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="postalCode">Irányítószám</Label>
                        <Input
                            type="number"
                            name="postalCode"
                            required
                            placeholder="1117"
                            id="postalCode"
                            defaultValue={state?.inputs?.postalCode}
                        />
                        {
                            state?.errors?.postalCode &&
                            <p className="text-xs font-medium text-red-500">
                                {state.errors?.postalCode[0]}
                            </p>
                        }
                    </div>

                    <div className="grid gap-2 lg:col-span-2">
                        <Label htmlFor="city">Város</Label>
                        <Input
                            id="city"
                            type="text"
                            name="city"
                            required
                            placeholder="Budapest"
                            defaultValue={state?.inputs?.city}
                        />
                        {
                            state?.errors?.city &&
                            <p className="text-xs font-medium text-red-500">
                                {state.errors?.city[0]}
                            </p>
                        }
                    </div>

                    <div className="grid gap-2 md:col-span-2 lg:col-span-3">
                        <Label htmlFor="address">Cím</Label>
                        <Input
                            id="address"
                            type="text"
                            name="address"
                            required
                            placeholder="Pázmány Péter sétány 1/C"
                            defaultValue={state?.inputs?.address}
                        />
                        {
                            state?.errors?.address &&
                            <p className="text-xs font-medium text-red-500">
                                {state.errors?.address[0]}
                            </p>
                        }
                    </div>
                </div>
            </div>



            <div className="flex flex-col space-y-4 border-t pt-6">
                {
                    state?.errors && (
                        <Alert variant="destructive">
                            <AlertTitle className="font-medium">
                                Hiba történt a regisztráció során!
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                Kérem, javítsa a megjelölt mezőket, majd próbálja újra.
                            </AlertDescription>
                        </Alert>
                    )
                }

                <h3 className="text-sm text-muted-foreground font-medium">
                    Adminisztrátori fiók létrehozása
                </h3>
                <Input type="hidden" name="auth" value={auth} readOnly />
                <div className="flex flex-col items-center justify-between ">

                    <Button
                        type="button"
                        className="w-full"
                         onClick={() => handleSubmit("email")}
                         disabled={isPending} >
                       <MailIcon /> Folytatás e-mail címmel
                       {(isPending && auth === 'email') && <RotateCwIcon className="animate-spin" />}
                    </Button>
                    {/*
                    <Button type="button" onClick={() => handleSubmit("google")}  variant="outline" className="w-full mt-2" disabled={isPending}>
                        <Icons.google /> Folytatás Google-fiókkal {(isPending && auth === "google") && <RotateCwIcon className="animate-spin" />}
                        </Button>
                    <Button type="button"  onClick={() => handleSubmit("github")} variant="outline" className="w-full mt-2" disabled={isPending}>
                        <Icons.github /> Folytatás GitHub-fiókkal
                        {(isPending && auth === "github") && <RotateCwIcon className="animate-spin" />}
                    </Button>*/}
                </div>

            </div>
        </form>
    )
}

export default SignUpOrganizationForm;