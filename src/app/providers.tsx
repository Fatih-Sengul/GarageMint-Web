"use client";
import { ThemeProvider } from "@primer/react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { useQueryErrorHandler } from "@/hooks/useQueryErrorHandler";

function QueryProvider({ children }: { children: React.ReactNode }) {
  const onError = useQueryErrorHandler();
  const [client] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError }),
        mutationCache: new MutationCache({ onError }),
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
        <QueryProvider>{children}</QueryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

