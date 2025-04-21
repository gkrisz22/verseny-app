import { Prisma, Task, TaskGroup, User } from "@prisma/client";
import { CrudService, Service } from "./service";

export class TaskService extends Service {
    constructor() {
        super();
    }

    async create(groupId:string, data: Partial<Task>) {
        return this.db.task.create({
            data: {
                ...data,
                groupId,
            }
        }); 
    }

    async createGroup(data: Partial<TaskGroup>) {
        return this.db.taskGroup.create({
            data: {
                stageId: data.stageId ?? "",
                title: data.title || "Új csoport",
            }
        });
    }

    async update(id: string, data: Partial<Task>) {
        return this.db.task.update({
            where: {
                id,
            },
            data,
        }); 
    }

    async updateGroup(id: string, data: Partial<TaskGroup>) {
        return this.db.taskGroup.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string) {
        const res = await this.db.task.delete({
            where: {
                id,
            }, 
        })

        return res ? true : false;
    }
    async deleteGroup(id: string) {
        
        const tasks = await this.db.task.deleteMany({
            where: {
                groupId: id,
            }
        });
        if (!tasks) {
            return false;
        }
        
        const res = await this.db.taskGroup.delete({
            where: {
                id,
            },
            include: {
                tasks: true,
            }
        });
        return res ? true : false;
    }

    async get(id: string) {
        return this.db.task.findUnique({
            where: {
                id,
            },
        });
    }

    async getGroup(id: string) {
        return this.db.taskGroup.findUnique({
            where: {
                id,
            },
        });
    }

    async getWhere(params: Prisma.TaskWhereInput) {
        return this.db.task.findMany({
            where: params,
        });
    }

    async getAll() {
        return this.db.task.findMany(); 
    }

    async getTaskGroups(stageId: string) {
        return this.db.taskGroup.findMany({
            where: {
                stageId,
            },
            include: {
                tasks: {
                    orderBy: {
                        createdAt: "asc",
                    },
                }
                
            },
            orderBy: {
                createdAt: "asc",
            }
        });
    }
}

const taskService = new TaskService();
export default taskService;

