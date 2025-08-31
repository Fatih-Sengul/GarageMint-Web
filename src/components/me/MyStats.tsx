import type { ProfileOwnerDto } from "@/lib/types/profile";

export default function MyStats({ me }: { me: ProfileOwnerDto }) {
    const s = me.stats ?? {};
    const cards = [
        { label: "Aktif İlan", value: s.listingsActiveCount ?? 0 },
        { label: "Toplam İlan", value: s.listingsTotalCount ?? 0 },
        { label: "Takipçi", value: s.followersCount ?? 0 },
        { label: "Takip", value: s.followingCount ?? 0 },
        { label: "Cevap Oranı", value: `${s.responseRate ?? 0}%` },
    ];

    return (
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {cards.map((c) => (
                <div key={c.label} className="rounded-xl border border-neutral-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900 text-center shadow-sm">
                    <div className="text-2xl font-extrabold">{c.value}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{c.label}</div>
                </div>
            ))}
        </section>
    );
}
