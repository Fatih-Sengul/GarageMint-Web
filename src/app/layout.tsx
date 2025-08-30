import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "GarageMint",
  description: "Collectors platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
