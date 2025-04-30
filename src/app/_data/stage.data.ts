"use server";

import stageService from "@/services/stage.service";
import { getSessionOrganizationData } from "@/lib/utilities";
import { db } from "@/lib/db";

export async function getStageFiles(stageId: string)
{
    const res = await stageService.getStageFiles(stageId);
    if(res.length > 0) {
        return res.map(r => r.file)
    }
    return [];
}

export async function getStageStudents(stageId: string) {
    const res = await stageService.getStageStudents(stageId);
    return res?.students.map((s) => ({
        ...s.student,
        totalPoints: s.totalPoints,
        status: s.status,
        studentStageId: s.id,
        files: s.files.map((f) => f.file),
    }));
}

export async function getStageStudentsByOrganization(
    stageId: string,
) {
    const orgData = await getSessionOrganizationData();
    console.log("OrgData: ", orgData);
    if(!orgData) return [];
    const res = await stageService.getStageStudentsByOrganization(stageId, orgData.id);
    return res?.students.map((s) => ({
        ...s.student,
        totalPoints: s.totalPoints,
        status: s.status,
        studentStageId: s.id,
        files: s.files.map((f) => f.file),
    }));
}


export async function getStageById(id: string) {
    const res = await db.stage.findUnique({
        where: {
            id,
        },
        include: {
            files: {
                include: {
                    file: true,
                }
            },
            tasks: true,
            category: true
        }
    });

    return res;
}
