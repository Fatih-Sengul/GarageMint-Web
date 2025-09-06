'use client';

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Hata kayıt/logging
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Beklenmeyen bir hata oluştu</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Lütfen daha sonra tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-white"
      >
        Yeniden dene
      </button>
    </div>
  );
}
