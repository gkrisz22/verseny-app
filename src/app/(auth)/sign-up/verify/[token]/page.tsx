import SignUpComplete from "@/app/(auth)/_components/sign-up-complete";
import { validateToken } from "@/app/_data/auth.data";
import Icons from "@/components/icons";
import React from "react";

const VerifyRegPage = async ({
    params,
}: {
    params: Promise<{ token: string }>;
}) => {
    const token = (await params).token;
    const data = await validateToken(token);

    if (!data.success) {
        return (
            <div className="w-full max-w-lg mx-auto border rounded-xl flex flex-col gap-4 p-4 lg:p-6 shadow bg-background">
                <Icons.logo className="size-8 mx-auto" />
                <h1 className="text-center text-2xl font-bold">
                    Hiba történt!
                </h1>
                <p className="text-center text-sm text-gray-500">
                    {data.message}
                </p>
            </div>
        );
    }

    const user = data.data?.user;
    if (!user || !user.id || !user.email) {
        return "Hiba történt!";
    }

    return (
        <div className="w-full max-w-lg flex flex-col gap-4">
            <SignUpComplete userId={user.id} email={user.email} />
        </div>
    );
};

export default VerifyRegPage;
