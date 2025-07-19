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
import { ModalConfirmAddresses } from "../modal-confirm-address/ModalConfirmAddresses";
import ImportOrdersForm from "../modal-create-package/import-form";
import OrderCreateForm from "../modal-create-package/package-create-form";

export default function PackageTableActions({
  handleExport,
  handleDownloadLabel,
  handleDownloadBarcode,
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
  handleDownloadBarcode: () => void;
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
        <TableSearchInput placeholder="Tìm mã đơn hàng" />
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
              className="text-xs md:text-sm bg-[#8D181B]"
              onClick={() => handleDownloadBarcode()}
            >
              <Barcode className="mr-2 h-4 w-4" /> Tải xuống mã vạch
            </Button>
            <ModalConfirmAddresses selectedRowsLabel={selectedRowsLabel} />
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

  const handleCancel = () => {
    searchParams.delete("start_date");
    searchParams.delete("end_date");
    searchParams.delete("by_date");
    setDate({ from: undefined, to: undefined });
    setSearchParams(searchParams);
    window.location.reload();
  };

  const handleCreateDate = () => {
    if (date?.from && date?.to) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: "1",
        by_date: "create",
        start_date: format(date.from, "yyyy-MM-dd"),
        end_date: format(date.to, "yyyy-MM-dd"),
      });
    } else {
      searchParams.delete("start_date");
      searchParams.delete("end_date");
      searchParams.delete("by_date");
      setSearchParams(searchParams);
    }
    window.location.reload();
  };

  // const handleAcceptDate = () => {
  //   if (date?.from && date?.to) {
  //     setSearchParams({
  //       ...Object.fromEntries(searchParams),
  //       page: "1",
  //       by_date: "accept",
  //       start_date: format(date.from, "yyyy-MM-dd"),
  //       end_date: format(date.to, "yyyy-MM-dd"),
  //     });
  //   } else {
  //     searchParams.delete("start_date");
  //     searchParams.delete("end_date");
  //     searchParams.delete("by_date");
  //     setSearchParams(searchParams);
  //   }
  //   window.location.reload();
  // };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
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
        <PopoverContent className="w-auto p-0 z-10  bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 my-2 r-0">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button className="bg-green-400" onClick={handleCreateDate}>
              Chọn
            </Button>
            {/* <Button className="bg-green-400" onClick={handleAcceptDate}>
              AcceptDate
            </Button> */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
