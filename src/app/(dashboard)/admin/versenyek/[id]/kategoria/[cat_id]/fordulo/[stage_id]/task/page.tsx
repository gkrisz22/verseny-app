import { getStageById } from '@/actions/competition.action';
import React from 'react'
import EvaluatorBuilder from './_components/evaulator-builder';

const ForduloFeladatErtekelo = async ({
  params,
}: {
  params: Promise<{ stage_id: string }>;
}) => {
  const id = (await params).stage_id;
  const stage = await getStageById(id);

  if (!stage) {
    return <div>Loading...</div>;
  }
  return (
    <div>
        <h1 className="text-2xl font-semibold">{stage.name} forduló értékelő</h1>

        <EvaluatorBuilder stageId={id} />
    </div>
  )
}

export default ForduloFeladatErtekelo