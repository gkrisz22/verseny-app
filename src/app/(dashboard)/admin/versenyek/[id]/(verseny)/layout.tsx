import React from "react";
import { Separator } from "@/components/ui/separator";
import LocalVersenyMenu from "./local-verseny-menu";
import { CompetitionProvider } from "./competition-context";
import { getCompetitionById } from "@/app/_data/competition.data";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Versenyek",
  description: "Versenyek részletei és beállításai",
};

const VersenyTemplate = async ({
  params,
  children
}: {
  params: Promise<{ id: string }>,
  children: React.ReactNode
}) => {
  const id = (await params).id;
  const competition = await getCompetitionById(id);

  if (!competition) {
    return null; 
  }

  return (
    <CompetitionProvider value={competition}>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {competition.title}
        </h1>
        <p className='text-muted-foreground'>
          Verseny részletei és beállításai itt jelennek meg.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className="grid md:grid-cols-6 gap-6">
        <aside className="md:col-span-1 col-span-1">
          <LocalVersenyMenu competitionId={id} />
        </aside>
        <div className="md:col-span-5 col-span-1">
          {children}
        </div>
      </div>
    </CompetitionProvider>
  );
};

export default VersenyTemplate;
