"use client";
import { useParams, useRouter } from "next/navigation";
import { useAuction, useUpdateAuction, useDeleteAuction } from "@/lib/queries/auction";
import type { AuctionUpdateRequest } from "@/lib/types/auction";
import { useToast } from "@/components/ui/toast";
import Confirm from "@/components/ui/Confirm";
import React from "react";

export default function AuctionEditPage() {
  const { id } = useParams<{ id: string }>();
  const auctionId = Number(id);
  const { data: a, isLoading, isError } = useAuction(auctionId);
  const up = useUpdateAuction(auctionId);
  const del = useDeleteAuction(auctionId);
  const { push } = useToast();
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const [form, setForm] = React.useState<AuctionUpdateRequest>({});

  React.useEffect(() => {
    if (a) {
      setForm({
        title: a.title ?? "",
        description: a.description ?? "",
        brand: a.brand ?? "",
        model: a.model ?? "",
        location: a.location ?? "",
        endsAt: a.endsAt,
        status: a.status === "CANCELLED" ? "CANCELLED" : (a.status === "ACTIVE" ? "ACTIVE" : undefined),
      });
    }
  }, [a]);

  if (isLoading) return <div className="mx-auto max-w-3xl p-6 text-sm text-neutral-400">Yükleniyor…</div>;
  if (isError || !a) return <div className="mx-auto max-w-3xl p-6">Mezat bulunamadı.</div>;

  const ended = a.status === "ENDED";
  const save = () => {
    if (ended) { push({ type:"error", title:"Bitti", description:"Biten mezat güncellenemez." }); return; }
    up.mutate(form, {
      onSuccess: () => { push({ type:"success", title:"Mezat güncellendi" }); router.push("/auctions"); },
      onError: (e) => push({ type:"error", title:"Kaydedilemedi", description:String(e) }),
    });
  };
  const cancelAuction = () => {
    del.mutate(undefined, {
      onSuccess: () => { push({ type:"success", title:"Mezat iptal edildi" }); router.push("/auctions"); },
      onError: (e) => push({ type:"error", title:"İptal edilemedi", description:String(e) }),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 grid gap-6">
      <h1 className="text-2xl font-extrabold">Mezatı Düzenle</h1>

      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Başlık">
            <input className="input" value={form.title ?? ""} onChange={e=>setForm(s=>({...s,title:e.target.value}))} disabled={ended}/>
          </Field>
          <Field label="Konum">
            <input className="input" value={form.location ?? ""} onChange={e=>setForm(s=>({...s,location:e.target.value}))} disabled={ended}/>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Marka">
            <input className="input" value={form.brand ?? ""} onChange={e=>setForm(s=>({...s,brand:e.target.value}))} disabled={ended}/>
          </Field>
          <Field label="Model">
            <input className="input" value={form.model ?? ""} onChange={e=>setForm(s=>({...s,model:e.target.value}))} disabled={ended}/>
          </Field>
        </div>

        <Field label="Açıklama">
          <textarea className="input" rows={5} value={form.description ?? ""} onChange={e=>setForm(s=>({...s,description:e.target.value}))} disabled={ended}/>
        </Field>

        <Field label="Bitiş Zamanı">
          <input
            type="datetime-local"
            className="input"
            value={form.endsAt ? toLocalInput(form.endsAt) : ""}
            onChange={e=>setForm(s=>({...s,endsAt: fromLocalInput(e.target.value)}))}
            disabled={ended}
          />
        </Field>

          <Field label="Durum">
          <select className="input" value={form.status ?? (a.status === "ACTIVE" ? "ACTIVE" : "")} onChange={e=>setForm(s=>({...s,status:e.target.value as AuctionUpdateRequest["status"]}))} disabled={ended}>
            <option value="">—</option>
            <option value="ACTIVE">Aktif</option>
            <option value="CANCELLED">İptal</option>
          </select>
        </Field>

        <div className="flex justify-between pt-2">
          <button onClick={()=>setOpenConfirm(true)} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60" disabled={del.isPending || ended}>Mezatı İptal Et</button>
          <button onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60" disabled={up.isPending || ended}>Kaydet</button>
        </div>
      </div>

      <Confirm
        open={openConfirm}
        onCancelAction={() => setOpenConfirm(false)}
        onConfirmAction={() => {
          setOpenConfirm(false);
          cancelAuction();
        }}
        title="Mezat iptal edilsin mi?"
        description="Bu işlem mezatı CANCELLED durumuna getirir."
        confirmText="Evet, iptal et"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm"><span className="font-semibold">{label}</span>{children}</label>;
}
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n:number)=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string) { return new Date(v).toISOString(); }
