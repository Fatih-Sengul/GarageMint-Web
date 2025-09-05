"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/store";
import { useLogout } from "@/lib/auth/hooks";

export default function NavAuth() {
  const [mounted, setMounted] = useState(false);
  const isAuthed = useAuthStore((s) => s.isAuthed());
  const logout = useLogout();

  // Defer rendering until after hydration to avoid server/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthed) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm hover:text-sky-400">
          Giriş
        </Link>
        <Link
          href="/register"
          className="text-sm rounded-lg bg-sky-600 px-3 py-1.5 text-white"
        >
          Kayıt Ol
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/me" className="text-sm hover:text-sky-400">
        Profilim
      </Link>
      <button
        onClick={logout}
        className="text-sm rounded-lg border border-white/20 px-3 py-1.5"
      >
        Çıkış
      </button>
    </div>
  );
}
