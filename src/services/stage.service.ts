import { Service } from "./service";

export class StageService extends Service {

  findStageById(id: string) {
    return this.db.stage.findUnique({
      where: {
        id,
      },
    });
  }

  getStageFiles(stageId: string) {
    return this.db.file.findMany({
      where: {
        stageId,
      },
    });
  }

  assignFilesToStage(stageId: string, fileIds: string[]) {
    return this.db.file.updateMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      data: {
        stageId,
      },
    });
  }

  removeFiles(stageId: string, fileIds: string[]) {
    return this.db.file.updateMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      data: {
        stageId: null,
      },
    });
  }
}

const stageService = new StageService();
export default stageService;