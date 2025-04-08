"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const saveRolePreference = async (orgId: string, role: string) => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    
    console.log(`User ${session?.user?.email} has saved role preference ${role}`);

    (await cookies()).set("role", role, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });


    redirect(`/org`);
}