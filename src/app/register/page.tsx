import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Kayıt Ol" };

export default function RegisterPage() {
  return <RegisterForm />;
}
