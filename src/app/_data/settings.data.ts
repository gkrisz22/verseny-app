"use server";
import settingsService from "@/services/settings.service";

export async function getAcademicYears() {
    const res = await settingsService.getAcademicYears();
    return res;
}

export async function getCurrentAcademicYear() {
    const res = await settingsService.getCurrentAcademicYear();
    return res;
}