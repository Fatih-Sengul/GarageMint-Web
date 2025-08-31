"use client";
import {useEffect, useState} from "react";
import type {ProfileOwnerDto, ProfilePrefsUpdateRequest} from "@/lib/types/profile";
import {useUpdateMyPrefs} from "@/lib/queries/profile";

type Props = { me: ProfileOwnerDto };

export default function PrefsForm({ me }: Props) {
    const m = useUpdateMyPrefs();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<ProfilePrefsUpdateRequest>({
        showEmail: false,
        showLocation: true,
        showLinks: true,
        searchable: true,
        allowDm: true,
        showCollection: false,
        showListings: true,
    });

    useEffect(() => {
        if (me?.prefs) setForm({...me.prefs});
    }, [me]);

    const onToggle = <K extends keyof ProfilePrefsUpdateRequest>(k: K) =>
        setForm(s => ({ ...s, [k]: !s[k] }));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        m.mutate(form, { onSuccess: () => setSaved(true) });
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.showEmail} onChange={() => onToggle("showEmail")} />
                    E-postamı göster
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.showLocation} onChange={() => onToggle("showLocation")} />
                    Konumu göster
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.showLinks} onChange={() => onToggle("showLinks")} />
                    Sosyal bağlantıları göster
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.searchable} onChange={() => onToggle("searchable")} />
                    Profil arama sonuçlarında çıksın
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.allowDm} onChange={() => onToggle("allowDm")} />
                    DM kabul et
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.showCollection} onChange={() => onToggle("showCollection")} />
                    Koleksiyonu göster
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.showListings} onChange={() => onToggle("showListings")} />
                    İlanları göster
                </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={m.isPending}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white"
                >
                    Tercihleri Kaydet
                </button>
                {saved && <span className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300">Kaydedildi</span>}
                {m.isError && <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300">Hata: {(m.error as any)?.message ?? "Kaydedilemedi"}</span>}
            </div>
        </form>
    );
}
