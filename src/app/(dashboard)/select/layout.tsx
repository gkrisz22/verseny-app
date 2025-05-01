import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { WebVitals } from "@/lib/web-vitals";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/shared/back-to-top";
import { NavUser } from "../_components/sidebar/nav-user";

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
  title: "Szervezetválasztás",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) return null;
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
            <main className="w-full min-w-0 mt-6 bg-background container mx-auto max-w-6xl ">
            <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Szervezetválasztás</h1>
                        <p className="text-muted-foreground mt-1">
                            Üdvözöljük, {user.name}!
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <NavUser user={user} />
                    </div>
                </div>
                {children}
            </main>
          </SessionProvider>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}