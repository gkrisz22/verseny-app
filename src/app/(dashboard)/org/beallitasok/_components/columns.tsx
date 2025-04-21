"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, GraduationCap, Mail, MoreHorizontal, UserIcon, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@prisma/client";


export const columns: ColumnDef<User & {roles: string[]}>[] = [

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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Név
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          E-mail cím
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Szerepkörök",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[];
      const roleIcons: Record<string, React.JSX.Element> = {
        admin: <UserIcon className="h-4 w-4" />,
        contact: <Mail className="h-4 w-4" />,
        trusted: <UserCheck className="h-4 w-4" />,
        teacher: <GraduationCap className="h-4 w-4" />,
      };
      
      const roleLabels: Record<string, string> = {
        admin: "Adminisztrátor",
        contact: "Kapcsolattartó",
        trusted: "Trusted User",
        teacher: "Tanár",
      };

      console.log("User roles:", roles.map((role) => roleLabels[role as keyof typeof roleLabels]));
      
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
    header: "Státusz",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Csatlakozott
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
      
      const handleEditRoles = (user: User) => {
        console.log("Edit roles for:", user);
      };
      
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditRoles(user)}>Szerepkörváltás</DropdownMenuItem>
              <DropdownMenuItem>Profil megtekintése</DropdownMenuItem>
              <DropdownMenuItem>Jelszó visszaállítása</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Törlés</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];