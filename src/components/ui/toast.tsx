"use client";

import React, {createContext, useCallback, useContext, useState} from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; title: string; description?: string };

type ToastContextValue = {
    push: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Toast[]>([]);

    const push = useCallback((t: Omit<Toast, "id">) => {
        const id = Date.now() + Math.random();
        setItems((s) => [...s, { id, ...t }]);
        // 4 sn sonra otomatik kapat
        setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 4000);
    }, []);

    const close = (id: number) => setItems((s) => s.filter((x) => x.id !== id));

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            {/* Bottom-left viewport */}
            <div className="fixed bottom-4 left-4 z-[60] space-y-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={[
                            "relative w-80 rounded-lg border p-3 shadow-lg backdrop-blur",
                            "bg-white/90 dark:bg-neutral-900/85",
                            "border-neutral-200 dark:border-white/10",
                            t.type === "success" ? "ring-1 ring-emerald-500/40" : "",
                            t.type === "error" ? "ring-1 ring-rose-500/40" : "",
                            t.type === "info" ? "ring-1 ring-sky-500/40" : "",
                        ].join(" ")}
                        role="status"
                        aria-live="polite"
                    >
                        <button
                            onClick={() => close(t.id)}
                            className="absolute right-2 top-2 text-xs opacity-70 hover:opacity-100"
                            aria-label="Kapat"
                            type="button"
                        >
                            ✕
                        </button>
                        <div className="font-semibold">{t.title}</div>
                        {t.description && (
                            <div className="text-sm opacity-80 mt-0.5">{t.description}</div>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}
