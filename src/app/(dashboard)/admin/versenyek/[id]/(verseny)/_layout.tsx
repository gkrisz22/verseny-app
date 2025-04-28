import React, { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import LocalVersenyMenu from "./_components/local-competition-menu";
import { CompetitionProvider } from "./competition-context";
import { getCompetitionById } from "@/app/_data/competition.data";
import { Metadata } from "next";
import { VersenyTabs } from "./_components/verseny-tabs";

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
      <div className="flex flex-col w-full space-y-4">
      <VersenyTabs>
        <Suspense fallback={<div>Betöltés...</div>}>
          {children}
        </Suspense>
      </VersenyTabs>
      </div>
    </CompetitionProvider>
  );
};

export default VersenyTemplate;
