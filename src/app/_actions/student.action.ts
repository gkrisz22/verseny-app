"use server"

import type { Student } from "@/types/student"

const students: Student[] = [
  {
    id: "1",
    name: "Teszt Valaki",
    email: "teszt@asd.hu",
    grade: "8",
    addedAt: new Date(2025, 3, 15).toISOString(),
  },
  {
    id: "2",
    name: "Teszt Valaki",
    email: "teszt@asd.hu",
    grade: "11",
    addedAt: new Date(2025, 3, 15).toISOString(),
  },
]

export async function getStudents(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...students].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
}

export async function getStudent(id: string): Promise<Student | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return students.find((student) => student.id === id)
}

export async function createStudent(student: Student): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  students.push(student)
  return student
}

export async function updateStudent(updatedStudent: Student): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = students.findIndex((student) => student.id === updatedStudent.id)
  if (index === -1) {
    throw new Error(`Student with ID ${updatedStudent.id} not found`)
  }

  students[index] = updatedStudent
  return updatedStudent
}

export async function deleteStudent(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = students.findIndex((student) => student.id === id)
  if (index === -1) {
    throw new Error(`Student with ID ${id} not found`)
  }

  students.splice(index, 1)
}

