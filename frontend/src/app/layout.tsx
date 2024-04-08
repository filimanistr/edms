import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"  // Dark theme
import { Toaster } from "@/components/ui/toaster"  // Всплывающее окошко

// Font
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster/>
      </ThemeProvider>
      </body>
    </html>
  );
}
