import { Competition } from "@prisma/client";
import { CrudService, Service } from "./service";

export class CompetitionService extends Service implements CrudService<Competition> {
  create(data: Competition): Promise<Competition> {
    return this.db.competition.create({
      data,
    });
  }

  get(id: string) {
    return this.db.competition.findUnique({
      where: {
        id,
      },
    });
  }

  getAll () {
    return this.db.competition.findMany();
  }

  getActive() {
    return this.db.competition.findMany({
      where: {
        OR: [{
            status: "UPCOMING",
        },
        {
            status: "ONGOING",
        }]
      },
    });
  }

  update(id: string, data: Partial<Competition>) {
    return this.db.competition.update({
      where: {
        id,
      },
      data,
    }); 
  }

  delete(id: string) {
    return this.db.competition.delete({
      where: {
        id,
      },
    }).then(() => true).catch(() => false);
  }

  getOrganizations(id: string) {
    return this.db.organizationCompetitionParticipation.findMany({
      where: {
        competitionId: id,
      },
      include: {
        organization: true,
      }
    });
  }
}

const competitionService = new CompetitionService();
export default competitionService;