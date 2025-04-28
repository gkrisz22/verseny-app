import React from 'react'
import { DataTable } from '../common/data-table'
import { columns } from './fordulo-student-table-column'
import { getStageStudents } from '@/app/_data/stage.data'
import { getStageById } from '@/app/_actions/competition.action'

const ForduloStudentsTable = async ({stageId, isAdmin = false}: {stageId: string; isAdmin?: boolean}) => {
  const students = await getStageStudents(stageId)
  const stage = await getStageById(stageId);

  if(!stage) {
    return <div className='flex items-center'>
      A forduló nem található.
    </div>
  }

  if(!students) {
    return <div className='flex items-center'>
      Még nincsenek diákok hozzárendelve a fordulóhoz.
    </div>
  }

  

  return (
    <div>
        <DataTable
        data={students.map((s) => ({
          ...s,
          stage: {
            evaluationStartDate: stage.evaluationStartDate,
            evaluationEndDate: stage.evaluationEndDate,
          },
          isAdmin,
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
/*
data={students.map((s) => ({
          ...s.student,
          totalPoints: s.totalPoints,
          status: s.status,
        }))}*/