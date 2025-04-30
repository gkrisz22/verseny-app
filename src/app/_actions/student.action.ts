"use server"

import { actionHandler } from "@/lib/action.handler"
import { CreateStudentDTO, createStudentSchema } from "@/lib/definitions"
import { logger } from "@/lib/logger"
import { getSessionOrganizationData } from "@/lib/utilities"
import categoryService from "@/services/category.service"
import settingsService from "@/services/settings.service"
import studentService from "@/services/student.service"
import { ActionResponse } from "@/types/form/action-response"
import { Student } from "@prisma/client"
import { revalidatePath } from "next/cache"


export async function getStudents(): Promise<({
  academicYears: {
    grade: number;
  }[];
} & Student)[]> {
  const orgData = await getSessionOrganizationData();
  if (!orgData) {
    return [];
  }
  return await studentService.getOrganizationStudents(orgData.id);
}

export async function getStudent(id: string): Promise<Student | null> {
  return await studentService.get(id)
}

export async function createStudent(prevState: ActionResponse<CreateStudentDTO>, formData: FormData): Promise<ActionResponse<CreateStudentDTO>> {

  return actionHandler<CreateStudentDTO>(createStudentSchema, formData, async (data) => {

    try {
      const orgData = await getSessionOrganizationData();
      if (!orgData) {
        throw new Error("Hiba történt a tanuló létrehozása közben: Ön nem tagja egy szervezetnek sem!");
      }

      const schoolId = orgData.id;
      const currentAcademicYear = await settingsService.getCurrentAcademicYear();
      const currentYear = currentAcademicYear?.id as string;
      if (!currentYear) {
        throw new Error("Hiba történt a tanuló létrehozása közben: Nincs jelenlegi tanévre vonatkozó beállítás!");
      }

      if (data.uniqueId && !data.id) {
        const students = await studentService.getWhere({
          uniqueId: data.uniqueId,
        });
        if (students.length === 0) {
          throw new Error("Nem létezik diák a megadott azonosítóval!");
        }
        const school = students[0];
        if (school.schools.find((s) => s.schoolId === schoolId)) {
          throw new Error("A diák már tagja a szervezetnek!");
        }

        await studentService.update(school.id, {
          schools: {
            create: {
              schoolId,
            }
          }
        });
      }
      else {
        if (!data.name && !data.grade) {
          throw new Error("Nincs megadva név és osztály!");
        }
        if(!data.id)
        {
          const student = await studentService.create({
            name: data.name as string,
            schoolId,
            grade: parseInt(data.grade),
            gradeString: data.grade,
          });

          await studentService.update(student.id, {
            academicYears: {
              create: {
                academicYearId: currentYear,
                grade: parseInt(data.grade),
                gradeString: data.grade,
              }
            }
          });
        }
        else
        {
          const student = await studentService.get(data.id);
          if (!student) {
            throw new Error("Nem létezik diák a megadott azonosítóval!");
          }
          
          await studentService.update(data.id, {
            name: data.name as string,
            grade: parseInt(data.grade),
            academicYears: {
              updateMany: {
                where: {
                  academicYearId: currentYear,
                  studentId: data.id,
                },
                data: {
                  grade: parseInt(data.grade),
                }
              }
            }
          });
        }
      }
    }
    catch (e) {
      console.log(e);
      return {
        success: false,
        message: e instanceof Error ? e.message : "Hiba történt a tanuló" + (data.id? " frissítése" : " létrehozása") + " közben",
        data: {
          name: data.name,
          grade: data.grade,
        }
      }
    }
    return {
      success: true,
      message: data.id? "Diák sikeresen frissítve" : "Diák sikeresen létrehozva",
    }

  });
}

export async function updateStudent(updatedStudent: Student): Promise<Student> {

  return updatedStudent
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const orgData = await getSessionOrganizationData();
    if (!orgData) {
      throw new Error("Hiba történt a tanuló törlése közben: Ön nem tagja egy szervezetnek sem!");
    }
    const schoolId = orgData.id;
    const res = await studentService.update(id, {
      schools: {
        deleteMany: {
          schoolId: {
            equals: schoolId,
          }
        }
      }
    })
  }
  catch (e) {
    logger.error("[deleteStudent]" + (e instanceof Error ? e.message : "Hiba történt a tanuló törlése közben"));
    return false;
  }
  return true;
}



export async function signStudentsUpForCategory(categoryId: string, studentIds: string[]) {
  try {
    if (studentIds.length === 0) {
      throw new Error("Nincs kiválasztott diák!");
    }
    const orgData = await getSessionOrganizationData();
    if (!orgData) {
      throw new Error("Hiba történt a jelentkezés során: Ön nem tagja egy szervezetnek sem!");
    }
    const schoolId = orgData.id;
    const students = await studentService.getMany(studentIds);
    const category = await categoryService.get(categoryId);

    const ok: string[] = [];
    const categoryStudents = await categoryService.getStudentsInCategory(categoryId);

    for (const student of students) {
      if (category?.eligibleGrades.length === 0 || category?.eligibleGrades.includes(student.grade || 0)) {
        if (categoryStudents?.students.find((s) => s.studentId === student.id)) {
          continue;
        }
        ok.push(student.id);
      }
    }
    await categoryService.addStudentsToCategory(categoryId, schoolId, ok);

    revalidatePath(`/org/versenyek/${category?.competitionId}/aktualis/${categoryId}/reszletek`);
    return {
      success: true,
      message: "Sikeresen jelentkeztél a versenykategóriára",
      data: {
        students: ok,
        not_ok: studentIds.filter((id) => !ok.includes(id)),
        eligibleGrades: category?.eligibleGrades,
      }
    }
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Hiba történt a jelentkezés során",
    }
  }
}