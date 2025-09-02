import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = { title: "GarageMint" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-screen h-full flex flex-col bg-neutral-950 text-neutral-100">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
