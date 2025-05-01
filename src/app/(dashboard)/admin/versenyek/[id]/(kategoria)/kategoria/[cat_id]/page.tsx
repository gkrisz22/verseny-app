import React from 'react'
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { getCategoryById, getEligibleGrades } from '@/app/_data/category.data';
import EligibilityForm from './beallitasok/eligibility-form';
import { EyeIcon, EyeOffIcon} from 'lucide-react';
import KategoriaMetadataForm from './beallitasok/metadata-form';
import { Badge } from '@/components/ui/badge';
import LocalCategoryMenu from './_components/local-category-menu';
import FordulokListingCards from '@/app/(dashboard)/_components/competition/fordulok-listing-cards';
import { DeleteCategoryDialog } from './_components/delete-category-dialog';
import CategoryStudentsTable from './_components/students/category-students-table';

const VersenyKategoriaDetailsPage = async ({ params }: { params: Promise<{ cat_id: string }>; }) => {
    const id = (await params).cat_id;
    const category = await getCategoryById(id);

    if (!category) {
        return <div>Nem található</div>
    }

    const eligibleGrades = await getEligibleGrades(id);

    return (
        <div className='flex flex-col gap-2'>
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <div className="w-fit">
                        {category.published ? <Badge variant='default'><EyeIcon className='size-4 mr-1' />  Nyilvános</Badge> : <Badge variant='destructive'><EyeOffIcon className='size-4 mr-1' /> Nem nyilvános</Badge>}
                    </div>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                        {category.name}
                    </h1>
                    <p className='text-muted-foreground text-sm'>
                        {category.eligibleGrades.length > 0 && category.eligibleGrades.join(', ') + ' osztály(ok)'}
                    </p>
                    <p className='text-muted-foreground'>
                        Kategória részletei és beállításai itt jelennek meg.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <DeleteCategoryDialog id={id} title={category.name} />
                    </div>
                </div>
            </div>

            <Separator className='mb-6' />
            <LocalCategoryMenu>
                <TabsContent value="beallitasok">
                    <div className="grid md:grid-cols-2 gap-6">
                        <KategoriaMetadataForm category={category} />
                        <EligibilityForm categoryId={id} eligibleGrades={eligibleGrades} />
                    </div>
                </TabsContent>
                <TabsContent value="fordulok">
                    <FordulokListingCards category={category} stages={
                        category.stages.map((stage) => {
                            return {
                                ...stage,
                                files: stage.files.map(sf => sf.file),
                                students: stage.students.map(s => ({ ...s, student: s.student }))
                            }
                        })
                    } isAdmin={true} /> 
                </TabsContent>
                <TabsContent value="diakok">
                    <CategoryStudentsTable categoryId={id} />
                </TabsContent>
                <TabsContent value="statisztika">
                    
                </TabsContent>
            </LocalCategoryMenu>
        </div>
    );

}

export default VersenyKategoriaDetailsPage