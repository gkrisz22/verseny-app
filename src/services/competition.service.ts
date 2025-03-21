import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

export class CompetitionService {
  private static instance: CompetitionService;
  private db: PrismaClient;

  public static getInstance(prisma: PrismaClient): CompetitionService {
    if (!CompetitionService.instance) {
        CompetitionService.instance = new CompetitionService(prisma);
    }
    return CompetitionService.instance;
  }

  private constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  getAll () {
    return this.db.competition.findMany();
  }

  findOne(id: string) {
    return this.db.competition.findUnique({
      where: {
        id,
      },
    });
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
}

export default CompetitionService.getInstance(db);