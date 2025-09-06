"use client";
import { ThemeProvider } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ToastProvider } from "@/components/ui/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [client] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { refetchOnWindowFocus: false, retry: 1 },
                    mutations: { retry: 0 },
                },
            })
    );
    return (
        <ThemeProvider colorMode="auto">
            <QueryClientProvider client={client}>
                <ToastProvider>{children}</ToastProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
