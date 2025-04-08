"use server";
import competitionService from "@/services/competition.service";
import { cache } from "react";

export const getCurrentCompetitions = cache(async () => {
    const res =  await competitionService.getActive();
    return res;
 });
 

 export const getCompetitionById = cache(async (id:string) => {
    const res = await competitionService.get(id);
    return res || null;
});