"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/auth/hooks";

export default function LoginForm() {
  const m = useLogin();
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await m.mutateAsync({ emailOrUsername, password });
      router.replace("/me");
    } catch {
      /* error handled by hook */
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold">Giriş Yap</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          className="input"
          placeholder="E-posta veya kullanıcı adı"
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={m.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {m.isPending ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
      <p className="mt-3 text-sm text-neutral-500">
        Hesabın yok mu?{" "}
        <Link href="/register" className="text-sky-400">
          Kayıt ol
        </Link>
      </p>
      {m.isError && (
        <p className="mt-2 text-sm text-red-400">Giriş başarısız</p>
      )}
    </div>
  );
}
