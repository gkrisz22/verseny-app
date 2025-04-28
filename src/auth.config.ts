import GitHub from "next-auth/providers/github";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authService from "./services/auth.service";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
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
      const email = profile?.email as string;
      const name = profile?.name as string;
      const userExists = await authService.getWhere({ email });
    
      if (userExists.length === 0) {
        if (account?.provider === "github") {
          const newUser = await authService.create({ name, email });
          user.id = newUser.id;
          userExists[0] = newUser;
        } else {
          throw new Error("Nem létezik a felhasználó!");
        }
      }
    
      const existingUser = userExists[0];
      user.id = existingUser.id;
      user.isSuperAdmin = existingUser.superAdmin;
      console.log("User:", user);
    
      return true;
    },
    async jwt({ user, token}) {
      if(user) {
        console.log(user)
        token.sub = user.id;
        token.isSuperAdmin = user.isSuperAdmin;
      }

      return token;
    },
    async session({ session, token}) {
      if(token) {
        session.user.id = token.sub as string;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const dashboardPaths = ["/admin", "/org", "/select"];
      const isOnDashboard = dashboardPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      if(!isLoggedIn && isOnDashboard) {
        return Response.redirect(new URL("/sign-in", nextUrl));
      }

      const unauthorizedPaths = ["/sign-in", "/sign-up"];

      if(isOnDashboard) {
        if(!auth?.user.isSuperAdmin && nextUrl.pathname.startsWith("/admin")) {
          return Response.redirect(new URL("/org", nextUrl));
        }
        return isLoggedIn;
      }
      else if(isLoggedIn && unauthorizedPaths.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/select", nextUrl));
      }
      
      return true;
    },
  },
} satisfies NextAuthConfig;
