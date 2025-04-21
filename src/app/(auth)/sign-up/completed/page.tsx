import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CompletedRegPage = () => {
    return (
        <div className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background">
            <Icons.logo className="size-8 mx-auto" />
            <h1 className="text-center text-2xl font-bold">
                Köszönjük a regisztrációt!
            </h1>
            <p className="text-center text-sm text-gray-500">
                Sikeresen regisztrált a rendszerünkbe!
            </p>
            <p className="text-center text-sm text-gray-500">
                Kérjük, jelentkezzen be a fiókjába:
            </p>

            <Link href="/sign-in">
                <Button variant="default" className="w-full">
                    Bejelentkezés
                </Button>
            </Link>
        </div>
    );
};

export default CompletedRegPage;
