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
import {
  CLAIM_ADMIN_REPLY,
  CLAIM_STATUS_PROCESSED,
  CLAIM_STATUS_TEXT,
} from "@/constants/claim";
import { fetchClaim } from "@/services/claim";
import { format } from "date-fns";
import { MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export type Claim = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: number;
  object_id: number;
  attachment: null;
  status: number;
  status_rep: number;
  type: number;
  amount: number;
  is_rated: boolean;
  package_code: string;
  user: null;
};

export const columns: ColumnDef<Claim>[] = [
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
    accessorKey: "id",
    header: "Claim code",
    cell: ({ row }) => (
      <Link to={`/claim/detail/${row.original.id}`} className="flex gap-2">
        <div className="capitalize text-[#006a5e] font-medium">
          {row.getValue("id")}
        </div>
        {row.original.status_rep == CLAIM_ADMIN_REPLY &&
          row.original.status != CLAIM_STATUS_PROCESSED && (
            <MessageCircleMore className="h-5 w-5" />
          )}
      </Link>
    ),
  },
  {
    accessorKey: "package_code",
    header: "Tracking code",
    cell: ({ row }) => (
      <Link to={`/package/details/${row.original.object_id}`}>
        <div className="capitalize text-[#006a5e] font-medium">
          {row.getValue("package_code")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Create date",
    cell: ({ row }) => (
      <div className="capitalize">
        {format(new Date(row.original.created_at), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Update date",
    cell: ({ row }) => (
      <div className="capitalize">
        {format(new Date(row.original.updated_at), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`text-base font-medium px-2 p-1 rounded-2xl capitalize ${
          row.original?.status
            ? CLAIM_STATUS_TEXT[row.original.status].className
            : "N/A"
        }`}
      >
        {CLAIM_STATUS_TEXT[row.original.status].text}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Result",
    cell: () => <div className="capitalize"></div>,
  },
];

export function ListClaimTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] = useState<Claim[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const claims = await fetchClaim();
      setData(claims.tickets);
    };

    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (selectedTab === "All") {
      return data;
    }
    return data.filter(
      (claim) => CLAIM_STATUS_TEXT[claim.status]?.text === selectedTab
    );
  }, [data, selectedTab]);

  const table = useReactTable({
    data: filteredData,
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
          placeholder="Filter tracking code..."
          value={
            (table.getColumn("package_code")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("package_code")?.setFilterValue(event.target.value)
          }
          className="max-w-full h-[44px]"
        />
      </div>
      <div className="tabs mb-3 border-b">
        {["All", "Pending", "Processing", "Processed"].map((tab) => (
          <button
            key={tab}
            className={`tab tab-bordered mx-3 capitalize${
              selectedTab === tab
                ? "tab-active text-[#00b4c3] border-b-[#3f51b5] border-b pb-3 capitalize"
                : ""
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
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
