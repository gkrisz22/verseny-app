"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Stage } from "@prisma/client";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";


export const columns: ColumnDef<Stage>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="rounded"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="rounded"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableSortableHeader title="Név" column={column} />

  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Link href={`${data.categoryId}/fordulo/${data.id}`}>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Forduló részletei</span>
        </Button>   
        </Link>
      );
    },
  },
];
