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
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAP_SHIPMENT_STATUS } from "@/constants/shipments";
import { getListShipments } from "@/services/shipments";
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal h-[42px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type Shipment = {
  id: number;
  created_at: string;
  updated_at?: string;
  user_id?: number;
  weight: number;
  actual_weight?: number;
  price: number;
  status: number;
};

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "id",
    header: "SHIPMENT NO.",
    cell: ({ row }) => (
      <div className="capitalize text-[#006a5e] font-semibold ml-5">
        <Link
          to={{
            pathname: `/shipments/detail/${row.original.id}`,
          }}
          className="text-no-underline"
        >
          {row.getValue("id")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: "WEIGHT",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {(row.original.weight / 1000).toFixed(2)}kg
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "CREATED DATE",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {row.original?.created_at
          ? format(new Date(row.original.created_at), "dd/MM/yyyy - HH:mm")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <span
        className={`text-base font-medium px-2 p-1 rounded-2xl capitalize ${
          row.original?.status
            ? MAP_SHIPMENT_STATUS[row.original.status].className
            : "N/A"
        }`}
      >
        {MAP_SHIPMENT_STATUS[row.original.status].text}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">TOTAL FEE</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-semibold">{formatted}</div>;
    },
  },
];

export function Shipments() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<Shipment[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shipments = await getListShipments();
        setData(shipments.shipments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (selectedTab === "All") {
      return data;
    }
    return data.filter(
      (shipment) => MAP_SHIPMENT_STATUS[shipment.status]?.text === selectedTab
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
          placeholder="Filter tracking code, order number..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-full mr-3 h-[40px]"
        />
        <DatePickerWithRange />
        <Button className="bg-[#00978c] ml-3 h-[40px] font-bold">
          Import Excel
        </Button>
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="tabs mb-3 border-b">
        {[
          "All",
          "pending",
          "pre-transit",
          "in-transit",
          "delivered",
          "canceled",
          "expired",
          "undelivered",
          "archived",
        ].map((tab) => (
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
