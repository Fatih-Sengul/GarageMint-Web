"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth/store";
import SignupPromptModal from "@/components/auth/SignupPromptModal";

export default function Guard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const authed = useAuthStore((s) => s.isAuthed());
  if (!ready) return null;
  if (!authed) {
    return (
      <SignupPromptModal
        open={true}
        onClose={() => {
          if (typeof window !== "undefined") window.location.href = "/";
        }}
      />
    );
  }
  return <>{children}</>;
}
