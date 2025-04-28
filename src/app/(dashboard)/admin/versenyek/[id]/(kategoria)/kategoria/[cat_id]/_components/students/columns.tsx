"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { Organization, Student } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Student & { joinedAt: Date; organization: Partial<Organization>}>[] = [
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
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Név" column={column} />
      );
    },
  },
  {
    accessorKey: "organization.name",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Iskola" column={column} />
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Jelentkeztetve" column={column} />
      );
    },
    cell: ({ row }) => row.original.joinedAt ? formatDate(row.original.joinedAt!) : "N/A"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      return <Actions data={data} />;
    },
  },
];

const Actions = ({ data }: { data: (Student & { joinedAt: Date; organization: Partial<Organization>}) }) => {
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