"use client";
import { signUpEmail } from "@/app/_actions/auth.action";
import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";

const ConfirmSentPage = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");


    return (
        <div className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background">
            <Icons.logo className="size-8 mx-auto" />
            <h1 className="text-center text-2xl font-bold">Megerősítés</h1>
            <p className="text-center text-sm text-gray-500">
                Biztonsági okokból elküldtünk egy megerősítő e-mailt a következő címre:
            </p>
            <p className="text-center text-lg font-bold">{email}</p>
            <p className="text-center text-sm text-gray-500">
                Kérjük, ellenőrizze a beérkezett leveleket és kövesse az ott található utasításokat.
            </p>
        </div>
    );
};

export default ConfirmSentPage;
