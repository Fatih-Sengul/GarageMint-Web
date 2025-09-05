import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Giriş Yap" };

export default function LoginPage() {
  return <LoginForm />;
}
