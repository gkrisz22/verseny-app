import { getCategoryById } from '@/app/_actions/competition.action';
import React from 'react'
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FordulokListing from '@/app/(dashboard)/_components/competition/fordulok-listing';
import { getEligibleGrades } from '@/app/_data/category.data';
import EligibilityForm from './beallitasok/eligibility-form';
import { ChartColumnIcon, EyeIcon, EyeOffIcon, LayersIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import KategoriaMetadataForm from './beallitasok/metadata-form';
import { Badge } from '@/components/ui/badge';

const VersenyKategoriaDetailsPage = async ({
    params,
}: {
    params: Promise<{ cat_id: string }>;
}) => {
    const id = (await params).cat_id;
    const category = await getCategoryById(id);

    if (!category) {
        return <div>Loading...</div>
    }

    const eligibleGrades = await getEligibleGrades(id);

    return (
        <div className='flex flex-col gap-2'>
            <div className="w-fit">
            {category.published ? <Badge variant='default'><EyeIcon className='size-4 mr-1' />  Nyilvános</Badge> : <Badge variant='destructive'><EyeOffIcon className='size-4 mr-1' /> Nem nyilvános</Badge>}
            </div>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                {category.name}
            </h1>
            <p className='text-muted-foreground'>
                {category.description}
            </p>
            <p className='text-muted-foreground text-sm'>
                {category.eligibleGrades.join(', ')}. osztályok számára
            </p>
            <Separator className='mb-6' />
            <Tabs defaultValue="fordulok" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="beallitasok"><SettingsIcon className='size-4 mr-1' /> Beállítások</TabsTrigger>
                    <TabsTrigger value="fordulok"><LayersIcon className='size-4 mr-1' /> Fordulók</TabsTrigger>
                    <TabsTrigger value="diakok"><UsersIcon className='size-4 mr-1' /> Diákok</TabsTrigger>
                    <TabsTrigger value="statisztika"><ChartColumnIcon className='size-4 mr-1' /> Statisztika</TabsTrigger>
                </TabsList>
                <TabsContent value="beallitasok">
                    <div className="grid md:grid-cols-2 gap-6">
                        <KategoriaMetadataForm category={category} />
                        <EligibilityForm categoryId={id} eligibleGrades={eligibleGrades} />
                    </div>
                </TabsContent>
                <TabsContent value="fordulok">
                    <FordulokListing category={category} stages={category.stages} isAdmin={true} students={category.students} />
                </TabsContent>
                <TabsContent value="diakok">
                    Diákok
                </TabsContent>
                <TabsContent value="statisztika">
                    Statisztika
                </TabsContent>
            </Tabs>
        </div>
    );

}

export default VersenyKategoriaDetailsPage