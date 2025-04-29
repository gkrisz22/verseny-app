import { AcademicYear, Competition, Prisma } from "@prisma/client";
import { CrudService, Service } from "./service";
import { id } from "date-fns/locale";

export class CompetitionService extends Service implements CrudService<Competition> {
  create(data: Prisma.CompetitionCreateInput): Promise<Competition> {
    return this.db.competition.create({
      data,
    });
  }

  get(id: string) {
    return this.db.competition.findUnique({
      where: {
      id,
      },
      include: {
      participants: true,
      categories: {
        include: {
          _count: {
            select: {
              students: true,
            }
          },
          stages: {
            select: {
              id: true,
              startDate: true,
            },
            orderBy: {
              startDate: "asc",
            },
          }
        }
      }
      }
    });
  }

  getAll () {
    return this.db.competition.findMany();
  }


  update(id: string, data: Partial<Competition>) {
    return this.db.competition.update({
      where: {
        id,
      },
      data,
    }); 
  }

  getWhere(where: Prisma.CompetitionWhereInput, include?: Prisma.CompetitionInclude) {
    return this.db.competition.findMany({
      where,
      include,
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
    return this.db.competitionOrganization.findMany({
      where: {
        competitionId: id,
      },
      include: {
        organization: true,
      },
    });
  }

  hasOrganization(id: string, organizationId: string) {
    return this.db.competitionOrganization
      .findMany({
        where: {
          competitionId: id,
          organizationId,
        },
      })
      .then((participations) => participations.length > 0);
  }

  getCurrentCompetitions(academicYear:AcademicYear, onlyPublished = true) {
    return this.db.competition.findMany({
      where: {
        startDate: {
          gte: new Date(academicYear.startDate),
        },
        endDate: {
          lte: new Date(academicYear.endDate),
        },
        published: onlyPublished ? true : undefined,
      },
      select:
      {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        signUpStartDate: true,
        signUpEndDate: true,
        categories: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            participants: true,
          }
        },
        createdAt: true,
        updatedAt: true,
        shortDescription: true,
        description: true,
        published: true,
      },

    });
  }
}

const competitionService = new CompetitionService();
export default competitionService;