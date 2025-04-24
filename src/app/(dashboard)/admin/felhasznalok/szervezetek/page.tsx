import CardTitle from '@/app/(dashboard)/_components/common/card-title';
import { getOrganizations } from '@/app/_data/organization.data';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react'
import RenderSzervezetekTable from './render-table';

const SzervezetekPage = async () => {
    const organizations = await getOrganizations();
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Szervezetek
        </CardTitle>
        <CardDescription>
          Az alábbi intézmények regisztráltak a rendszerbe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RenderSzervezetekTable organizations={organizations || []} />
      </CardContent>
    </Card>
  )
}

export default SzervezetekPage