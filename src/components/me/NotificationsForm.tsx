"use client";
import { useEffect, useState } from "react";
import type { NotificationSettingsUpdateRequest, ProfileOwnerDto } from "@/lib/types/profile";
import { useUpdateMyNotifications } from "@/lib/queries/profile";
import { useToast } from "@/components/ui/toast";

export default function NotificationsForm({ me }: { me: ProfileOwnerDto }) {
    const [form, setForm] = useState<NotificationSettingsUpdateRequest>({});
    const m = useUpdateMyNotifications();
    const { push } = useToast();

    useEffect(() => { setForm({ ...me.notificationSettings }); }, [me]);
    const toggle = (k: keyof NotificationSettingsUpdateRequest) =>
        setForm((s) => ({ ...s, [k]: !s?.[k] }));

    return (
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Bildirimler</h3>
            {/* ... (checkbox ve select) */}
            <div className="mt-4">
                <button
                    onClick={() =>
                        m.mutate(form, {
                            onSuccess: () => push({ type: "success", title: "Bildirim ayarları kaydedildi" }),
                            onError: (e) => push({ type: "error", title: "Kaydetme başarısız", description: String(e) }),
                        })
                    }
                    disabled={m.isPending}
                    className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Bildirimleri Kaydet
                </button>
            </div>
        </section>
    );
}
