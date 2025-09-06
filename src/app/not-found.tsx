import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Sayfa bulunamadı</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-white"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
