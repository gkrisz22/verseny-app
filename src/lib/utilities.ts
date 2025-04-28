"server-only";
import { auth } from "@/auth";
import authService from "@/services/auth.service";
import { cookies } from "next/headers";
import * as jose from "jose"

export const isLoggedIn = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return false;
    }
    const existingUser = await authService.get(session.user.id);
    return !!existingUser;
}

export const getSessionOrganizationData = async () => {
    const org = await getSecureCookie("org");
    if (!org) {
        return null;
    }
    return JSON.parse(org) as { id: string, role: string };
}

export const getSessionRole = async () => {
    const org = await getSessionOrganizationData();
    if (!org) {
        return null;
    }
    const role = org.role;
    if (!role) {
        return null;
    }
    return role;
}
export async function setSecureCookie({ name, value, time }: { name: string, value: string, time?: { minutes?: number, hours?: number, days?: number } }) {
    const secret = process.env.JWT_COOKIE_SECRET || "r34llys3cr3t";
    const token = new jose.SignJWT({ value })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(time?.minutes ? `${time.minutes}m` : time?.hours ? `${time.hours}h` : time?.days ? `${time.days}d` : "30d")
        .sign(new TextEncoder().encode(secret));

    const cookieOptions = {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict" as "strict" | "lax" | "none",
        maxAge: time?.minutes ? time.minutes * 60 : time?.hours ? time.hours * 3600 : time?.days ? time.days * 86400 : 30 * 86400,
        expires: new Date(Date.now() + (time?.minutes ? time.minutes * 60 * 1000 : time?.hours ? time.hours * 3600 * 1000 : time?.days ? time.days * 86400 * 1000 : 30 * 86400 * 1000)),
    };

    value = await token;

    const cookieStore = await cookies();
    cookieStore.set(name, value, cookieOptions);
}

export const getSecureCookie = async (name: string): Promise<string | null> => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name)?.value as string;
    if (!cookie) {
        return null;
    }
    const secret = process.env.JWT_COOKIE_SECRET || "r34llys3cr3t";
    const { payload } = await jose.jwtVerify(cookie, new TextEncoder().encode(secret));
    return payload.value as string;
}

export const deleteSecureCookie = async (name: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}