import taskService from "@/services/task.service";

export async function getTaskGroups(stageId: string) {
    const taskGroups = await taskService.getTaskGroups(stageId);
    return taskGroups;
}