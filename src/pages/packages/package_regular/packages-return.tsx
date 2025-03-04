("use client");
import { Button } from "@/components/ui/button";
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

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPackagesReturn } from "@/services/packages";
import { useState } from "react";
import { Link } from "react-router-dom";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type PackageReturn = {
  package_id: number;
  alert: number;
  order_number: string;
  label: string;
  tracking_number: string;
  package_return_id: string;
  hub_imported_at: string;
  description: string;
  full_name: string;
  package_code: string;
  shipping_fee: number;
  reship_extra_fee: number;
  returned_at: null;
  request_reship: boolean;
};

const columns: ColumnDef<PackageReturn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order_number",
    header: "ORDER NO.",
    cell: ({ row }) => (
      <div className="capitalize text-[#006a5e] font-bold">
        <Link
          to={{
            pathname: `/package/details/${row.original.package_id}`,
          }}
          className="text-no-underline"
        >
          {row.getValue("order_number")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "package_code",
    header: "TRACKING CODE",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("package_code") ? (
          <Link
            to={{
              pathname: `/package/details/${row.original.package_id}`,
            }}
            className="text-no-underline"
          >
            {row.getValue("package_code")}
          </Link>
        ) : (
          "N/A"
        )}
      </div>
    ),
  },
  {
    accessorKey: "tracking_number",
    header: "LAST MILE TRACKING",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("tracking_number")
          ? row.getValue("tracking_number")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("description") ? row.getValue("description") : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "request_reship",
    header: "",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.request_reship && (
          <Button className="bg-[#dfe3e8] text-[#a9e0de] font-bold" disabled>
            Processing
          </Button>
        )}
        {!row.original.request_reship && (
          <Button className="bg-[#00978c] text-[#fff] font-bold">Reship</Button>
        )}
      </div>
    ),
  },
];

export function PackageReturn() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<PackageReturn[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const packages = await fetchPackagesReturn();
        setData(packages.packages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchData();
  }, []);

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
    <div className="max-w-full mx-5">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tracking code or order number..."
          value={
            (table.getColumn("order_number")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("order_number")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
