import Link from "next/link";
import {
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Hakkımızda • GarageMint",
  description:
    "GarageMint: die-cast koleksiyonerleri için güvenli ve şık bir pazar yeri. Hikâyemiz, vizyonumuz ve ekibimiz.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* HERO */}
      <section className="relative border-b border-neutral-200/70 dark:border-white/10">
        <div
          className="h-[420px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(2,132,199,.25), rgba(2,132,199,.45)), url('https://images.unsplash.com/photo-1520975922284-5f7f83a43dfd?q=80&w=1800&auto=format&fit=crop')",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-24 w-[60%] h-52 rotate-[10deg] bg-gradient-to-r from-white/25 to-transparent blur-2xl" />
          <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-sky-500/20 blur-3xl rounded-full" />
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <div className="mx-auto max-w-5xl px-4 text-white">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500/90 to-blue-600/90 px-3 py-1 text-xs font-bold tracking-wide ring-1 ring-white/30">
              Die-cast tutkusu + iyi tasarım + güvenli ticaret
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Hobiye yakışan bir <span className="text-sky-200">ev</span> inşa ediyoruz.
            </h1>
            <p className="mt-3 max-w-2xl text-white/90">
              GarageMint, koleksiyonerler için sadece bir pazar yeri değil;
              keşfetmek, paylaşmak ve güvenle takas etmek için bir topluluk.
            </p>
          </div>
        </div>
      </section>

      {/* MİSYON/VİZYON */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-extrabold">Misyonumuz</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Koleksiyonerlerin en sevdiği parçaları güvenle alıp satabildiği,
              koleksiyonlarını sergileyip anlamlı bağlantılar kurabildiği
              kusursuz bir deneyim sunmak.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-extrabold">Vizyonumuz</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Fiziksel & dijital koleksiyon dünyasını bir araya getiren,
              standartları belirleyen global bir platform olmak.
            </p>
          </Card>
        </div>

        {/* Değerler */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<ShieldCheckIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            title="Güven ve Şeffaflık"
            desc="Doğrulanmış profiller, açık kurallar ve adil moderasyon."
          />
          <Feature
            icon={<SparklesIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            title="Koleksiyoner Odaklı"
            desc="İlan kartlarından arama filtrelerine kadar her detay özenle."
          />
          <Feature
            icon={<UsersIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            title="Topluluk"
            desc="Paylaşım, keşif ve saygı; platformun kalbinde bunlar var."
          />
          <Feature
            icon={<RocketLaunchIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            title="Hız ve Kalite"
            desc="Modern teknoloji, temiz arayüz ve akıcı performans."
          />
        </div>
      </section>

      {/* EKİP (placeholder görseller) */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-extrabold">Ekibimiz</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Hobiye yıllardır emek veren küçük ama tutkulu bir ekip.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Fatih Şengül", role: "Ürün & Topluluk", img: "https://i.pravatar.cc/200?img=12" },
            { name: "GarageMint Bot", role: "Altyapı & Güvenlik", img: "https://i.pravatar.cc/200?img=5" },
            { name: "Design Crew", role: "Arayüz & Deneyim", img: "https://i.pravatar.cc/200?img=23" },
          ].map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/70"
                />
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{m.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-sky-400/10 to-blue-600/10 p-6 sm:p-8 backdrop-blur">
          <h3 className="text-xl font-extrabold">Topluluğa katıl</h3>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
            Koleksiyonunu vitrine çıkar, güvenle takas et ve yeni insanlar tanı.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/me"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-white/30"
            >
              Profil Oluştur
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              İlanları Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER mini */}
      <footer className="border-t border-neutral-200 dark:border-white/10 py-8 bg-white/60 dark:bg-white/[0.02] backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} GarageMint</p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white">
              Gizlilik
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white">
              Şartlar
            </Link>
            <a
              href="mailto:hello@garagemint.app"
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              İletişim
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* --- küçük yardımcı bileşenler --- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/10 p-6 bg-white dark:bg-neutral-900 shadow-sm">
      {children}
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-sky-400/20 to-blue-600/20">
          {icon}
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
    </div>
  );
}

