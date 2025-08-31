import type { ProfileOwnerDto } from "@/lib/types/profile";

export default function MyListingsGrid({ me }: { me: ProfileOwnerDto }) {
    const items = me.listings ?? [];
    if (!items.length) return null;

    return (
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
            <h3 className="text-lg font-bold mb-4">İlanlarım</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((t) => (
                    <article key={t.id} className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative">
                            <img
                                src={t.images?.[0]?.url ?? "https://picsum.photos/seed/fallback/800/600"}
                                alt={t.title}
                                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            {t.brandName && (
                                <span className="absolute top-2 left-2 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-bold px-2 py-1 shadow-sm ring-1 ring-white/30">
                  {t.brandName}
                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold line-clamp-1">{t.title}</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {t.modelName ?? t.seriesName ?? t.theme ?? ""}
                            </p>
                            <p className="mt-1 text-sm">{t.price ? `${t.price} ${t.currency ?? ""}` : ""}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
