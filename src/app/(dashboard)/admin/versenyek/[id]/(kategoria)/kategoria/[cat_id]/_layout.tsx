  import React from "react";
import { Separator } from "@/components/ui/separator";
import { getCategoryById } from "@/app/_actions/competition.action";
import LocalKategoriaMenu from "./local-category-menu";

const VersenyKategoriaLayout = async ({
  params,
  children
}: {
  params: Promise<{ id: string, cat_id: string }>,
  children: React.ReactNode
}) => {
  const id = (await params).id;
  const cat_id = (await params).cat_id;
  const category = await getCategoryById(cat_id);

  if (!category) {
    return null; 
  }

  return (
    <div>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {category.name} kategória
        </h1>
        <p className='text-muted-foreground'>
          Kategória részletei és beállításai itt jelennek meg.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className="flex flex-col w-full space-y-4">
        <aside className="">
          <LocalKategoriaMenu competitionId={id} categoryId={cat_id} />
        </aside>
        <div >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VersenyKategoriaLayout;
