import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns } from './columns'
import { getCompetitionParticipants } from '@/app/_data/competition.data';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CardTitle from '@/app/(dashboard)/_components/common/card-title';
import RenderResztvevokTable from './render-table';

const VersenyResztvevokPage = async ({ params }: { params: Promise<{ id: string }> }) => {

  const id = (await (params)).id;
  if (!id) {
    return null;
  }
  const participants = await getCompetitionParticipants(id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Résztvevő intézmények
        </CardTitle>
        <CardDescription>
          Az alábbi intézmények jelezték részvételi szándékukat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RenderResztvevokTable participants={participants.map(p => ({
          organization: p.organization.name,
          organizationId: p.organizationId,
          registrationDate: p.createdAt,
          status: p.status,
          contactEmail: p.organization.contactEmail || "",
        }))} />
      </CardContent>
    </Card>
  )
}

export default VersenyResztvevokPage