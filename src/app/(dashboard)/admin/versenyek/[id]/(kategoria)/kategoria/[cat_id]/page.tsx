import CardTitle from '@/app/(dashboard)/_components/common/card-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getCategoryById } from '@/app/_actions/competition.action';
import Link from 'next/link';
import React from 'react'
import { CreateStageDialog } from './create-stage-dialog';
import { DataTable } from '@/app/(dashboard)/_components/common/data-table';
import { columns } from './columns';

const VersenyKategoriaDetailsPage = async ({
    params,
  }: {
    params: Promise<{ cat_id: string }>;
  }) => {
    const id =  (await params).cat_id;
    const category = await getCategoryById(id);

    if(!category){
        return <div>Loading...</div>
    }

    return (
        <div>
          <Link href={`/admin/versenyek/${category.competitionId}/`}>
            <Button variant="link" size="sm">
              Vissza a kategóriákhoz
            </Button>
          </Link>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle> {category.name} - fordulók</CardTitle>
                <CreateStageDialog category={category} />
              </CardHeader>

              <CardContent>
                <DataTable columns={columns} data={category.stages} searchParams={{ column: "name", placeholder: "Keresés forduló név alapján" }} />
              </CardContent>
            </Card>
        </div>
    );

}

export default VersenyKategoriaDetailsPage