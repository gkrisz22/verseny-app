import type { Metadata } from "next";
import { Outfit, Inter, Poppins } from "next/font/google";
import "../globals.css";
import { WebVitals } from "@/lib/web-vitals";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { NavigationBar } from "./_components/navigation-bar";
import MouseMoveEffect from "./_components/mouse-effect";


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

const fonts = [
  inter, 
  poppins,
  outfit,
];

export const metadata: Metadata = {
  title: "Verseny App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body
        className={`${fonts.map((font) => font.variable).join(" ")} antialiased font-primary bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            <MouseMoveEffect />
          <WebVitals />

          <NavigationBar />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
