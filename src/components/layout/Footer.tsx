export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 bg-white/[0.02] backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between flex-wrap gap-3 text-sm text-neutral-400">
        <p>© {new Date().getFullYear()} GarageMint</p>
        <nav className="flex gap-4">
          <a href="/terms" className="hover:text-white">Şartlar</a>
          <a href="/privacy" className="hover:text-white">Gizlilik</a>
          <a href="/about" className="hover:text-white">Hakkımızda</a>
        </nav>
      </div>
    </footer>
  );
}
