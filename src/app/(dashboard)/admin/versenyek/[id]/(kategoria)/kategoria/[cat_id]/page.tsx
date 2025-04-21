import { getCategoryById } from '@/app/_actions/competition.action';
import React from 'react'
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FordulokListing from '@/app/(dashboard)/_components/competition/fordulok-listing';
import { getEligibleGrades } from '@/app/_data/category.data';
import EligibilityForm from './beallitasok/eligibility-form';
import { ChartColumnIcon, LayersIcon, Settings, SettingsIcon, UsersIcon } from 'lucide-react';

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
    
    const eligibleGrades = await getEligibleGrades(id);

    return (
      <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                {category.name}
            </h1>
            <p className='text-muted-foreground'>
                {category.eligibleGrades.join(', ')} osztályok
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
                    <EligibilityForm categoryId={id} eligibleGrades={eligibleGrades} />
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