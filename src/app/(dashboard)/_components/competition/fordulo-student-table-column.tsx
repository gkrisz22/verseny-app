"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { Student, StudentStageStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Student & { totalPoints: number, status: StudentStageStatus}>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                className="rounded"
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
            return <DataTableSortableHeader title="Név" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            return <span className="p-2">{data.name}</span>;
        },
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
            return <span className="p-2">{data.uniqueId}</span>;
        },
    },
    {
        accessorKey: "grade",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Osztály" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            return <span className="p-2">{data.grade}.</span>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Állapot" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            console.log(data);
            return (
                <div className="p-2">
                    <StudentStatusBadge status={data.status?.toLocaleLowerCase() || ""} />
                </div>
            );
        },
    },
    {
        accessorKey: "totalPoints",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Pontszám" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            const points = data.totalPoints > -1 ? data.totalPoints : 0;
            return <div className="p-2">{points}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const data = row.original;
            console.log(data);
            return (
                <>
                    <Button variant="outline" size="sm">
                      <EditIcon className="h-4 w-4 mr-1" />
                        Értékelés
                    </Button>
                </>
            );
        },
    },
];

function StudentStatusBadge({ status }: { status?: string }) {
    switch (status) {
        case "submitted":
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                >
                    Beadva
                </Badge>
            );
        case "not_submitted":
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                    Nincs beadva
                </Badge>
            );
        case "evaluated":
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    Értékelve
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200"
                >
                    -
                </Badge>
            );
    }
}
