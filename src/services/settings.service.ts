import { Prisma, Student } from "@prisma/client";
import { CrudService, Service } from "./service";

export class SettingsService extends Service {
    getCurrentAcademicYear() {
        return this.db.academicYear.findFirst({
            orderBy: {
                startDate: 'desc'
            },
            take: 1
        });
    }

    
}

const settingsService = new SettingsService();
export default settingsService;