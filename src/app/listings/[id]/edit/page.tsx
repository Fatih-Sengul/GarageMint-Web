"use client";
import { useParams, useRouter } from "next/navigation";
import { useMyListing, useUpdateListing, useDeleteListing } from "@/lib/queries/listings";
import type { ListingUpdateRequest } from "@/lib/types/listing";
import { useToast } from "@/components/ui/toast";
import Confirm from "@/components/ui/Confirm";
import React from "react";

export default function ListingEditPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const { data: ls, isLoading, isError } = useMyListing(listingId);
  const up = useUpdateListing(listingId);
  const del = useDeleteListing(listingId);
  const { push } = useToast();
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const [form, setForm] = React.useState<ListingUpdateRequest>({});

  React.useEffect(() => {
    if (ls) {
      setForm({
        title: ls.title ?? "",
        description: ls.description ?? "",
        price: ls.type === "SALE" ? Number(ls.price ?? 0) : null,
        currency: ls.type === "SALE" ? (ls.currency ?? "TRY") : null,
        status: (ls.status as ListingUpdateRequest["status"]) ?? "ACTIVE",
      });
    }
  }, [ls]);

  if (isLoading) return <div className="mx-auto max-w-3xl p-6 text-sm text-neutral-400">Yükleniyor…</div>;
  if (isError || !ls) return <div className="mx-auto max-w-3xl p-6">İlan bulunamadı.</div>;

  const save = () => {
    // FE tarafı min validasyon
    if (form.status === "SOLD" || (ls.type === "SALE" && (form.price ?? 0) < 0)) {
      // örnek uyarı
    }
    up.mutate(form, {
      onSuccess: () => { push({ type:"success", title:"İlan güncellendi" }); router.push("/me"); },
      onError: (e) => push({ type:"error", title:"Kaydedilemedi", description:String(e) }),
    });
  };

  const softDelete = () => {
    del.mutate(undefined, {
      onSuccess: () => { push({ type:"success", title:"İlan pasifleştirildi" }); router.push("/me"); },
      onError: (e) => push({ type:"error", title:"Silinemedi", description:String(e) }),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 grid gap-6">
      <h1 className="text-2xl font-extrabold">İlanı Düzenle</h1>

      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 grid gap-4">
        <Field label="Başlık">
          <input className="input" value={form.title ?? ""} onChange={e => setForm(s=>({...s,title:e.target.value}))}/>
        </Field>
        <Field label="Açıklama">
          <textarea className="input" rows={5} value={form.description ?? ""} onChange={e => setForm(s=>({...s,description:e.target.value}))}/>
        </Field>

        {ls.type === "SALE" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fiyat">
              <input type="number" className="input" value={form.price ?? 0} onChange={e => setForm(s=>({...s,price:Number(e.target.value)}))}/>
            </Field>
            <Field label="Para Birimi">
              <input className="input" maxLength={3} value={form.currency ?? "TRY"} onChange={e => setForm(s=>({...s,currency:e.target.value.toUpperCase()}))}/>
            </Field>
          </div>
        )}

        <Field label="Durum">
          <select className="input" value={form.status ?? "ACTIVE"} onChange={e => setForm(s=>({...s,status:e.target.value as ListingUpdateRequest["status"]}))}>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
            <option value="SOLD">Satıldı</option>
          </select>
        </Field>

        <div className="flex justify-between pt-2">
          <button onClick={()=>setOpenConfirm(true)} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60" disabled={del.isPending}>İlanı Pasifleştir</button>
          <button onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60" disabled={up.isPending}>Kaydet</button>
        </div>
      </div>

      <Confirm
        open={openConfirm}
        onCancelAction={() => setOpenConfirm(false)}
        onConfirmAction={() => {
          setOpenConfirm(false);
          softDelete();
        }}
        title="İlan pasifleştirilsin mi?"
        description="Bu işlem ilanı pasif yapar (INACTIVE)."
        confirmText="Evet, pasifleştir"
      />
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm"><span className="font-semibold">{label}</span>{children}</label>;
}
