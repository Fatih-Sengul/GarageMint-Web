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
      <div className="relative overflow-hidden rounded-lg">
        <img
          src="https://picsum.photos/seed/signup/800/400"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 p-4">
          <p className="mb-4 text-sm text-neutral-100">
            Mezatlara katılmak için üye olmalısın. Hemen üye olup fırsatları kaçırma!
          </p>
          <Link
            href="/register"
            className="inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </Modal>
  );
}
