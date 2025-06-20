import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { WebVitals } from "@/lib/web-vitals";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { TopNavbar } from "./_components/top-navbar";
import { NavUser } from "../_components/sidebar/nav-user";
import { BackToTop } from "@/components/shared/back-to-top";
import { getSessionOrganizationData } from "@/lib/utilities";
import { redirect } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fonts = [inter, poppins];

export const metadata: Metadata = {
  title: "Szervezeti felület - Verseny App",
  description: "Saját szervezet kezelése, versenyekre jelentkezés, diákok kezelése",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const orgData = await getSessionOrganizationData();

  if (!session || !session.user) {
    return <div>Nincs bejelentkezve.</div>
  }
  if (!orgData) {
    redirect("/select");
  }

  const role = orgData.role;

  return (
    <html lang="hu">
      <body
        className={`${fonts
          .map((font) => font.variable)
          .join(" ")} antialiased font-primary bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <WebVitals />
          <Toaster />

          <SessionProvider>
            <TopNavbar role={role}>
              <NavUser user={session.user} />
            </TopNavbar>
            <main className="flex-1 container mx-auto p-4">{children}</main>
          </SessionProvider>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
