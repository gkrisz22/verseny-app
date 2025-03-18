import CardTitle from "@/app/(dashboard)/_components/common/card-title";
import StatCard from "@/app/(dashboard)/_components/common/stat-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStageById } from "@/actions/competition.action";
import { Calendar } from "lucide-react";
import React from "react";
import TaskFiles from "./_components/task-files";


const VersenyKatForduloPage = async ({
  params,
}: {
  params: Promise<{ stage_id: string }>;
}) => {
  const id = (await params).stage_id;
  const stage = await getStageById(id);

  if (!stage) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col space-y-6">

      <h1 className="text-2xl font-semibold">{stage.name} forduló</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} title="Verseny" value={stage.createdAt.toLocaleDateString()} />
        <StatCard icon={Calendar} title="Verseny" value={stage.createdAt.toLocaleDateString()} />

        <StatCard icon={Calendar} title="Verseny" value={stage.createdAt.toLocaleDateString()} />
        <StatCard icon={Calendar} title="Verseny" value={stage.createdAt.toLocaleDateString()} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 col-span-1">
          <CardHeader>
            <CardTitle>Statisztika</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Statisztikák</p>
          </CardContent>
        </Card>

        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feladat</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskFiles stageId={id} files={stage.files} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Felügyelők</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Felüljavítás, bírálás</p>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default VersenyKatForduloPage;
