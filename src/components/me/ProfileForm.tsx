"use client";

import { useEffect, useState, ChangeEvent } from "react";
import type { ProfileOwnerDto, ProfileUpdateRequest } from "@/lib/types/profile";
import { useUpdateMyProfile } from "@/lib/queries/profile";
import { useToast } from "@/components/ui/toast";

export default function ProfileForm({ me }: { me: ProfileOwnerDto }) {
    const [form, setForm] = useState<ProfileUpdateRequest>({});
    const m = useUpdateMyProfile();
    const { push } = useToast();

    useEffect(() => {
        setForm({
            username: me.username,           // istersek ileride editable yaparız
            displayName: me.displayName,
            bio: me.bio,
            location: me.location,
            websiteUrl: me.websiteUrl,
            language: me.language,
            isPublic: me.isPublic ?? true,
        });
    }, [me]);

    const onText =
        (key: keyof ProfileUpdateRequest) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setForm((s) => ({ ...s, [key]: e.target.value }));

    const onToggle =
        (key: keyof ProfileUpdateRequest) =>
            (e: ChangeEvent<HTMLInputElement>) =>
                setForm((s) => ({ ...s, [key]: e.target.checked }));

    const save = () =>
        m.mutate(form, {
            onSuccess: () => push({ type: "success", title: "Profil kaydedildi" }),
            onError: (err) =>
                push({
                    type: "error",
                    title: "Kaydetme başarısız",
                    description:
                        err instanceof Error ? err.message : "Bilinmeyen hata",
                }),
        });

    return (
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Profil Bilgileri</h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Görünen İsim">
                    <input
                        className="input"
                        value={form.displayName ?? ""}
                        onChange={onText("displayName")}
                    />
                </Field>

                <Field label="Konum">
                    <input
                        className="input"
                        value={form.location ?? ""}
                        onChange={onText("location")}
                    />
                </Field>

                <Field label="Web Sitesi">
                    <input
                        className="input"
                        value={form.websiteUrl ?? ""}
                        onChange={onText("websiteUrl")}
                    />
                </Field>

                <Field label="Dil">
                    <input
                        className="input"
                        value={form.language ?? ""}
                        onChange={onText("language")}
                    />
                </Field>

                <div className="sm:col-span-2">
                    <Field label="Biyografi">
            <textarea
                rows={4}
                className="input"
                value={form.bio ?? ""}
                onChange={onText("bio")}
            />
                    </Field>
                </div>

                <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                        type="checkbox"
                        checked={!!form.isPublic}
                        onChange={onToggle("isPublic")}
                    />
                    Profili herkese açık yap
                </label>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={save}
                    disabled={m.isPending}
                    className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Değişiklikleri Kaydet
                </button>
            </div>
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1 text-sm">
            <span className="font-semibold">{label}</span>
            {children}
        </label>
    );
}
