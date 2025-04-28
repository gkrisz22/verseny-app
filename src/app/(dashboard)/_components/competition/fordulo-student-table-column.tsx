"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import DataTableSortableHeader from "@/app/(dashboard)/_components/common/data-table-sortable-header";
import { File, Student, StudentStageStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import StudentSolutionUploader from "./_components/solution-uploader";
import { MediaFile } from "@/types/media";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import ListFiles from "../common/list-files";
  
interface StudentStageColumnProps extends Student {
    studentStageId: string;
    files: File[];
    status: StudentStageStatus;
    stage: {
        evaluationStartDate: Date | null;
        evaluationEndDate: Date | null;
    };
    isAdmin?: boolean;
    totalPoints: number;
}

export const columns: ColumnDef<StudentStageColumnProps>[] = [
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
            return <span>{data.name}</span>;
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
            return <span>{data.uniqueId}</span>;
        },
    },
    {
        accessorKey: "grade",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Osztály" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.grade}.</span>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Állapot" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div>
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
            return <div>{points}</div>;
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return <DataTableSortableHeader title="Megoldás" column={column} />;
        },
        cell: ({ row }) => {
            const data = row.original;

            if(!data.isAdmin) {
                if(!data.stage.evaluationStartDate || !data.stage.evaluationEndDate || data.stage.evaluationStartDate > new Date()) {
                    return <span className="text-xs">Feltöltés hamarosan</span>;
                }

                if(data.stage.evaluationEndDate < new Date()) {
                    return <ShowFilesDialog studentStageId={data.studentStageId} files={data.files} />;
                }
            }
            if(!data.files || data.files.length === 0) {
                return <StudentSolutionUploader studentStageId={data.studentStageId} files={data.files} />;
            }
            return (
                <ShowFilesDialog
                    studentStageId={data.studentStageId}
                    files={data.files}
                />
            );
        },
    },
];


const ShowFilesDialog = ({ studentStageId, files }: { studentStageId: string; files: File[] }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm"><EyeIcon /> Megtekintés</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feltöltött fájlok</DialogTitle>
                    <DialogDescription>
                        Az alábbi fájlokat töltheti le, vagy új megoldást tölthet fel.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col gap-2">
                        <ListFiles files={files} />
                    </div>

                    {files.length === 0 && (
                        <p className="text-sm">Nincsenek feltöltött fájlok.</p>
                    )}

                    <StudentSolutionUploader studentStageId={studentStageId} files={files} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

  
function StudentStatusBadge({ status }: { status?: string }) {
    const badgeStyles = {
        submitted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
        not_submitted: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
        evaluated: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
        default: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
    };

    const label = {
        submitted: "Beadva",
        not_submitted: "Nincs beadva",
        evaluated: "Értékelve",
        default: "-",
    };

    const style = badgeStyles[status as keyof typeof badgeStyles] || badgeStyles.default;
    const text = label[status as keyof typeof label] || label.default;

    return (
        <Badge variant="outline" className={style}>
            {text}
        </Badge>
    );
}
