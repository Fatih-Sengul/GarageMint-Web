"use client";

import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

/* ==== Types aligned to BE DTOs ==== */
type Brand = { id: number; name: string; slug: string; country?: string | null };
type Series = { id: number; brandId: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

type Condition = "NEW" | "MINT" | "USED" | "CUSTOM";
type ListingType = "SALE" | "TRADE";

type ListingImageUpsertDto = { url: string; idx: number };

type ListingCreateRequest = {
  title: string;
  description?: string;
  brandId?: number | null;
  seriesId?: number | null;
  modelName?: string;
  scale?: string;
  modelYear?: number | null;
  condition?: Condition | string;
  limitedEdition?: boolean;
  theme?: string;
  countryOfOrigin?: string;
  type: ListingType | string;
  price?: number | null;
  currency?: string;
  location?: string;
  tagIds?: number[];
  images?: ListingImageUpsertDto[];
};

/* ==== UI helpers ==== */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      {children}
    </label>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-neutral-500 dark:text-neutral-400">{children}</p>;
}

/* ==== Page ==== */
export default function SellPage() {
  const router = useRouter();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [loadingInit, setLoadingInit] = useState(true);
  const [errorInit, setErrorInit] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [notify, setNotify] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // form state
  const [form, setForm] = useState<ListingCreateRequest>({
    title: "",
    description: "",
    type: "SALE",
    price: undefined,
    currency: "TRY",
    brandId: undefined,
    seriesId: undefined,
    modelName: "",
    scale: "1:64",
    modelYear: undefined,
    condition: "MINT",
    limitedEdition: false,
    theme: "",
    countryOfOrigin: "",
    location: "",
    tagIds: [],
    images: [{ url: "", idx: 0 }],
  });

  /* ==== Init: brands & tags ==== */
  useEffect(() => {
    let cancel = false;
    async function run() {
      try {
        setLoadingInit(true);
        setErrorInit(null);

        const [bRes, tRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/cars/brands`, { cache: "no-store" }),
          fetch(`${API_BASE}/api/v1/cars/tags`, { cache: "no-store" }),
        ]);
        if (!bRes.ok) throw new Error(`Brands HTTP ${bRes.status}`);
        if (!tRes.ok) throw new Error(`Tags HTTP ${tRes.status}`);

        const [bJson, tJson]: [Brand[], Tag[]] = await Promise.all([bRes.json(), tRes.json()]);
        if (!cancel) {
          setBrands(bJson);
          setTags(tJson);
        }
        } catch (e: unknown) {
          if (!cancel) setErrorInit(e instanceof Error ? e.message : "Başlangıç verileri alınamadı");
      } finally {
        if (!cancel) setLoadingInit(false);
      }
    }
    run();
    return () => {
      cancel = true;
    };
  }, []);

  /* ==== Dependent: series by brand ==== */
  useEffect(() => {
    let cancel = false;
    const brandId = form.brandId;
    if (!brandId) {
      setSeries([]);
      setForm((s) => ({ ...s, seriesId: undefined }));
      return;
    }
    async function loadSeries() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/cars/series?brandId=${brandId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Series HTTP ${res.status}`);
        const json: Series[] = await res.json();
        if (!cancel) {
          setSeries(json);
          // seçili seri bu brand altında yoksa temizle
          if (!json.find((s) => s.id === form.seriesId)) {
            setForm((prev) => ({ ...prev, seriesId: undefined }));
          }
        }
        } catch {
          if (!cancel) setSeries([]);
      }
    }
    loadSeries();
    return () => {
      cancel = true;
    };
  }, [form.brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ==== Handlers ==== */
  const onText =
    (key: keyof ListingCreateRequest) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const onNumber =
    (key: keyof ListingCreateRequest) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setForm((s) => ({ ...s, [key]: v ? Number(v) : undefined }));
    };

  const onSelect =
    (key: keyof ListingCreateRequest) =>
    (e: ChangeEvent<HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const onCheck =
    (key: keyof ListingCreateRequest) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.checked }));

  const setType = (t: ListingType) =>
    setForm((s) => ({
      ...s,
      type: t,
      // SALE dışına çıkınca fiyat/currency'i opsiyonel bırak
      price: t === "SALE" ? s.price ?? undefined : undefined,
      currency: t === "SALE" ? s.currency ?? "TRY" : undefined,
    }));

  // images
  const addImageRow = () =>
    setForm((s) => ({
      ...s,
      images: [...(s.images ?? []), { url: "", idx: (s.images?.length ?? 0) }],
    }));

  const setImageUrl = (i: number, url: string) =>
    setForm((s) => ({
      ...s,
      images: (s.images ?? []).map((img, idx) => (idx === i ? { url, idx: i } : img)),
    }));

  const removeImageRow = (i: number) =>
    setForm((s) => {
      const arr = [...(s.images ?? [])].filter((_, idx) => idx !== i);
      // idx yeniden sırala
      const renum = arr.map((it, idx) => ({ url: it.url, idx }));
      return { ...s, images: renum };
    });

  const toggleTag = (id: number) =>
    setForm((s) => {
      const set = new Set(s.tagIds ?? []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...s, tagIds: Array.from(set) };
    });

  /* ==== Validation ==== */
  const validationError = useMemo(() => {
    if (!form.title || !form.title.trim()) return "Başlık gereklidir.";
    if (form.type === "SALE") {
      if (!form.price || form.price <= 0) return "Satış için fiyat > 0 olmalıdır.";
      if (!form.currency) return "Satış için para birimi zorunludur.";
    }
    // images: boş URL’leri otomatik temizleyeceğiz
    return null;
  }, [form]);

  /* ==== Submit ==== */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotify(null);
    if (validationError) {
      setNotify({ type: "error", text: validationError });
      return;
    }

    // temizle: boş image url’lerini at
    const images = (form.images ?? [])
      .filter((i) => i.url && i.url.trim())
      .map((i, idx) => ({ url: i.url.trim(), idx }));

    const payload: ListingCreateRequest = {
      ...form,
      images,
      // boş stringleri undefined yap
      description: form.description?.trim() ? form.description : undefined,
      modelName: form.modelName?.trim() ? form.modelName : undefined,
      scale: form.scale?.trim() ? form.scale : undefined,
      theme: form.theme?.trim() ? form.theme : undefined,
      countryOfOrigin: form.countryOfOrigin?.trim() ? form.countryOfOrigin : undefined,
      location: form.location?.trim() ? form.location : undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/v1/cars/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = `HTTP ${res.status}`;
        throw new Error(msg);
      }
      setNotify({ type: "success", text: "İlan oluşturuldu." });
      // kısa bir gecikme ile /me'ye götürelim
      setTimeout(() => router.push("/me"), 600);
      } catch (e: unknown) {
        setNotify({ type: "error", text: e instanceof Error ? e.message : "İlan oluşturulamadı." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* HERO mini */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-3xl font-extrabold">İlan Oluştur</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Başlık, durum, marka/seri ve görsellerle zengin bir ilan oluştur.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {loadingInit && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
        {errorInit && (
          <div className="text-sm text-red-400">
            Başlangıç verileri alınamadı: {errorInit}
          </div>
        )}
        {!loadingInit && !errorInit && (
          <form
            onSubmit={onSubmit}
            className="grid gap-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-sm"
          >
            {/* Başlık & Açıklama */}
            <div className="grid gap-4">
              <Field label="Başlık *">
                <input
                  className="input"
                  placeholder="Örn: Nissan Skyline GT-R R34 – 1:64 – Premium"
                  value={form.title}
                  onChange={onText("title")}
                  required
                />
              </Field>
              <Field label="Açıklama">
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Durum, varyant, kutu içeriği, ek notlar…"
                  value={form.description ?? ""}
                  onChange={onText("description")}
                />
              </Field>
            </div>

            {/* Katalog */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Marka">
                <select
                  className="input"
                  value={form.brandId ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      brandId: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                >
                  <option value="">Seçiniz</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <Note>Marka seçince seri listesi otomatik gelir.</Note>
              </Field>

              <Field label="Seri">
                <select
                  className="input"
                  value={form.seriesId ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      seriesId: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  disabled={!form.brandId}
                >
                  <option value="">Seçiniz</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Model Adı">
                <input className="input" value={form.modelName ?? ""} onChange={onText("modelName")} />
              </Field>

              <Field label="Ölçek">
                <select className="input" value={form.scale ?? ""} onChange={onSelect("scale")}>
                  {["1:64", "1:43", "1:24", "1:18", "1:12", "1:8"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Model Yılı">
                <input
                  className="input"
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.modelYear ?? ""}
                  onChange={onNumber("modelYear")}
                />
              </Field>

              <Field label="Durum">
                <select
                  className="input"
                  value={(form.condition as string) ?? "MINT"}
                  onChange={onSelect("condition")}
                >
                  {(["NEW", "MINT", "USED", "CUSTOM"] as Condition[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.limitedEdition}
                  onChange={onCheck("limitedEdition")}
                />
                Sınırlı üretim
              </label>

              <Field label="Tema">
                <input className="input" placeholder="Örn: JDM, Movie Car, Rally…" value={form.theme ?? ""} onChange={onText("theme")} />
              </Field>

              <Field label="Menşei Ülke">
                <input className="input" value={form.countryOfOrigin ?? ""} onChange={onText("countryOfOrigin")} />
              </Field>

              <Field label="Konum">
                <input className="input" placeholder="İzmir, TR" value={form.location ?? ""} onChange={onText("location")} />
              </Field>
            </div>

            {/* Tür & Fiyat */}
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setType("SALE")}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    form.type === "SALE"
                      ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white border-white/30"
                      : "border-neutral-300 dark:border-white/20 hover:bg-white/10"
                  }`}
                >
                  Satış
                </button>
                <button
                  type="button"
                  onClick={() => setType("TRADE")}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    form.type === "TRADE"
                      ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white border-white/30"
                      : "border-neutral-300 dark:border-white/20 hover:bg-white/10"
                  }`}
                >
                  Takas
                </button>
              </div>

              {form.type === "SALE" && (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                  <Field label="Fiyat">
                    <input
                      className="input"
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.price ?? ""}
                      onChange={onNumber("price")}
                    />
                  </Field>
                  <Field label="Para Birimi">
                    <select className="input" value={form.currency ?? "TRY"} onChange={onSelect("currency")}>
                      {["TRY", "USD", "EUR", "GBP"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
            </div>

            {/* Etiketler */}
            <div className="grid gap-2">
              <div className="font-semibold text-sm">Etiketler</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const active = (form.tagIds ?? []).includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTag(t.id)}
                      className={`text-xs rounded-full px-3 py-1 border ${
                        active
                          ? "bg-sky-500/20 border-sky-400/40 text-sky-200"
                          : "border-neutral-300 dark:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Görseller */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">Görseller (URL ile)</div>
                <button
                  type="button"
                  onClick={addImageRow}
                  className="rounded-lg border border-neutral-300 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  + Görsel Ekle
                </button>
              </div>
              <div className="grid gap-2">
                {(form.images ?? []).map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="input flex-1"
                      placeholder="https://…"
                      value={img.url}
                      onChange={(e) => setImageUrl(i, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageRow(i)}
                      className="rounded-lg border border-neutral-300 dark:border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
              <Note>Yüksek çözünürlük önerilir. Sıra (idx) otomatik belirlenir.</Note>
            </div>

            {/* Bildirim & submit */}
            {notify && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  notify.type === "success"
                    ? "bg-emerald-600/15 text-emerald-300"
                    : "bg-red-600/15 text-red-300"
                }`}
              >
                {notify.type === "success" ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4" />
                )}
                {notify.text}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Gönderiliyor…" : "İlanı Oluştur"}
              </button>
              <Note>“Satış” seçtiysen fiyat ve para birimi zorunludur.</Note>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

/* Tailwind input preset (projede yaygın kullandığınız sınıfla tutarlı) */
// global CSS yoksa, utility'yi burada inline kullandık:
  declare global {
    // TSX içinde className="input" kullandık; Tailwind utility aliası gibi.
    // Eğer globalde `.input` tanımlıysa bunu kaldır.
    // Burada sadece TS'e "input" adını serbestçe kullanıyoruz demek için.
    // (stil Tailwind utility’lerden geliyor)
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface JSX {
      // noop
    }
  }

