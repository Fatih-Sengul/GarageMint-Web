import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import AppThemeProvider from "./theme-provider";

export const metadata: Metadata = { title: "GarageMint" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <AppThemeProvider>
          <Providers>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </AppThemeProvider>
      </body>
    </html>
  );
}
