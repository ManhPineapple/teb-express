"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAP_STATUS_CLASS_NAME } from "@/constants/packages";
import { Link } from "react-router-dom";
import { ShipmentItem } from "../ShipmentDetail";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type ShipmentsDetailTableProps = {
  item: ShipmentItem[];
};

const columns: ColumnDef<ShipmentItem>[] = [
  {
    accessorKey: "code",
    header: "TRACKING CODE",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {row.getValue("code") ? row.getValue("code") : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "order_number",
    header: "ORDER NUMBER",
    cell: ({ row }) => (
      <div className="capitalize text-[#006a5e] font-semibold">
        <Link
          to={{
            pathname: `/package/details/${row.original.id}`,
          }}
          className="text-no-underline"
        >
          {row.getValue("order_number")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "tracking_number",
    header: "Last mile tracking",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {row.getValue("tracking_number")
          ? row.getValue("tracking_number")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {(row.original.weight / 1000).toFixed(2)}kg
      </div>
    ),
  },
  {
    accessorKey: "length",
    header: "LxWxH (cm)",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {row.original.length}x{row.original.width}x{row.original.height}
      </div>
    ),
  },
  {
    accessorKey: "shipping_fee",
    header: () => <div className="">SHIPPING FEE</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("shipping_fee"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "extra_fee",
    header: () => <div className="">EXTRA FEE</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("extra_fee"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "status_string",
    header: "STATUS",
    cell: ({ row }) => (
      <span
        className={`text-base font-medium px-2 p-1 rounded-2xl capitalize ${
          row.original?.status_string
            ? MAP_STATUS_CLASS_NAME[row.original.status_string].className
            : "N/A"
        }`}
      >
        {row.original.status_string}
      </span>
    ),
  },
];

export function ShipmentsDetailTable(item: ShipmentsDetailTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const data = item.item;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="max-w-full">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
