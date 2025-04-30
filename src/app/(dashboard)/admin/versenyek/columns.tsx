"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { Competition } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
        aria-label="Sor kiválasztása"
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
    cell: ({ row }) => row.original.startDate ? formatDate(row.original.startDate!) : "N/A"
  },
  {
    accessorKey: "endDate",
    header: ({ column }) =><DataTableSortableHeader title="Vége" column={column} />,
    cell: ({ row }) => row.original.endDate ? formatDate(row.original.endDate!) : "N/A"
  },
  {
    accessorKey: "published",
    header: ({ column }) => <DataTableSortableHeader title="Közzétett" column={column} />,
    cell: ({ row }) => {
      const published = row.original.published;
      return (
        <div>
          {published ? (
            <Badge variant="default">
              <span className="text-xs">Igen</span>
            </Badge>
          ) : (
            <Badge variant="destructive">
              <span className="text-xs">Nem</span>
            </Badge>
          )}
        </div>
      );
    }
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