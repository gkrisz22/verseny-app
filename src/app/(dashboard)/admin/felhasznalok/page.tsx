import { getNormalUsers } from '@/app/_data/user.data'
import React from 'react'
import { DataTable } from '../../_components/common/data-table';
import { columns } from './columns';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CardTitle from '../../_components/common/card-title';

const UsersPage = async () => {

  const users = await getNormalUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Felhasználók
        </CardTitle>
        <CardDescription className='pl-6'>
          Az összes NEM ADMIN felhasználó.
        </CardDescription>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            searchParams={{
              column: "name",
              placeholder: "Keresés név alapján",
            }}
          />
        </CardContent>
      </CardHeader>
    </Card>

  )
}

export default UsersPage