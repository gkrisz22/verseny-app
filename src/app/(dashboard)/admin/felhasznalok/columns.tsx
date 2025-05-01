"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { User } from "@prisma/client";
import { UserStatusBadge } from "../../_components/common/user-status-badge";

export const columns: ColumnDef<User & { _count: { memberships: number } }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableSortableHeader title="Név" column={column} />
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableSortableHeader title="E-mail" column={column} />
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
          <span><UserStatusBadge status={data.status} /></span>
        </div>
      );
    }
  },
  {
    accessorKey: "_count.memberships",
    header: ({ column }) => <DataTableSortableHeader title="Szervezetek" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2 pl-2">
          <span>{data._count.memberships}</span>
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Link href={`/admin/felhasznalok/adatlap/${data.id}`} className="flex items-center">
            <Button
            variant="outline"
            size="sm"
            className="flex items-center"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Részletek</span>
            </Button>   
        </Link>
      );
    },
  },
];
