'use client';

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">Bir şeyler ters gitti</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Uygulama beklenmeyen bir hata ile karşılaştı. Lütfen daha sonra tekrar deneyin.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-white"
          >
            Yeniden dene
          </button>
        </div>
      </body>
    </html>
  );
}
