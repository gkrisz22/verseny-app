import React from 'react'
import StudentEvaluator from '../../../../../../../../../_components/ertekeles/_components/evaluator';
import { getTaskGroups } from '@/app/_data/task.data';
import { getStageById, getStageStudents } from '@/app/_data/stage.data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getEvaluationsForStage } from '@/app/_data/evaluations.data';

type Props = {
    params: Promise<{ stage_id: string }>
}

export default async function ErtekelesPage({ params }: Props) {
    const stage_id = (await params).stage_id;
    if (!stage_id) return null;
    const stage = await getStageById(stage_id);

    if (!stage) return null;
    const taskGroups = await getTaskGroups(stage_id);

    const students = await getStageStudents(stage_id);

    if (!taskGroups || taskGroups.length === 0) return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-medium'>A fordulóhoz még nem tartozik egyetlen feladat sem.</h1>
            <Link href={`/admin/versenyek/${stage.category.competitionId}/kategoria/${stage.categoryId}/fordulo/${stage.id}`}>
                <Button variant={"link"}>
                    <ArrowLeft className='h-5 w-5 mr-1' />
                    Vissza a fordulóhoz
                </Button>
            </Link>
        </div>
    )

    if (!students || students.length === 0) return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-medium'>A fordulóhoz nincs egyetlen diák sem rendelve.</h1>
            <Link href={`/admin/versenyek/${stage.category.competitionId}/kategoria/${stage.categoryId}/fordulo/${stage.id}`}>
                <Button variant={"link"}>
                    <ArrowLeft className='h-5 w-5 mr-1' />
                    Vissza a fordulóhoz
                </Button>
            </Link>
        </div>
    )

    const evaluations = await getEvaluationsForStage(stage_id);

    return (
        <div>
            <StudentEvaluator 
                stage={stage} 
                taskGroups={taskGroups} 
                students={students} 
                initialEvaluations={evaluations.map((e) => ({ 
                    taskId: e.taskId, 
                    studentId: e.stageStudentId, 
                    value: e.points
                }))} 
            />
        </div>
    )
}
