"use client";

import { useTransition } from "react";
import { downloadFile } from "@/app/_actions/media.action";
import { toast } from "sonner";

export function useDownload() {
    const [isPending, startTransition] = useTransition();

    const handleDownload = async (fileId: string) => {
        if (!fileId) {
            toast.error("Nincs fájl kiválasztva.");
            return;
        }

        startTransition(async () => {       
            const res = await downloadFile(fileId);
            if (res?.success && res.url) {
                window.open(res.url, "_blank");
            } else {
                toast.error("Hiba történt a letöltés során.");
            }
        });
    };

    return { handleDownload, isPending };
}
