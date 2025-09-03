"use client";

import { useParams } from "next/navigation";
import { useListingById } from "@/lib/queries/listings";
import { useMyProfile } from "@/lib/queries/profile";
import Link from "next/link";

export default function ListingDetailPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const { data, isLoading, isError } = useListingById(id);
    const { data: me } = useMyProfile();

    if (isLoading) return <main className="mx-auto max-w-[1100px] px-4 py-6">Yükleniyor…</main>;
    if (isError || !data) return <main className="mx-auto max-w-[1100px] px-4 py-6">İlan bulunamadı.</main>;

    const img = data.images?.[0]?.url ?? "/listing-placeholder.jpg";

    return (
        <main className="mx-auto max-w-[1100px] px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                {/* Görsel + açıklama */}
                <section className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={data.title} className="h-full w-full object-cover" />
                    </div>
                    <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{data.title}</h1>
                    {me?.userId === data.seller?.userId && (
                        <Link href={`/listings/${id}/edit`} className="text-xs text-sky-400 hover:underline">Düzenle</Link>
                    )}
                    {data.description && <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-300">{data.description}</p>}
                </section>

                {/* Özellikler & fiyat */}
                <aside className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                        <div className="text-xl font-bold">
                            {data.type === "TRADE" ? "Takas" : formatMoney(data.price, data.currency)}
                        </div>
                        {data.location && <div className="text-sm text-neutral-400 mt-1">{data.location}</div>}
                        {data.seller && (
                            <div className="mt-4 flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.seller.avatarUrl ?? "/avatar-placeholder.png"} alt="seller" className="h-10 w-10 rounded-lg object-cover" />
                                <div>
                                    <div className="font-semibold">{data.seller.displayName ?? data.seller.username ?? "Satıcı"}</div>
                                    {data.seller.location && <div className="text-xs text-neutral-400">{data.seller.location}</div>}
                                </div>
                            </div>
                        )}
                        <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                            {data.type === "TRADE" ? "Takas Teklifi Ver" : "Satıcıyla İletişime Geç"}
                        </button>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                        <h3 className="mb-2 font-bold">Teknik Bilgiler</h3>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <DT k="Marka" v={data.brandName} />
                            <DT k="Seri" v={data.seriesName} />
                            <DT k="Model" v={data.modelName} />
                            <DT k="Ölçek" v={data.scale} />
                            <DT k="Model Yılı" v={data.modelYear?.toString()} />
                            <DT k="Durum" v={data.condition} />
                            <DT k="Tema" v={data.theme} />
                            <DT k="Menşei" v={data.countryOfOrigin} />
                            <DT k="Durum (ilan)" v={data.status} />
                            <DT k="Son Güncelleme" v={data.updatedAt?.slice(0,10)} />
                        </dl>
                    </div>

                    {data.tags && data.tags.length > 0 && (
                        <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                            <h3 className="mb-2 font-bold">Etiketler</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map(t => (
                                    <span key={t.id} className="rounded-md bg-white/10 px-2 py-0.5 text-xs">{t.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
}

function DT({ k, v }: { k: string; v?: string | null }) {
    if (!v) return null;
    return (
        <>
            <dt className="text-neutral-400">{k}</dt>
            <dd className="font-medium">{v}</dd>
        </>
    );
}

function formatMoney(v: number | string | null | undefined, cur?: string | null) {
    const n = typeof v === "string" ? Number(v) : v ?? 0;
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: cur ?? "TRY", maximumFractionDigits: 0 }).format(n);
}
