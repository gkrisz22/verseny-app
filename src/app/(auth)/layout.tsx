import type { Metadata } from "next";
import { Outfit, Inter, Poppins } from "next/font/google";
import "../globals.css";
import { WebVitals } from "@/lib/web-vitals";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { NavigationBar } from "../(public)/_components/navigation-bar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

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

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

const fonts = [inter, poppins, outfit];

export const metadata: Metadata = {
    title: "Autentikáció",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="hu">
            <body
                className={`${fonts
                    .map((font) => font.variable)
                    .join(
                        " "
                    )} antialiased font-primary bg-background text-foreground`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                >
                    <SessionProvider>
                        <Toaster />
                        <WebVitals />
                        <NavigationBar />
                        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-muted text-foreground">
                            {children}
                        </div>
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
