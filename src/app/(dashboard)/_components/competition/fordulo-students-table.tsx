import { Student, StudentCategory, StudentStage } from '@prisma/client'
import React from 'react'
import { DataTable } from '../common/data-table'
import { columns } from './fordulo-student-table-column'

const ForduloStudentsTable = ({students}: {students: ({ student: Student } & StudentStage)[]}) => {
  console.log(students)
  return (
    <div>
        <DataTable
        data={students.map((s) => ({
          ...s.student,
          totalPoints: s.totalPoints,
          status: s.status,
        }))}
        columns={columns}
        searchParams={
            {
                column: "name",
                placeholder: "Keresés név alapján",
            }
        } />
    </div>
  )
}

export default ForduloStudentsTable