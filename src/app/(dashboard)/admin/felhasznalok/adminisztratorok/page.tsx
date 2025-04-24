import CardTitle from '@/app/(dashboard)/_components/common/card-title';
import { getOrganizations } from '@/app/_data/organization.data';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react'
import { getSuperAdmins } from '@/app/_data/user.data';
import RenderUsersTable from './render-table';


const AdminisztratorokPage = async () => {
    const admins = await getSuperAdmins();
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Adminisztrátorok
        </CardTitle>
        <CardDescription>
          Az alábbi felhasználók adminisztrátori jogosultsággal rendelkeznek.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RenderUsersTable users={admins || []} />
      </CardContent>
    </Card>
  )
}

export default AdminisztratorokPage