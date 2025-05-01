"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { Student } from "@prisma/client";

export const columns: ColumnDef<Student>[] = [

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Név" column={column} />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
          <span className="p-2">{data.name}</span>
      );
    }
  },
  {
    accessorKey: "uniqueId",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Azonosító" column={column} />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
          <span className="p-2">{data.uniqueId}</span>
      );
    }
  },
  {
    accessorKey: "grade",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader title="Osztály" column={column} />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
          <span className="p-2">{data.grade}.</span>
      );
    }
  },
];
