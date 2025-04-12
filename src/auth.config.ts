import GitHub from "next-auth/providers/github";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authService from "./services/auth.service";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role?: string;
    name?: string | null;
    email?: string | null;
    org?: string | null;
    isSuperAdmin?: boolean;
  }

  interface Session {
    user: User;
  }
}

export default {
  providers: [GitHub, 
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          console.log("Authorize")
          const password = credentials.password as string;

          const user = await authService.getWhere({ email: credentials.email });

          if (!user || user.length === 0) {
            throw new Error("No user found with this email");
          }
          if(user[0].password === null) {
            throw new Error("No password set for this user");
          }

          const isValid = await bcrypt.compare(password, user[0].password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message || "Authentication failed");
          }
          throw new Error("Authentication failed");
        }
      },
    })
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const email = profile?.email as string;
        const name = profile?.name as string;
        const userExists = await authService.getWhere({ email });
        
        if (userExists.length === 0) {
         console.log("Creating user")
         return false;
        }
      }
      return true;
    }, 
    async jwt({ user, token}) { // on login
      if(user) {
        token.role = "";
        token.org = "";
        token.isSuperAdmin = false;
      }

      return token;
    },
    async session({ session, token}) { // on every request
      session.user.role = "";
      token.org = "";
      console.log("Session")
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");

      const unauthorizedPaths = ["/sign-in", "/sign-up"];

      if (isOnDashboard) {
        return isLoggedIn;
      } else if (unauthorizedPaths.includes(nextUrl.pathname) && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
