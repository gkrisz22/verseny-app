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
import regions from "./regions.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, CheckCircle2Icon, InfoIcon, RotateCwIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { signUpSchoolSkeleton } from "@/app/_actions/auth.action";
import { FormField } from "@/components/ui/form";


const SignUpSchool = ({ email }: { email: string }) => {
    const [state, action, isPending] = useActionState(signUpSchoolSkeleton, { message: '', success: false })
    const [region, setRegion] = React.useState<string>('');

    return (
        <form action={action} className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background">
            <div className="mb-4">
                <h1 className="text-lg font-medium">1/2. lépés: Iskola adatai</h1>
                <p className="text-sm text-muted-foreground">
                    Kérjük, adja meg az iskola adatait.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="email">E-mail cím</Label>

                        <Popover>
                            <PopoverTrigger>
                                <InfoIcon className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent align="start" sideOffset={8}>
                                <div className="text-sm flex flex-col gap-4">
                                    <h4 className="text-sm font-bold">Iskolai fiók</h4>

                                    <div className="text-muted-foreground text-xs">
                                        Az itt megadott e-mail cím (<strong>adminisztrátori e-mail cím</strong>)
                                        olyan fiókot biztosít az iskolának, amivel versenyekre lehet előzetesen jelentkezni, kezelni az iskolához tartozó tanárokat és diákokat.
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="w-full relative">
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            required
                            readOnly

                        />
                        <span className="absolute right-0 top-0 bottom-0 flex items-center px-2 text-green-500">
                            <CheckCircle2Icon size={18} />
                        </span>
                    </div>
                    <small className="text-xs font-medium text-muted-foreground">
                        Adminisztrátori e-mail cím.
                    </small>

                    {
                        state?.errors?.email &&
                        <p className="text-xs font-medium text-red-500">
                            {state.errors?.email}
                        </p>
                    }

                </div>

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
                <div className="flex items-center justify-between ">
                    <Button variant={"outline"} className="w-full max-w-[200px]" type="reset">
                        <RotateCwIcon /> Visszaállítás
                    </Button>

                    <Button
                        type="submit"
                        className="ml-auto w-full max-w-[200px]"
                    >
                        Tovább <ArrowRightIcon size={24} />
                    </Button>
                </div>

            </div>
        </form>
    )
}

export default SignUpSchool