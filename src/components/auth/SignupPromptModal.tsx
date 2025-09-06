"use client";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SignupPromptModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onCloseAction={onClose} title="Üye Ol">
      <p className="mb-4 text-sm text-neutral-300">
        Mezatlara katılmak için üye olmalısın. Hemen üye olup fırsatları kaçırma!
      </p>
      <Link
        href="/register"
        className="inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
      >
        Kayıt Ol
      </Link>
    </Modal>
  );
}
