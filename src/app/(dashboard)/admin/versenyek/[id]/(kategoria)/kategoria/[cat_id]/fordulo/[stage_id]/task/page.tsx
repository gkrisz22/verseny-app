import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTaskGroups } from '@/app/_data/task.data';
import EvaluationTable from './_components/evaluation/evaluation-table';
import { getStageById } from '@/app/_data/stage.data';

const ForduloFeladatErtekelo = async ({
  params,
}: {
  params: Promise<{ id: string, stage_id: string }>;
}) => {
  const competitionId = (await params).id;
  const stage_id = (await params).stage_id;
  const stage = await getStageById(stage_id);

  if (!stage) {
    return <div>Nem található a forduló</div>;
  }
  const taskGroups = await getTaskGroups(stage_id) || [];
  console.log("taskGroups", taskGroups);
  return (
    <div>
      <h1 className="text-2xl font-semibold">{stage.name} forduló értékelő</h1>
      <Link href={`/admin/versenyek/${competitionId}/kategoria/${stage.categoryId}`} className="text-sm text-primary">
        <Button variant="link">Vissza a kategóriahoz</Button></Link>
      <EvaluationTable stageId={stage_id} initialGroups={taskGroups} />
    </div>
  )
}

export default ForduloFeladatErtekelo