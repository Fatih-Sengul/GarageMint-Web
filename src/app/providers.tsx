"use client";
import { ThemeProvider } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/components/ui/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [client] = useState(() => new QueryClient());
    return (
        <ThemeProvider colorMode="auto">
            <QueryClientProvider client={client}>
                <ToastProvider>{children}</ToastProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
