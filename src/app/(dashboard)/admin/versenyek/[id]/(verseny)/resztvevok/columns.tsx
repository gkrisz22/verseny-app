"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { CompetitionOrganization, Organization, ParticipationStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";


export interface Participant {
  organization: string;
  organizationId: string;
  registrationDate: Date;
  status: string;
  contactEmail: string;
}


export const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "organization",
    header: ({ column }) => <DataTableSortableHeader title="Név" column={column} />
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => <DataTableSortableHeader title="Regisztrált" column={column} />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{data.registrationDate.toLocaleString("hu-HU")}</span>
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
        <div className="flex items-center gap-2">
          <span><OrganizationStatusBadge status={data.status as ParticipationStatus} /></span>
        </div>
      );
    }
  },
];

function OrganizationStatusBadge({ status }: { status: ParticipationStatus }) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="default">
          <span className="text-xs">Jóváhagyva</span>
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <span className="text-xs">Elutasítva</span>
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="outline">
          <span className="text-xs">Függőben</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <span className="text-xs">Ismeretlen</span>
        </Badge>
      );
  }
}
