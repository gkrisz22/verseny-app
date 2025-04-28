import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authService from "./services/auth.service";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface User {
        id?: string;
        name?: string | null;
        email?: string | null;
        superAdmin?: boolean;
    }

    interface Session {
        user: User;
    }
}

export default {
    providers: [
        GitHub,
        Credentials({
            credentials: {
                email: { label: "E-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Hiányzó e-mail vagy jelszó!");
                }

                try {
                    const password = credentials.password as string;
                    const user = await authService.getWhere({
                        email: credentials.email,
                    });

                    if (!user || user.length === 0) {
                        throw new Error("Nem létezik a felhasználó!");
                    }
                    if (user[0].password === null) {
                        throw new Error("Nincs jelszó beállítva!");
                    }

                    const isValid = await bcrypt.compare(
                        password,
                        user[0].password
                    );

                    if (!isValid) {
                        throw new Error("Hibás jelszó!");
                    }

                    return {
                        id: user[0].id,
                        name: user[0].name,
                        email: user[0].email,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(
                            error.message || "Hiba a bejelentkezés során!"
                        );
                    }
                    throw new Error("Hiba a bejelentkezés során!");
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            const email = profile?.email as string;
            const userExists = await authService.getWhere({ email });

            if (userExists.length === 0) {
                if (account?.provider === "github") {
                    return true;
                }
               throw new Error("Nem létezik a felhasználó!");
            }

            const existingUser = userExists[0];
            user.id = existingUser.id;
            user.superAdmin = existingUser.superAdmin;
            return true;
        },
        async jwt({ user, token }) {
            if (user) {
                token.sub = user.id;
                token.superAdmin = user.superAdmin;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub as string;
                session.user.superAdmin = token.superAdmin as boolean;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const dashboardPaths = ["/admin", "/org", "/select"];
            const isOnDashboard = dashboardPaths.some((path) =>
                nextUrl.pathname.startsWith(path)
            );
            if (!isLoggedIn && isOnDashboard) {
                return Response.redirect(new URL("/sign-in", nextUrl));
            }

            const unauthorizedPaths = ["/sign-in", "/sign-up"];

            if (isOnDashboard) {
                if (
                    !auth?.user.superAdmin &&
                    nextUrl.pathname.startsWith("/admin")
                ) {
                    return Response.redirect(new URL("/org", nextUrl));
                }
                return isLoggedIn;
            } else if (
                isLoggedIn &&
                unauthorizedPaths.includes(nextUrl.pathname)
            ) {
                return Response.redirect(new URL("/select", nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
