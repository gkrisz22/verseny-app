import { Prisma, Student } from "@prisma/client";
import { CrudService, Service } from "./service";

export class SettingsService extends Service {
    getCurrentAcademicYear() {
        return this.db.academicYear.findFirst({
            where: {
                endDate: {
                    gte: new Date()
                }
            },
            orderBy: {
                startDate: 'asc'
            },
            take: 1
        });
    }

    getAcademicYears() {
        return this.db.academicYear.findMany({
            orderBy: {
                startDate: 'desc'
            }
        });
    }

    createAcademicYear(data: Prisma.AcademicYearCreateInput) {
        return this.db.academicYear.create({
            data
        });
    }
    updateAcademicYear(id: string, data: Prisma.AcademicYearUpdateInput) {
        return this.db.academicYear.update({
            where: {
                id
            },
            data
        });
    }

    deleteAcademicYear(id: string) {
        return this.db.academicYear.delete({
            where: {
                id
            }
        });
    }

    getRolesByName(roles: string[]) {
        return this.db.role.findMany({
            where: {
                name: {
                    in: roles
                }
            }
        });
    }
    
}

const settingsService = new SettingsService();
export default settingsService;