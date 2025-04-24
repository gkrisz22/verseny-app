import { getTaskGroups } from '@/app/_data/task.data'
import { Stage } from '@prisma/client'
import React from 'react'
import StudentEvaluator from './_components/ertekeles';

const EvaluatorLoader = async ({ stage }: { stage: Stage }) => {
    const taskGroups =  await getTaskGroups(stage.id);
  return (
    <div>
        <StudentEvaluator stage={stage} taskGroups={taskGroups} isFeluljavito={false} />
    </div>
  )
}

export default EvaluatorLoader