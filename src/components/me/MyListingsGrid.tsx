import ListingCard from "@/components/listings/ListingCard";
import type { ProfileOwnerDto } from "@/lib/types/profile";
import Link from "next/link";

export default function MyListingsGrid({ me }: { me: ProfileOwnerDto }) {
    const items = me.listings ?? [];
    if (!items.length) return <p className="text-sm text-neutral-400">Henüz ilan yok.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((t) => (
                <div key={t.id}>
                    <ListingCard it={t} />
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                        <span>{t.price ? `${t.price} ${t.currency ?? ""}` : ""}</span>
                        <div className="flex gap-3">
                            <Link href={`/listings/${t.id}/edit`} className="hover:underline">Düzenle</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
