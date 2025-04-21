import { Category, Competition } from "@prisma/client";
import { CrudService, Service } from "./service";

export class CategoryService extends Service implements CrudService<Category> {
    create(data: Category): Promise<Category> {
        return this.db.category.create({
            data,
        });
    }
    get(id: string) {
        return this.db.category.findUnique({
            where: {
                id,
            },
        });
    }
    getAll() {
        return this.db.category.findMany();
    }
    update(id: string, data: Partial<Category>) {
        return this.db.category.update({
            where: {
                id,
            },
            data,
        });
    }
    delete(id: string) {
        return this.db.category.delete({
            where: {
                id,
            },
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    getAllForCompetition(competitionId: string) {
        return this.db.category.findMany({
            where: {
                competitionId,
            },
        });
    }

    getEligibleGrades(categoryId: string) {
        return this.db.category.findUnique({
            where: {
                id: categoryId,
            },
            select: {
                eligibleGrades: true,
            }
        });
    }

    addStudentsToCategory(categoryId: string, studentIds: string[]) {
        return this.db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                students: {
                    create: studentIds.map((studentId) => ({
                        studentId,
                    })),
                },
            },
        });
    }
}

const categoryService = new CategoryService();
export default categoryService;