"use client";

export default function Confirm({
  open,
  title = "Emin misin?",
  description,
  confirmText = "Evet",
  cancelText = "Vazgeç",
  onConfirmAction,
  onCancelAction,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  /** Next 15: function prop adı ...Action olmalı */
  onConfirmAction: () => void;
  onCancelAction: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onCancelAction} />
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-xl">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-neutral-400">{description}</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancelAction}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirmAction}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
