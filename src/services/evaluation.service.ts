import { Prisma } from "@prisma/client";
import { Service } from "./service";

export class EvaluationService extends Service {
    isEvaluated = async (taskId: string, studentId: string) => {
        const res = await this.db.evaluation.findFirst({
            where: {
                taskId,
                stageStudentId: studentId,
            },
        });
        return res !== null;
    };

    get(id: string) {
        return this.db.evaluation.findUnique({
            where: {
                id,
            },
        });
    }

    getByStudentId(studentId: string) {
        return this.db.evaluation.findMany({
            where: {
                stageStudentId: studentId,
            },
        });
    }

    getWhere(where: Prisma.EvaluationWhereInput) {
        return this.db.evaluation.findMany({
            where,
        });
    }

    create(pivot: {taskId:string, studentId: string, evaluatorId: string, parentEvaluationId?:string},points:number) {
        return this.db.evaluation.create({
            data: {
                points,
                task: { connect: { id: pivot.taskId } },
                stageStudent: { connect: { id: pivot.studentId } },
                evaluator: { connect: { id: pivot.evaluatorId } },
            },
        });
    }

    update(id: string, evaluatorId: string, points:number) {
        return this.db.evaluation.update({
            data: {
                points,
                evaluator: { connect: { id: evaluatorId } },
            },
            where: {
                id,
            }
        })   
    }

    getTotalPointsByStudentId(studentId: string) {
        return this.db.evaluation.groupBy({
            by: ['stageStudentId'],
            where: {
                stageStudentId: studentId,
            },
            _sum: {
                points: true,
            },
        })
    }
}

const evalService = new EvaluationService();
export default evalService;
