"use server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export const isLoggedIn = async () => {
    const session = await auth();
    if (!session || !session.user) {
        return false;
    }
}

export const getUserOrganizationId = async () => {
    const cookieStore = await cookies();
    const organizationId = cookieStore.get("org")?.value as string;
    if (!organizationId) {
        return null;
    }
    return organizationId;
}