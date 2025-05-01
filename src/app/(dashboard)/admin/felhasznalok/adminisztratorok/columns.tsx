"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<User> [] = [
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
          <span>{getStatusBadge(data.status)}</span>
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


const getStatusBadge = (status: "ACTIVE" | "INACTIVE" | "PENDING") => {
    switch (status) {
        case "ACTIVE":
            return <Badge variant="default">Aktív</Badge>
        case "INACTIVE":
            return <Badge variant="destructive">Inaktív</Badge>
        case "PENDING":
            return <Badge variant="secondary">Függőben</Badge>
        default:
            return <Badge variant="outline">Ismeretlen</Badge>
    }
}