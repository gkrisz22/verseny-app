"use server"

import { actionHandler } from "@/lib/action.handler"
import { CreateStudentDTO, createStudentSchema } from "@/lib/definitions"
import categoryService from "@/services/category.service"
import studentService from "@/services/student.service"
import { ActionResponse } from "@/types/form/action-response"
import { AcademicYear, Student } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


export async function getStudents(): Promise<({
  academicYears: {
    grade: number;
  }[];
} & Student)[]> {
  const cookieStore = await cookies();
  const schoolId = cookieStore.get("org")?.value as string;
  return await studentService.getOrganizationStudents(schoolId);
}

export async function getStudent(id: string): Promise<Student | null> {
  return await studentService.get(id)
}

export async function createStudent(prevState: ActionResponse<CreateStudentDTO>, formData: FormData): Promise<ActionResponse<CreateStudentDTO>> {

  return actionHandler<CreateStudentDTO>(createStudentSchema, formData, async (data) => {
    const cookieStore = await cookies();
    const schoolId = cookieStore.get("org")?.value as string;
    const currentYear = "cm9iuix5q0000bqndgxxnymvl";
    const student = await studentService.create({
      name: data.name,
      schoolId,
      grade: parseInt(data.grade),
      gradeString: data.grade,
    });

    const updated = await studentService.update(student.id, {
      academicYears: {
        create: {
          academicYearId: currentYear,
          grade: parseInt(data.grade),
          gradeString: data.grade,
        }
      }
    });

    if (!updated) {
      return {
        success: false,
        message: "Nem sikerült a tanuló létrehozása",
        data: {
          name: data.name,
          grade: data.grade,
        }
      }
    }

    return {
      success: true,
      message: "Tanuló sikeresen létrehozva",
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
    const cookieStore = await cookies();
    const schoolId = cookieStore.get("org")?.value as string;
    
    const students = await studentService.getMany(studentIds);
    console.log(students);

    const category = await categoryService.get(categoryId);
    const ok:string[] = [];
    for (const student of students) {
      if(category?.eligibleGrades.length === 0 || category?.eligibleGrades.includes(student.grade || 0)) {
        ok.push(student.id);
      }
    }
    await categoryService.addStudentsToCategory(categoryId, ok);

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
  }
  return {
    success: false,
    message: "Hiba történt a jelentkezés során",
  }
}