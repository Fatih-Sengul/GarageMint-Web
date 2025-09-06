"use client";
import { ThemeProvider } from "@primer/react";
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { AxiosError } from "axios";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError) {
        const data = err.response?.data as { message?: string } | undefined;
        return data?.message ?? err.message;
    }
    if (err instanceof Error) return err.message;
    return String(err);
}

function QueryClientWithToasts({ children }: { children: React.ReactNode }) {
    const { push } = useToast();
    const [client] = React.useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) =>
                        push({
                            type: "error",
                            title: "Hata",
                            description: getErrorMessage(error),
                        }),
                }),
                mutationCache: new MutationCache({
                    onError: (error) =>
                        push({
                            type: "error",
                            title: "Hata",
                            description: getErrorMessage(error),
                        }),
                }),
                defaultOptions: {
                    queries: { refetchOnWindowFocus: false, retry: 1 },
                    mutations: { retry: 0 },
                },
            })
    );
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider colorMode="auto">
            <ToastProvider>
                <QueryClientWithToasts>{children}</QueryClientWithToasts>
            </ToastProvider>
        </ThemeProvider>
    );
}
