"use server"

import { actionHandler } from "@/lib/action.handler"
import { CreateStudentDTO, createStudentSchema } from "@/lib/definitions"
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
      const student = await studentService.create({
        name: data.name,
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
    catch (e) {
      console.log(e);
      return {
        success: false,
        message: e instanceof Error ? e.message : "Hiba történt a tanuló létrehozása közben",
        data: {
          name: data.name,
          grade: data.grade,
        }
      }
    }
    return {
      success: true,
      message: "Sikeresen létrehozta a tanulót",
      data: {
        name: data.name,
        grade: data.grade,
      }
    }

  });
}

export async function updateStudent(updatedStudent: Student): Promise<Student> {

  return updatedStudent
}

export async function deleteStudent(id: string): Promise<boolean> {
  return await studentService.delete(id)
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