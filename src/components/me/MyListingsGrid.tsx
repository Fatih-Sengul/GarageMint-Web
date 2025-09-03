import ListingCard from "@/components/listings/ListingCard";
import type { ProfileOwnerDto } from "@/lib/types/profile";

export default function MyListingsGrid({ me }: { me: ProfileOwnerDto }) {
    const items = me.listings ?? [];
    if (!items.length) return <p className="text-sm text-neutral-400">Henüz ilan yok.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((t) => (
                <ListingCard key={t.id} it={t} />
            ))}
        </div>
    );
}
