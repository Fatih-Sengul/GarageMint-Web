"use client";
import { useCreateAuction, useUploadAuctionImages } from "@/lib/queries/auction";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Guard from "@/components/auth/Guard";

const ALLOWED = ["image/jpeg","image/png","image/webp","image/gif"];
const MAX_SIZE = 8 * 1024 * 1024;

export default function AuctionNewPage() {
  const r = useRouter();
  const mCreate = useCreateAuction();
  const mUpload = useUploadAuctionImages();
  const [files, setFiles] = useState<File[]>([]);
  const uploaderRef = useRef<HTMLInputElement|null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    brand: "",
    model: "",
    location: "",
    startPrice: "100.00",
    durationDays: 7, // 1..15
  });

  const addFiles = (sel: FileList | null) => {
    if (!sel) return;
    const arr = Array.from(sel);
    const next = [...files];
    for (const f of arr) {
      if (next.length >= 3) break;
      if (!ALLOWED.includes(f.type) || f.size > MAX_SIZE) continue;
      next.push(f);
    }
    setFiles(next.slice(0,3));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // endsAt = now + durationDays
    const now = new Date();
    const ends = new Date(now.getTime() + form.durationDays*24*60*60*1000);

    const created = await mCreate.mutateAsync({
      startPrice: Number(form.startPrice).toFixed(2),
      startsAt: now.toISOString(),
      endsAt: ends.toISOString(),
      title: form.title || undefined,
      description: form.description || undefined,
      brand: form.brand || undefined,
      model: form.model || undefined,
      location: form.location || undefined,
    });

    if (created?.id && files.length) {
      await mUpload.mutateAsync({ id: created.id, files });
    }
    r.push(`/auctions/${created.id}`);
  };

  return (
    <Guard>
    <div className="mx-auto max-w-3xl px-4 py-6 grid gap-6">
      <h1 className="text-2xl font-extrabold">Yeni Mezat Oluştur</h1>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Başlık">
            <input className="input" value={form.title} onChange={(e)=>setForm(s=>({...s,title:e.target.value}))}/>
          </Field>
          <Field label="Marka">
            <input className="input" value={form.brand} onChange={(e)=>setForm(s=>({...s,brand:e.target.value}))}/>
          </Field>
          <Field label="Model">
            <input className="input" value={form.model} onChange={(e)=>setForm(s=>({...s,model:e.target.value}))}/>
          </Field>
          <Field label="Konum">
            <input className="input" value={form.location} onChange={(e)=>setForm(s=>({...s,location:e.target.value}))}/>
          </Field>
        </div>

        <Field label="Açıklama">
          <textarea className="input" rows={4} value={form.description} onChange={(e)=>setForm(s=>({...s,description:e.target.value}))}/>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Başlangıç Fiyatı (TRY)">
            <input className="input" type="number" step="0.01" min="0.01"
              value={form.startPrice}
              onChange={(e)=>setForm(s=>({...s,startPrice:e.target.value}))}/>
          </Field>
          <Field label="Süre (gün)">
            <select className="input" value={form.durationDays} onChange={(e)=>setForm(s=>({...s,durationDays:Number(e.target.value)}))}>
              {Array.from({length:15},(_,i)=>i+1).map(d=> <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        {/* Fotoğraflar */}
        <div className="grid gap-2">
          <div className="text-sm font-semibold">Fotoğraflar (en fazla 3)</div>
          <div className="flex gap-3">
            {files.map((f, idx)=>(
              <div key={idx} className="relative h-24 w-24 overflow-hidden rounded-lg border border-white/10">
                <img src={URL.createObjectURL(f)} className="h-full w-full object-cover" alt="" />
              </div>
            ))}
            {files.length < 3 && (
              <button type="button" onClick={()=>uploaderRef.current?.click()}
                className="h-24 w-24 grid place-items-center rounded-lg border border-dashed border-white/20 text-sm text-neutral-400">
                + Ekle
              </button>
            )}
          </div>
          <input
            ref={uploaderRef}
            type="file" accept="image/*" multiple hidden
            onChange={(e)=>addFiles(e.target.files)}
          />
          <p className="text-xs text-neutral-500">Desteklenen: JPG, PNG, WebP, GIF • max 8MB • en fazla 3 adet</p>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={mCreate.isPending}
            className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            Oluştur
          </button>
        </div>
      </form>
    </div>
    </Guard>
  );
}

function Field({label, children}:{label:string;children:React.ReactNode}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      {children}
    </label>
  );
}
