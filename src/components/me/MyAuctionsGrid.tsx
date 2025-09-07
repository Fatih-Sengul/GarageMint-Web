import AuctionCard from "@/components/auction/AuctionCard";
import type { ProfileOwnerDto } from "@/lib/types/profile";
import Link from "next/link";

export default function MyAuctionsGrid({ me }: { me: ProfileOwnerDto }) {
    const items = me.auctions ?? [];
    if (!items.length) {
        if (!me.listings?.length) {
            return (
                <div className="text-sm text-neutral-400">
                    <p>Henüz mezat yok.</p>
                    <div className="mt-2 flex gap-3 text-sm">
                        <Link href="/sell" className="text-sky-400 hover:underline">
                            İlan Oluştur
                        </Link>
                        <Link href="/auctions/new" className="text-sky-400 hover:underline">
                            Mezat Oluştur
                        </Link>
                    </div>
                </div>
            );
        }
        return <p className="text-sm text-neutral-400">Henüz mezat yok.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((a) => (
                <div key={a.id}>
                    <AuctionCard a={a} />
                </div>
            ))}
        </div>
    );
}

