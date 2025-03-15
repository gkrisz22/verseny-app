"use client";

import { useTransition } from "react";
import { downloadFile } from "@/actions/media.actions";

export function useDownload() {
    const [isPending, startTransition] = useTransition();

    const handleDownload = async (fileId: string) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("fileId", fileId);
            const response = await downloadFile(formData);

            if (response?.success && response.url) {
                window.open(response.url, "_blank");
            } else {
                alert("Hiba történt a letöltés során.");
            }
        });
    };

    return { handleDownload, isPending };
}
