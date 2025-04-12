import React from 'react'
import EligibilityForm from './eligibility-form';
import { getEligibleGrades } from '@/app/_data/category.data';

const KategoriaBeallitasokPage = async ({
  params
}: {
  params: Promise<{ id: string, cat_id: string }>
}) => {
  const competitionId = (await (params)).id;
  const categoryId = (await (params)).cat_id;

  if(!competitionId || !categoryId) {
    return null;
  }

  const eligibleGrades = await getEligibleGrades(categoryId);
  return (
    <div>
      <EligibilityForm categoryId={categoryId} eligibleGrades={eligibleGrades} />
    </div>
  )
}

export default KategoriaBeallitasokPage