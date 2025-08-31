"use client";

import { useRef, useState } from "react";
import { useUploadMyAvatar, useUploadMyBanner } from "@/lib/queries/profile";
import { useToast } from "@/components/ui/toast";
import { CameraIcon } from "@heroicons/react/24/solid";


const ALLOWED = ["image/jpeg","image/png","image/webp","image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export default function ProfileHeader(props: {
    username: string;
    displayName?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isVerified?: boolean | null;
}) {
    const avatarInput = useRef<HTMLInputElement | null>(null);
    const bannerInput = useRef<HTMLInputElement | null>(null);

    const [avatarPreview, setAvatarPreview] = useState<string>();
    const [bannerPreview, setBannerPreview] = useState<string>();

    const mAvatar = useUploadMyAvatar();
    const mBanner = useUploadMyBanner();
    const { push } = useToast();

    const validateFile = (f: File) => {
        if (!ALLOWED.includes(f.type)) {
            push({
                type: "error",
                title: "Desteklenmeyen format",
                description: "Yalnızca JPEG, PNG, WebP veya GIF yükleyebilirsin.",
            });
            return false;
        }
        if (f.size > MAX_SIZE) {
            push({
                type: "error",
                title: "Dosya çok büyük",
                description: "Maksimum 8 MB boyutunda görsel yükleyebilirsin.",
            });
            return false;
        }
        return true;
    };

    const onPickAvatar = () => avatarInput.current?.click();
    const onPickBanner = () => bannerInput.current?.click();

    const handleAvatar = (f: File) => {
        if (!validateFile(f)) return;
        setAvatarPreview(URL.createObjectURL(f));
        mAvatar.mutate(f, {
            onSuccess: () => push({ type: "success", title: "Avatar güncellendi" }),
            onError: (e) =>
                push({ type: "error", title: "Yükleme başarısız", description: String(e) }),
        });
    };
    const handleBanner = (f: File) => {
        if (!validateFile(f)) return;
        setBannerPreview(URL.createObjectURL(f));
        mBanner.mutate(f, {
            onSuccess: () => push({ type: "success", title: "Banner güncellendi" }),
            onError: (e) =>
                push({ type: "error", title: "Yükleme başarısız", description: String(e) }),
        });
    };

    return (
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
            {/* Banner */}
            <div className="relative">
                <img
                    src={bannerPreview ?? props.bannerUrl ?? "/banner-placeholder.jpg"}
                    alt="banner"
                    className="h-48 w-full object-cover"
                />
                <button
                    type="button"
                    onClick={onPickBanner}
                    className="absolute bottom-3 right-3 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow ring-1 ring-white/30 disabled:opacity-60"
                    disabled={mBanner.isPending}
                >
                    {mBanner.isPending ? "Yükleniyor…" : "Banner Yükle"}
                </button>
                <input
                    ref={bannerInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleBanner(f);
                    }}
                />
            </div>

            {/* Avatar + isim */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                    <div className="relative -mt-14">
                        <img
                            src={avatarPreview ?? props.avatarUrl ?? "/avatar-placeholder.png"}
                            alt={props.username}
                            className="h-20 w-20 rounded-xl ring-2 ring-white bg-white object-cover"
                        />

                        {/* Küçük, dairesel, ikonlu buton */}
                        <button
                            type="button"
                            onClick={onPickAvatar}
                            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full
               bg-white/95 text-neutral-900 shadow ring-1 ring-neutral-200
               hover:bg-white disabled:opacity-60"
                            aria-label="Avatar Yükle"
                            title="Avatar Yükle"
                            disabled={mAvatar.isPending}
                        >
                            <CameraIcon className="h-3.5 w-3.5" />
                        </button>

                        <input
                            ref={avatarInput}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleAvatar(f);
                            }}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight">
                            {props.displayName ?? props.username}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">@{props.username}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
