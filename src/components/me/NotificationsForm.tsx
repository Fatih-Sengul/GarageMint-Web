"use client";
import {useEffect, useState} from "react";
import type {
    NotificationSettingsDto,
    NotificationSettingsUpdateRequest,
    ProfileOwnerDto
} from "@/lib/types/profile";
import {useUpdateMyNotifications} from "@/lib/queries/profile";

type Props = { me: ProfileOwnerDto };
type DigestFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export default function NotificationsForm({ me }: Props) {
    const m = useUpdateMyNotifications();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<NotificationSettingsUpdateRequest>({
        emailGeneral: true,
        emailMessage: true,
        emailFavorite: true,
        emailListingActivity: true,
        pushGeneral: true,
        digestFrequency: "WEEKLY" as DigestFrequency
    });

    useEffect(() => {
        const n: NotificationSettingsDto | undefined = me?.notificationSettings;
        if (n) setForm({
            emailGeneral: n.emailGeneral,
            emailMessage: n.emailMessage,
            emailFavorite: n.emailFavorite,
            emailListingActivity: n.emailListingActivity,
            pushGeneral: n.pushGeneral,
            digestFrequency: n.digestFrequency as DigestFrequency
        });
    }, [me]);

    const onToggle = <K extends keyof NotificationSettingsUpdateRequest>(k: K) =>
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
                    <input type="checkbox" checked={!!form.emailGeneral} onChange={() => onToggle("emailGeneral")} />
                    Genel duyurular (e-posta)
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.emailMessage} onChange={() => onToggle("emailMessage")} />
                    Mesaj bildirimi (e-posta)
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.emailFavorite} onChange={() => onToggle("emailFavorite")} />
                    Favorilere eklendi (e-posta)
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.emailListingActivity} onChange={() => onToggle("emailListingActivity")} />
                    İlan hareketleri (e-posta)
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.pushGeneral} onChange={() => onToggle("pushGeneral")} />
                    Push bildirimleri
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                    Özet sıklığı
                    <select
                        className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
                        value={form.digestFrequency ?? "WEEKLY"}
                        onChange={(e) => setForm(s => ({ ...s, digestFrequency: e.target.value as DigestFrequency }))}
                    >
                        <option value="DAILY">Günlük</option>
                        <option value="WEEKLY">Haftalık</option>
                        <option value="MONTHLY">Aylık</option>
                    </select>
                </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={m.isPending}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white"
                >
                    Bildirimleri Kaydet
                </button>
                {saved && <span className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300">Kaydedildi</span>}
                {m.isError && <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300">Hata: {(m.error as any)?.message ?? "Kaydedilemedi"}</span>}
            </div>
        </form>
    );
}
