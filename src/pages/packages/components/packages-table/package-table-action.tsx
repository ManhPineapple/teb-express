import ImportModal from "@/components/shared/import-modal";
import PopupModal from "@/components/shared/popup-modal";
import TableSearchInput from "@/components/shared/table-search-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Barcode, CalendarIcon, FolderUp, Printer, Send } from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";
import { ModalCancelPackages } from "../modal-cancel-packages/ModalCancelPackages";
import ImportOrdersForm from "../modal-create-package/import-form";
import OrderCreateForm from "../modal-create-package/package-create-form";

export default function PackageTableActions({
  handleExport,
  handleDownloadLabel,
  handlePrintBarcode,
  handleTracking,
  // handleCancel,
  selectedRow,
  countSelectedRows,
  feeSelectedRows,
  selectedRowsLabel,
  packageListType,
}: {
  handleExport: () => void;
  handleDownloadLabel: () => void;
  handlePrintBarcode: (
    barcodeSource: "code" | "order_number",
    labelSource: "code" | "order_number"
  ) => void;
  handleTracking: () => void;
  // handleCancel: () => void;
  selectedRow: number[];
  countSelectedRows: number | undefined;
  feeSelectedRows: number | undefined;
  selectedRowsLabel: any[];
  packageListType: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadWithLoading = async () => {
    setIsLoading(true);
    try {
      await handleDownloadLabel();
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateTrackingWithLoading = async () => {
    setIsLoading(true);
    try {
      await handleTracking();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="xl:flex items-center justify-between py-5 max-xl:flex-wrap">
      <div className="flex flex-1 gap-4 max-xl:mb-3">
        <TableSearchInput placeholder="Tìm theo mã đơn/mã AB/mã tracking/tên người nhận" />
        {selectedRow.length > 0 && (
          <div className="mt-1.5">
            <p>
              Bạn có <b>{countSelectedRows}</b> đơn hàng đang được chọn.Tổng Chi
              phí: <b>${feeSelectedRows}</b>
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-3 max-[1000px]:flex-wrap max-sm:max-w-full">
        {selectedRow && selectedRow.length > 0 && (
          <div className="flex gap-3 max-sm:flex-wrap">
            <Button
              className="text-xs md:text-sm bg-[#00978c]"
              onClick={handleCreateTrackingWithLoading}
              disabled={isLoading}
            >
              <Send className="mr-2 h-4 w-4" /> Tạo theo dõi đơn
            </Button>
            <Button
              className="text-xs md:text-sm bg-[#1f8e23]"
              onClick={handleDownloadWithLoading}
              disabled={isLoading}
            >
              <Printer className="mr-2 h-4 w-4" />
              {isLoading ? "Đang tải..." : "Tải xuống nhãn"}
            </Button>
            <Button
              className="text-xs md:text-sm bg-[#00978c]"
              onClick={() => handlePrintBarcode("code", "order_number")}
            >
              <Barcode className="mr-2 h-4 w-4" /> Tải xuống mã vạch AB
            </Button>
            <Button
              className="text-xs md:text-sm bg-[#8D181B]"
              onClick={() => handlePrintBarcode("order_number", "code")}
            >
              <Barcode className="mr-2 h-4 w-4" /> Tải xuống mã vạch mã đơn
            </Button>
            {/* <ModalConfirmAddresses selectedRowsLabel={selectedRowsLabel} /> */}
            <Button
              className="text-xs md:text-sm bg-[#a84a77]"
              onClick={() => handleExport()}
            >
              <FolderUp className="mr-2 h-4 w-4" /> Xuất
            </Button>
            <ModalCancelPackages selectedRowsLabel={selectedRowsLabel} />
          </div>
        )}
        {!selectedRow ||
          (selectedRow.length == 0 && (
            <div className="mb-4 flex gap-3">
              <PackageDatePickerWithRange />

              <ImportModal
                renderModal={(onClose) => (
                  <ImportOrdersForm
                    modalClose={onClose}
                    packageListType={packageListType}
                  />
                )}
              />
              <PopupModal
                renderModal={(onClose) => (
                  <OrderCreateForm
                    modalClose={onClose}
                    packageListType={packageListType}
                  />
                )}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

function PackageDatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get("start_date")
      ? new Date(String(searchParams.get("start_date")))
      : undefined,
    to: searchParams.get("end_date")
      ? new Date(String(searchParams.get("end_date")))
      : undefined,
  });

  const [byDate, setByDate] = React.useState(
    searchParams.get("by_date") || "created_at"
  );

  // Update URL immediately when user changes the "by_date" dropdown
  const handleChangeByDate = (value: string) => {
    setByDate(value);
    const params = new URLSearchParams(searchParams);
    params.set("by_date", value);
    params.set("page", "1");
    setSearchParams(params);
    window.location.reload();
  };

  const handleCancel = () => {
    searchParams.delete("start_date");
    searchParams.delete("end_date");
    searchParams.delete("by_date");
    setDate({ from: undefined, to: undefined });
    setByDate("created_at");
    setSearchParams(searchParams);
    window.location.reload();
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (date?.from && date?.to) {
      params.set("start_date", format(date.from, "yyyy-MM-dd"));
      params.set("end_date", format(date.to, "yyyy-MM-dd"));
    } else {
      params.delete("start_date");
      params.delete("end_date");
    }

    params.set("by_date", byDate);
    params.set("page", "1");

    setSearchParams(params);
    window.location.reload();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Dropdown for by_date */}
      <select
        className={cn(
          "h-[40px] min-w-[160px] rounded-md border border-gray-300 bg-white",
          "px-3 text-sm font-medium text-gray-700 shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-[#00978c] focus:border-[#00978c]",
          "hover:border-gray-400 transition-colors"
        )}
        value={byDate}
        onChange={(e) => handleChangeByDate(e.target.value)}
      >
        <option value="created_at">Ngày tạo</option>
        <option value="checkin_warehouse_at">Ngày nhập kho</option>
        <option value="scan_weight_at">Ngày cân</option>
        <option value="delivered_at">Ngày giao hàng</option>
      </select>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[250px] justify-start text-left font-normal h-[40px]",
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
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 z-10 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 my-2 mr-2">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
