import OrgDataManagement from '@/app/(dashboard)/org/beallitasok/_components/org-data-management'
import { getOrganizationData } from '@/app/_data/organization.data';
import React from 'react'

const SzervezetDetailsPage = async ({params} : {params: Promise<{id: string}>}) => {
  const { id } = await params;
    const organization = await getOrganizationData(id);

    if(!organization) {
        return (
            <div className="flex items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold">Szervezet nem található</h1>
            </div>
        )
    }

  return (
    <div>
        <OrgDataManagement organization={organization} isAdmin={true} />
    </div>
  )
}

export default SzervezetDetailsPage