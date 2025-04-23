"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Search, Sheet } from "lucide-react";

import * as XLSX from "xlsx";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchParams?: {
    column: string;
    placeholder: string;
  },
  selectedRows?: RowSelectionState;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
  addButton?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchParams,
  selectedRows,
  onRowSelectionChange,
  getRowId,
  addButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const rowSelection = selectedRows !== undefined ? selectedRows : internalRowSelection;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      if (onRowSelectionChange) {
        onRowSelectionChange(newSelection);
      } else {
        setInternalRowSelection(newSelection);
      }
    },
    getRowId, state: {
      sorting,
      columnFilters,
      rowSelection
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4 w-full">
        {searchParams && <div className="relative flex items-center">
          <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 size-4" />
          <Input
            placeholder={searchParams.placeholder}
            value={(table.getColumn(searchParams.column)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchParams.column)?.setFilterValue(event.target.value)
            }
            className="max-w-sm pl-8 w-full min-w-[250px]"
          /></div>}

        <div className="flex items-center space-x-2">
          <ExportToXLSX data={table.getRowModel().rows.map(row => row.original)} />
          {addButton}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nincs találat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Előző
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Következő
        </Button>
      </div>
    </div>
  );
}
interface ExportToXLSXProps<TData> {
  data: TData[];
}

const ExportToXLSX = <TData,>({ data }: ExportToXLSXProps<TData>) => {
  const [loading, setLoading] = React.useState(false);

  const handleExport = async () => {
    if (!data || !data.length) return;
    setLoading(true);

    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "export.xlsx");
    } catch (error) {
      console.error(error);
      toast.error("Hiba történt az exportálás során.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Button size="sm" variant="secondary" className="ml-auto" onClick={handleExport} disabled={loading || !data.length}>
        <Sheet className="size-4" />
        <span>Export</span>
      </Button>
    </div>
  );
};