import { getStageById } from '@/app/_actions/competition.action';
import React from 'react'
import EvaluatorBuilder from './_components/evaulator-builder';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ForduloFeladatErtekelo = async ({
  params,
}: {
  params: Promise<{ id: string, stage_id: string }>;
}) => {
  const competitionId = (await params).id;
  const stage_id = (await params).stage_id;
  const stage = await getStageById(stage_id);

  if (!stage) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold">{stage.name} forduló értékelő</h1>
      <Link href={`/admin/versenyek/${competitionId}/kategoria/${stage.categoryId}`} className="text-sm text-primary">
        <Button variant="link">Vissza a kategóriahoz</Button></Link>
      <EvaluatorBuilder stageId={stage_id} />
    </div>
  )
}

export default ForduloFeladatErtekelo