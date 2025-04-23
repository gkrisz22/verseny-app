"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCopyIcon, EditIcon, Trash2Icon} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { AcademicYear } from "@prisma/client";
import { toast } from "sonner";
import { ManageTanevDialog } from "./manage-tanev-dialog";

export const columns: ColumnDef<AcademicYear>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      console.log(data);
      return (
        <div className="flex items-center justify-center gap-2">
            <Button
                onClick={() => {
                    navigator.clipboard.writeText(data.id);
                    toast.success("Tanév azonosító másolva a vágólapra.");
                }}
                className="h-8 w-8 p-0"
                variant={"ghost"}
                title="Tanév azonosító másolása"
            >
                <span className="sr-only">Tanév azonosító másolása</span>
                <ClipboardCopyIcon />
            </Button>
            <ManageTanevDialog tanev={data}>
                <Button className="h-8 w-8 p-0" variant={"outline"} title="Tanév szerkesztése">
                    <span className="sr-only">Tanév szerkesztése</span>
                    <EditIcon />
                </Button>
            </ManageTanevDialog>
            <Button className="h-8 w-8 p-0" variant={"destructive"} title="Tanév törlése">
                <span className="sr-only">Tanév törlése</span>
                <Trash2Icon />
            </Button>
        </div>
      )
    },
  },
];
