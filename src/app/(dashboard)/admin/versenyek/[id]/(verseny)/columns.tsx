"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Category, Stage } from "@prisma/client";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";


export const columns: ColumnDef<Category & { stagesCount: number, studentsCount: number, currentStage: Stage | null}>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableSortableHeader title="Név" column={column} />

  },
  {
    accessorKey: "studentsCount",
    header: ({ column }) => <DataTableSortableHeader title="Diákok száma" column={column} />
  },
  {
    accessorKey: "stagesCount",
    header: ({ column }) => <DataTableSortableHeader title="Fordulók száma" column={column} />
  },
  
  {
    accessorKey: "currentStage.name",
    header: ({ column }) => <DataTableSortableHeader title="Aktuális forduló" column={column} />,
    cell: ({ row }) => row.original.currentStage? row.original.currentStage.name : "-"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Link href={`/admin/versenyek/${data.competitionId}/kategoria/${data.id}`}>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Tovább a kategóriára</span>
        </Button>   
        </Link>
      );
    },
  },
];
