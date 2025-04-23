"use server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export const isLoggedIn = async () => {
    const session = await auth();
    if (!session || !session.user) {
        return false;
    }
}

export const isDateLessThan = async (date1: string, date2: string) => {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);
    return date1Obj < date2Obj;
}

export const getUserOrganizationId = async () => {
    const cookieStore = await cookies();
    const organizationId = cookieStore.get("org")?.value as string;
    if (!organizationId) {
        return null;
    }
    return organizationId;
}