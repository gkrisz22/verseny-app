import evalService from "@/services/evaluation.service"

export const getEvaluationsForStage = async (stageId: string) => {
    const res = await evalService.getWhere({
        stageStudent: {
            stageId
        }
    });

    return res;
}