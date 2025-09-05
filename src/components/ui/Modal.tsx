"use client";
import React from "react";

interface ModalProps {
  open: boolean;
  /** Next 15: function prop adı ...Action olmalı */
  onCloseAction: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onCloseAction,
  title,
  children,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCloseAction}
        aria-hidden
      />
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onCloseAction}
            className="text-sm text-neutral-400 hover:text-neutral-200"
          >
            Kapat
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
