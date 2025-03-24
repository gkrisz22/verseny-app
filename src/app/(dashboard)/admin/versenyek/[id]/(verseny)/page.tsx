import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCategoriesByCompetitionId, getCompetitionById } from "@/app/_actions/competition.action";
import React from "react";
import { CreateCategoryDialog } from "./create-category-dialog";
import CardTitle from "../../../../_components/common/card-title";
import EditCompetitionCard from "./edit-competition-card";
import { DataTable } from "../../../../_components/common/data-table";
import { columns } from "./columns";
import LocalVersenyMenu from "./local-verseny-menu";
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
    return <div>Loading...</div>;
  }

  return (
    <Card className=" md:col-span-2 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle> {competition.title} - kategóriák</CardTitle>
        <CreateCategoryDialog competition={competition} />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={categories} searchParams={{ column: "name", placeholder: "Keresés kategória név alapján" }} />
      </CardContent>
    </Card>
  );
  /*
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <Card className=" md:col-span-2 col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle> {competition.title} - kategóriák</CardTitle>
            <CreateCategoryDialog competition={competition} />
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={categories} searchParams={{ column: "name", placeholder: "Keresés kategória név alapján" }} />
          </CardContent>
        </Card>
  
        {<div className="flex flex-col space-y-6">
          <EditCompetitionCard competition={competition} />
        </div>}
      </div>
    );*/
};

export default VersenyDetailsPage;
