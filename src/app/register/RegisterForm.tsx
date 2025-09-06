"use client";
import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { z } from "zod";
import { useRegister } from "@/lib/auth/hooks";

export default function RegisterForm() {
  const m = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    username: z.string().min(1, "Kullanıcı adı gerekli"),
    email: z.string().email("Geçersiz e-posta"),
    password: z.string().min(1, "Şifre gerekli"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password, username });
    if (!r.success) {
      setFormError(r.error.issues[0]?.message ?? "Geçersiz kayıt");
      return;
    }
    setFormError(null);
    m.mutate(r.data);
  };

  const backendMessage =
    (m.error as AxiosError<{ message?: string }> | undefined)?.response?.data
      ?.message || (m.error as any)?.message;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold">Kayıt Ol</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          className="input"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {m.isPending ? "Kaydediliyor…" : "Kayıt Ol"}
        </button>
      </form>
      <p className="mt-3 text-sm text-neutral-500">
        Zaten üye misin?{" "}
        <Link href="/login" className="text-sky-400">
          Giriş yap
        </Link>
      </p>
      {formError && (
        <p className="mt-2 text-sm text-red-400">{formError}</p>
      )}
      {m.isError && (
        <p className="mt-2 text-sm text-red-400">
          Kayıt başarısız
          {backendMessage ? `: ${backendMessage}` : ""}
        </p>
      )}
    </div>
  );
}
