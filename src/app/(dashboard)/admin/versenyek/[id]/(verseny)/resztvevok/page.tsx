import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns } from './columns'
import { getCompetitionParticipants } from '@/app/_data/competition.data';

const VersenyResztvevokPage = async ({ params }: { params: Promise<{ id: string }> }) => {

  const id = (await (params)).id;
  if(!id) {
    return null;
  }
  const participants = await getCompetitionParticipants(id);

  return (
    <DataTable columns={columns} data={participants.map((p) => p.organization)} searchParams={{ column: "name", placeholder: "Keresés kategória név alapján" }} />
  )
}

export default VersenyResztvevokPage