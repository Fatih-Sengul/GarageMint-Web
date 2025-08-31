import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/layout/SiteHeader";

export const metadata = {
    title: "GarageMint",
    description: "Collectors platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr">
        <body>
        <Providers>
            <SiteHeader />
            {children}
        </Providers>
        </body>
        </html>
    );
}
