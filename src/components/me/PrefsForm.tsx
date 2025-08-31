"use client";
import { useEffect, useState } from "react";
import type { ProfileOwnerDto, ProfilePrefsUpdateRequest } from "@/lib/types/profile";
import { useUpdateMyPrefs } from "@/lib/queries/profile";
import { useToast } from "@/components/ui/toast";

export default function PrefsForm({ me }: { me: ProfileOwnerDto }) {
    const [prefs, setPrefs] = useState<ProfilePrefsUpdateRequest>({});
    const m = useUpdateMyPrefs();
    const { push } = useToast();

    useEffect(() => { setPrefs({ ...me.prefs }); }, [me]);
    const toggle = (k: keyof ProfilePrefsUpdateRequest) => setPrefs((s) => ({ ...s, [k]: !s?.[k] }));

    return (
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Tercihler</h3>
            {/* ... (checkbox’lar) */}
            <div className="mt-4">
                <button
                    onClick={() =>
                        m.mutate(prefs, {
                            onSuccess: () => push({ type: "success", title: "Tercihler güncellendi" }),
                            onError: (e) => push({ type: "error", title: "Güncelleme başarısız", description: String(e) }),
                        })
                    }
                    disabled={m.isPending}
                    className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Tercihleri Kaydet
                </button>
            </div>
        </section>
    );
}
