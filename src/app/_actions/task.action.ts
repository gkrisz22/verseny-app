"use server";
import { actionHandler } from "@/lib/action.handler";
import { CreateTaskGroupDTO, createTaskGroupSchema } from "@/lib/definitions";
import taskService from "@/services/task.service";
import { ActionResponse } from "@/types/form/action-response";
import { Prisma, Task, TaskGroup } from "@prisma/client";

export async function createTaskGroup(
    prevState: ActionResponse<CreateTaskGroupDTO>,
    formData: FormData
): Promise<ActionResponse<CreateTaskGroupDTO>> {
    return actionHandler<CreateTaskGroupDTO>(
        createTaskGroupSchema,
        formData,
        async (data) => {
            const res = await taskService.createGroup(data);

            return {
                success: true,
                message: "Sikeresen létrehozta a feladatcsoportot!",
                data: {
                    id: res.id,
                    title: res.title,
                    stageId: res.stageId,
                },
            };
        }
    );
}

export async function updateTaskGroup(
    groupId: string,
    data: Partial<TaskGroup>
) {
    return await taskService.updateGroup(groupId, data);
}

export async function deleteTaskGroup(groupId: string) {
    return await taskService.deleteGroup(groupId);
}

export async function saveTasks(
    data: (Partial<TaskGroup> & { tasks: Partial<Task>[] })[]
): Promise<TaskGroup[]> {
    try {
        if (!data || data.length === 0) {
            throw new Error("Nincs egyetlen feladatcsoport sem!");
        }

        const stageId = data[0].stageId;
        if (!stageId) throw new Error("Forduló azonosítója nem található!");

        for (const group of data) {
            if (!group.id) continue;
            console.log("Feladatcsoport feldolgozása folyamatban: ", group.id);

            const existingTasks = await taskService.getWhere({
                groupId: group.id,
            });
            const existingTaskMap = new Map(
                existingTasks.map((t) => [t.id, t])
            );
            const incomingTasks = group.tasks ?? [];
            const incomingTaskIds = new Set(
                incomingTasks.map((t) => t.id).filter(Boolean)
            );

            const tempIdToRealId = new Map<string, string>(); // UUID (client) -> DB cuid

            // 1. Új feladatok létrehozása vagy meglévők frissítése
            for (const task of incomingTasks) {
                const baseData = {
                    title: task.title ?? "Feladat",
                    type: task.type ?? "NUMERIC",
                    points: task.points ?? 0,
                    groupId: group.id,
                };

                if (!task.id || !existingTaskMap.has(task.id)) {
                    const created = await taskService.create(
                        group.id,
                        baseData
                    );
                    if (task.id) tempIdToRealId.set(task.id, created.id); // map UUID
                    task.id = created.id;
                } else {
                    await taskService.update(task.id, baseData);
                }
            }

            // 2. Szülő ID-k frissítése
            for (const task of incomingTasks) {
                if (task.parentId) {
                    const realId = tempIdToRealId.get(task.id!) || task.id!;
                    const realParentId =
                        tempIdToRealId.get(task.parentId) ?? task.parentId;

                    await taskService.update(realId, {
                        parentId: realParentId,
                    });
                }
            }

            // 3. Törlés
            const tasksToDelete = existingTasks.filter(
                (t) => !incomingTaskIds.has(t.id)
            );
            for (const task of tasksToDelete) {
                await taskService.delete(task.id);
            }
        }

        console.log("Feladatok sikeresen mentve!");
        const res = await taskService.getTaskGroups(stageId);
        return res;
    } catch (error) {
        console.error("Nem sikerült a feladatok mentése: ", error);
        return [];
    }
}
