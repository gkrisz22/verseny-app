import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCategoriesByCompetitionId } from "@/app/_actions/competition.action";
import React, { Suspense } from "react";
import { getCompetitionById } from "@/app/_data/competition.data";
import CardTitle from "@/app/(dashboard)/_components/common/card-title";
import { CreateCategoryDialog } from "./create-category-dialog";
import { DataTable } from "@/app/(dashboard)/_components/common/data-table";
import { columns } from "./columns";
import { TabsContent } from "@/components/ui/tabs";
import { VersenyTabs } from "./_components/verseny-tabs";
import VersenyResztvevokPage from "./resztvevok/verseny-resztvevok";
import HataridoForm from "./hataridok/hatarido-form";
import CompetitionContentForm from "./tartalom/competition-content-form";
import { Separator } from "@/components/ui/separator";

const VersenyDetailsPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const id = (await params).id;

    const competition = await getCompetitionById(id);
    const categories = await getCategoriesByCompetitionId(id);

    if (!competition) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Verseny nem található</h1>
            </div>
        );
    }

    console.log("Szerver")

    return (
        <>
            <div className='space-y-0.5'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    {competition.title}
                </h1>
                <p className='text-muted-foreground'>
                    Verseny részletei és beállításai itt jelennek meg.
                </p>
            </div>
            <Separator className='my-4 lg:my-6' />
            <div className="flex flex-col w-full space-y-4"></div>
            <VersenyTabs>
                <Suspense fallback={<div>Betöltés...</div>}>
                
                <TabsContent value="hataridok">
                    <HataridoForm competition={competition} />
                </TabsContent>
                <TabsContent value="resztvevok">
                    <VersenyResztvevokPage id={id} />
                </TabsContent>
                <TabsContent value="kategoriak">
                    <Card className=" md:col-span-2 col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle> {competition.title} - kategóriák</CardTitle>
                            <CreateCategoryDialog competition={competition} />
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={categories} searchParams={{ column: "name", placeholder: "Keresés kategória név alapján" }} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="tartalom">
                    <CompetitionContentForm competition={competition} />
                </TabsContent>
                </Suspense>
            </VersenyTabs>

        </>
    );
};

export default VersenyDetailsPage;
