"use client";
import { useState } from "react";
import Link from "next/link";
import { useRegister } from "@/lib/auth/hooks";

export default function RegisterForm() {
  const m = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold">Kayıt Ol</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate({ email, password, displayName });
        }}
        className="mt-6 grid gap-3"
      >
        <input
          className="input"
          placeholder="Görünen isim"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
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
      {m.isError && (
        <p className="mt-2 text-sm text-red-400">Kayıt başarısız</p>
      )}
    </div>
  );
}
