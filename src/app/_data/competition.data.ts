"use server";
import competitionService from "@/services/competition.service";
import settingsService from "@/services/settings.service";
import { AcademicYear } from "@prisma/client";
import { cache } from "react";

export const getCurrentCompetitions = cache(async ({ onlyPublished = true }: { onlyPublished?: boolean } = {}) => {
    const currentAcademicYear = await settingsService.getCurrentAcademicYear();
    if (!currentAcademicYear) {
        return [];
    }
    const res = await competitionService.getCurrentCompetitions(currentAcademicYear, onlyPublished);
    return res;
});


export const getPastCompetitions = cache(async () => {
    const currentAcademicYear = await settingsService.getCurrentAcademicYear();
    const res = await competitionService.getWhere({
        endDate: {
            lte: new Date(currentAcademicYear?.startDate || new Date()),
        },
    });
    return res;
});
 

export const getCompetitionById = cache(async (id:string) => {
    const res = await competitionService.get(id);
    return res || null;
});

export const getCompetitionParticipants = cache(async (competitionId: string) => {
    const res = await competitionService.getOrganizations(competitionId);
    return res || null;
});

export const getCompetitionsByAcademicYear = cache(async (academicYear:AcademicYear) => {
    const res = await competitionService.getWhere({
        startDate: {
            gte: new Date(academicYear.startDate),
        },
        endDate: {
            lte: new Date(academicYear.endDate),
        },
    });
    return res || null;
});