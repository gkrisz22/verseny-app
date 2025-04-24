import React from 'react'
import StudentEvaluator from './_components/ertekeles';
import { getTaskGroups } from '@/app/_data/task.data';
import { getStageById } from '@/app/_actions/competition.action';

type Props = {
    params: Promise<{ stage_id: string }>
}

export default async function ErtekelesPage({ params }: Props) {
    const stage_id = (await params).stage_id;
    if (!stage_id) return null;
    const stage = await getStageById(stage_id);

    if (!stage) return null;
    const taskGroups = await getTaskGroups(stage_id);
    console.log(stage_id)
    return (
        <div>
            <StudentEvaluator stage={stage} taskGroups={taskGroups} isFeluljavito />
        </div>
    )
}
