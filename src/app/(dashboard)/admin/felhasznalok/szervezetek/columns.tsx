"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { Organization } from "@prisma/client";
import regions from "@/lib/regions.json";


export const columns: ColumnDef<Organization & { _count: { members: number } }> [] = [
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
    accessorKey: "region",
    header: ({ column }) => <DataTableSortableHeader title="Megye" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      const regionName =
        regions.counties.find((county) => county.id === data.region)?.name ||
        regions.regions.find((region) => region.id === data.region)?.name ||
        "Ismeretlen";
      return (
        <div className="flex items-center gap-2 pl-2">
          <span>{regionName}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableSortableHeader title="Regisztrált" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{data.createdAt.toLocaleString("hu-HU")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableSortableHeader title="Státusz" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2 pl-2">
          <span>{data.status}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "_count.members",
    header: ({ column }) => <DataTableSortableHeader title="Tagok" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2 pl-2">
          <span>{data._count.members}</span>
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Link href={``}>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <Mail className="h-4 w-4" />
            <span className="">Értesítés</span>
        </Button>   
        </Link>
      );
    },
  },
];
