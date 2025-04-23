"use server";

import { actionHandler } from "@/lib/action.handler";
import {
    HandleAcademicYearDTO,
    handleAcademicYearSchema,
} from "@/lib/definitions";
import settingsService from "@/services/settings.service";
import { ActionResponse } from "@/types/form/action-response";
import { revalidatePath } from "next/cache";

export async function handleAcademicYear(
    prevState: ActionResponse<HandleAcademicYearDTO>,
    formData: FormData
): Promise<ActionResponse<HandleAcademicYearDTO>> {
    return actionHandler<HandleAcademicYearDTO>(
        handleAcademicYearSchema,
        formData,
        async (data) => {
            try {
                const { name, startDate, endDate } = data;
                if (!data.id) {
                    // Új tanév létrehozása
                    const res = await settingsService.createAcademicYear({
                        name,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    });
                } else {
                    // Meglévő tanév frissítése
                    const res = await settingsService.updateAcademicYear(
                        data.id,
                        {
                            name,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                        }
                    );
                }
            } catch (error) {
                console.error(
                    "Hiba történt a tanév létrehozása/frissítése során: ",
                    error
                );
                return {
                    success: false,
                    message:
                        "Hiba történt a tanév létrehozása/frissítése során!",
                };
            }

            revalidatePath("/admin/beallitasok/tanevek");
            return {
                success: true,
                message: "Sikeresen létrehozta a feladatcsoportot!",
            };
        }
    );
}
