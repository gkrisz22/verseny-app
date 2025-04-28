import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCategoriesByCompetitionId } from "@/app/_actions/competition.action";
import React, { Suspense } from "react";
import { getCompetitionById } from "@/app/_data/competition.data";
import CardTitle from "@/app/(dashboard)/_components/common/card-title";
import { CreateCategoryDialog } from "./create-category-dialog";
import { DataTable } from "@/app/(dashboard)/_components/common/data-table";
import { columns } from "./columns";
import { TabsContent } from "@/components/ui/tabs";
import VersenyResztvevokPage from "./resztvevok/verseny-resztvevok";
import CompetitionContentForm from "./tartalom/competition-content-form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import VersenyBeallitasokForm from "./_components/verseny-beallitasok-form";
import LocalCompetitionMenu from "./_components/local-competition-menu";
import { DeleteCompetitionDialog } from "./_components/delete-competition-dialog";
import { ShowCompetitionBadge } from "@/app/(dashboard)/_components/competition/show-competition-badge";


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

    return (
        <>
            <div className='space-y-0.5 flex justify-between items-start'>
                <div className="flex flex-col gap-2">
                    <div className="w-fit">
                        {competition.published ? <Badge variant='default'><EyeIcon className='size-4 mr-1' />  Nyilvános</Badge> : <Badge variant='destructive'><EyeOffIcon className='size-4 mr-1' /> Nem nyilvános</Badge>}
                    </div>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                        {competition.title}
                    </h1>
                    <p className='text-muted-foreground'>
                        Verseny részletei és beállításai itt jelennek meg.
                    </p>
                    <ShowCompetitionBadge
                        competition={competition}
                    />
                </div>
                <DeleteCompetitionDialog id={id} title={competition.title} />
            </div>
            <Separator className='my-4 lg:my-6' />

            <LocalCompetitionMenu>
                <Suspense fallback={<div>Betöltés...</div>}>

                    <TabsContent value="beallitasok">
                        <VersenyBeallitasokForm competition={competition} />
                    </TabsContent>
                    <TabsContent value="resztvevok">
                        <VersenyResztvevokPage id={id} />
                    </TabsContent>
                    <TabsContent value="kategoriak">
                        <Card className=" md:col-span-2 col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle> {competition.title} - kategóriák</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={columns} data={categories} searchParams={{ column: "name", placeholder: "Keresés kategória név alapján" }} addButton={<CreateCategoryDialog key={"create_category_key"} competition={competition} />} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tartalom">
                        <CompetitionContentForm competition={competition} />
                    </TabsContent>
                </Suspense>
            </LocalCompetitionMenu>

        </>
    );
};

export default VersenyDetailsPage;
