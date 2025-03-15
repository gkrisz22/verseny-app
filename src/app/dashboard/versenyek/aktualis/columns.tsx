"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, MoreHorizontal, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Competition } from "./page";
import Link from "next/link";
import { deleteCompetition } from "@/actions/competition.action";
import { toast } from "sonner";
import { ConfirmDialog } from "../../_components/common/confirm-dialog";
import React from "react";

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
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
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
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kezdés
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.startDate!).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-fit mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Befejezés
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.endDate!).toLocaleDateString(),
  },

  {
    accessorKey: "status",
    header: "Státusz",
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <span
          className={`bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100 rounded-full px-2 py-1 uppercase text-[10px] font-bold`}
        >
          {status}
        </span>
      );
    },
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

  const [isOpen, setOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteCompetition(data.id);
      toast.success("Verseny törölve.");
    } catch (error) {
      console.error(error);
      toast.error("Hiba történt a verseny törlése közben.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={4} align="end">
          <DropdownMenuLabel className="p-0 font-normal">
            <DropdownMenuItem>Szerkesztés</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ConfirmDialog
                setOpen={setOpen}
                open={isOpen}
                title="Biztosan törölni szeretné a versenyt?"
                description="A művelet nem visszavonható. Ezzel törlődnek a versenyhez rendelt kategóriák (és fordulók), nevezések és eredmények is."
                confirmButton={
                  <Button variant="destructive" onClick={handleDelete}>
                    Törlés
                  </Button>
                }
              >
                <Trash2Icon className="h-4 w-4" />
                Törlés
              </ConfirmDialog>
            </DropdownMenuItem>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href={`/dashboard/versenyek/${data.id}`}>
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