import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Copy, Download } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getBillList,
  getInvoice,
  getInvoiceDownloadUrl,
} from "@/services/bill";
import saveAs from "file-saver";
import { Link, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { BillDatePickerWithRange } from "../bill-datepicker";

export type Payment = {
  id: string;
  amount: number;
  code: string;
  created_date: Date;
  shipping_fee: number;
  extra_fee: number;
};

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard");
    },
    (err) => {
      console.error("Failed to copy text: ", err);
    }
  );
};

const total = (ship: any, extra: number) => {
  const total = ship + extra;
  return total;
};

const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "code",
    header: "Bill code",
    cell: ({ row }) => (
      <div className="flex capitalize text-[#006a5e] font-medium">
        <Link
          to={{
            pathname: `/bill/detail/${row.getValue("code")}`,
          }}
          className="text-no-underline"
        >
          {row.getValue("code")}
        </Link>
        <Copy
          className="ml-4 w-4 h-4 cursor-pointer"
          onClick={() => handleCopy(row.original.code)}
        />
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="lowercase ml-10">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "shipping_fee",
    header: () => <div className="text-right">Tổng chi phí</div>,
    cell: ({ row }) => {
      const amount = parseFloat(
        total(row.original.shipping_fee, row.original.extra_fee)
      );

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDownloadBill = async () => {
        const downloadUrl = await getInvoiceDownloadUrl(row.original.code);
        const invoiceToPrint = await getInvoice(downloadUrl);
        const blob = new Blob([invoiceToPrint], {
          type: "application/pdf",
        });
        saveAs(blob, `payment_receipt_${row.original.code}`);
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Download
                className="float-right hover:text-[#28a745]"
                onClick={handleDownloadBill}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Export bill</p>
            </TooltipContent>
          </Tooltip>
          <ToastContainer />
        </TooltipProvider>
      );
    },
  },
];

export function ManagementTable() {
  const [data, setData] = React.useState<Payment[]>([]);
  const [, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = async () => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      search: searchInput,
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payments = await getBillList(1, 50, searchParams);
        setData(payments.bills);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

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
    <div className="w-full">
      <div className="grid grid-cols-3 mt-5 max-sm:grid max-sm:grid-cols-1">
        <div className="mb-4 col-span-2">
          <Input
            placeholder="Lọc mã theo dõi hoặc mã hóa đơn..."
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-[44px]"
          />
        </div>
        <div className="flex sm:justify-end items-center mb-4 gap-3">
          <BillDatePickerWithRange />
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
                  Không kết quả .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trong{" "}
          {table.getFilteredRowModel().rows.length} dòng được chọn.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
