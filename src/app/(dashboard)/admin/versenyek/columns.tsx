"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Competition } from "./page";
import Link from "next/link";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";

export const columns: ColumnDef<Competition>[] = [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Név" column={column} />
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Kezdés" column={column} />
      );
    },
    cell: ({ row }) => new Date(row.original.startDate!).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) =><DataTableSortableHeader title="Vége" column={column} />,
    cell: ({ row }) => new Date(row.original.endDate!).toLocaleDateString(),
  },

  {
    accessorKey: "status",
    header: ({ column }) => <DataTableSortableHeader title="Státusz" column={column} />,
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <span
          className={`bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100 rounded-full px-2 py-1 uppercase text-[10px] font-bold`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      return <Actions data={data} />;
    },
  },
];

const Actions = ({ data }: { data: Competition }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Link href={`/admin/versenyek/${data.id}`}>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}