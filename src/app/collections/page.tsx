"use client";

import Link from "next/link";

type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
};

const collections: Collection[] = [
  {
    slug: "fast-and-furious",
    title: "Fast & Furious",
    subtitle: "Film serisinin efsane cast’ı",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "jdm",
    title: "JDM",
    subtitle: "Japon efsaneleri: Skyline, Supra, RX-7…",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "bond-007",
    title: "James Bond 007",
    subtitle: "Aston Martin ve ajan ruhu",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "euro-legends",
    title: "Euro Legends",
    subtitle: "Porsche, Ferrari, Lambo, AMG",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "usdm-muscle",
    title: "USDM Muscle",
    subtitle: "V8 gürültüsü, saf güç",
    image:
      "https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "rally",
    title: "Ralli Efsaneleri",
    subtitle: "Grup B nostaljisi",
    image:
      "https://images.unsplash.com/photo-1511397461313-52114189c134?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "lemans",
    title: "Le Mans",
    subtitle: "Dayanıklılığın zirvesi",
    image:
      "https://images.unsplash.com/photo-1518081461904-9ac6f7fc2549?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "supercars",
    title: "Supercars",
    subtitle: "Hiper performans, hiper tasarım",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "movie-cars",
    title: "Movie Cars",
    subtitle: "Sinemanın unutulmazları",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "classic",
    title: "Klasikler",
    subtitle: "Zamana meydan okuyanlar",
    image:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* HERO */}
      <section className="relative border-b border-neutral-200 dark:border-white/10">
        <div
          className="h-[340px] bg-cover bg-center"
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
          <div className="mx-auto max-w-6xl px-4 text-white">
            <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Koleksiyonlar
            </h1>
            <p className="mt-2 max-w-2xl text-white/90">
              Temaya göre kürasyon: film efsaneleri, JDM, klasikler, ralli ve daha fazlası.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {c.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

