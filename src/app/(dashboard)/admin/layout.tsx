import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { WebVitals } from "@/lib/web-vitals";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { SessionProvider } from "next-auth/react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/sidebar/app-sidebar";
import TopNav from "../_components/sidebar/top-nav";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/shared/back-to-top";

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
  title: "Adminisztráció",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="hu">
      <body
        className={`${fonts
          .map((font) => font.variable)
          .join(" ")} antialiased font-primary bg-background text-foreground relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <WebVitals />
          <Toaster />
          <SessionProvider>
            <SidebarProvider className="bg-background flex-1">
              <AppSidebar variant="floating" />
              <SidebarInset className="w-full flex-1 min-w-0 overflow-x-auto">
                <div className="container mx-auto p-4 box-border">
                  <TopNav user={session?.user} />
                  <main className="w-full min-w-0 mt-6">
                    {children}
                  </main>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </SessionProvider>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}