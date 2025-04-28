import React from "react";
import { DataTable } from "../../_components/common/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateCompetitionDialog } from "./create-competition-dialog";
import CardTitle from "../../_components/common/card-title";
import { getCurrentCompetitions } from "@/app/_data/competition.data";


const VersenyekAktualisPage = async () => {
  const data = await getCurrentCompetitions({onlyPublished: false});
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Aktuális versenyek</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchParams={{
              column: "title",
              placeholder: "Keresés versenynév alapján",
            }}
            addButton={
              <CreateCompetitionDialog />
            }/>
        </CardContent>
      </Card>
    </div>
  );
};

export default VersenyekAktualisPage;
