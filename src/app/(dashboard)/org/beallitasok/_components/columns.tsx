"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GraduationCap, UserIcon, EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@prisma/client";
import HandleOrgUserDialog from "./invite-user-dialog";
import { UserStatusBadge } from "@/app/(dashboard)/_components/common/user-status-badge";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { roleLabels } from "@/app/(dashboard)/_components/common/role-labels";


export const columns: ColumnDef<User & {roles: string[]}>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableSortableHeader title="Név" column={column} />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableSortableHeader title="E-mail" column={column} />,
  },
  {
    accessorKey: "roles",
    header: ({ column }) => <DataTableSortableHeader title="Szerepkörök" column={column} />,
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[];
      const roleIcons: Record<string, React.JSX.Element> = {
        admin: <UserIcon className="h-4 w-4" />,
        teacher: <GraduationCap className="h-4 w-4" />,
      };

      
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="outline" className="flex items-center gap-1">
              {roleIcons[role as keyof typeof roleIcons]}
              <span className="hidden sm:inline">{roleLabels[role as keyof typeof roleLabels]}</span>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableSortableHeader title="Státusz" column={column} />,
    cell: ({ row }) => {
      const status = row.getValue("status") as "ACTIVE" | "INACTIVE" | "PENDING";
      return (
        <UserStatusBadge status={status} />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableSortableHeader title="Létrehozva" column={column} />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right">
          <HandleOrgUserDialog user={{id: user.id, name: user.name || "", email: user.email || "", roles: user.roles, status: user.status}} >
            <Button
              variant="ghost"
              size="icon"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          </HandleOrgUserDialog>
        </div>
      );
    },
  },
];