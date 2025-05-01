import React from 'react'
import { getTaskGroups } from '@/app/_data/task.data';
import { getStageById, getStageStudentsByOrganization } from '@/app/_data/stage.data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getEvaluationsForStage } from '@/app/_data/evaluations.data';
import StudentEvaluator from '@/app/(dashboard)/_components/ertekeles/_components/evaluator';

type Props = {
    params: Promise<{ stage_id: string }>
}

export default async function OrgErtekelesPage({ params }: Props) {
    const stage_id = (await params).stage_id;
    if (!stage_id) return null;
    const stage = await getStageById(stage_id);

    if (!stage) return <>
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Forduló nem található
                </h1>
            </div>
        </div>
    </>
    const taskGroups = await getTaskGroups(stage_id);
    const students = await getStageStudentsByOrganization(stage_id);

    if (!taskGroups || taskGroups.length === 0) return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-medium'>A fordulóhoz nem tartozik egyetlen feladat sem.</h1>
            <Link href={`/org/versenyek/${stage.category.competitionId}/reszletek/${stage.categoryId}/fordulo/${stage.id}`}>
                <Button variant={"link"}>
                    <ArrowLeft className='h-5 w-5 mr-1' />
                    Vissza a fordulóhoz
                </Button>
            </Link>
        </div>
    )

    if (!students || students.length === 0) return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-medium'>A fordulóhoz nincs egyetlen diák sem rendelve az Ön szervezetéből.</h1>
            <Link href={`/org/versenyek/${stage.category.competitionId}/reszletek/${stage.categoryId}/fordulo/${stage.id}`}>
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
