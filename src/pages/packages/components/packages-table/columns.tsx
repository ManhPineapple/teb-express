import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TPackage } from "@/constants/data";
import {
  MAP_STATUS_CLASS_NAME,
  PACKAGE_STATUS_CREATED_TEXT,
} from "@/constants/packages";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { ArrowUpRight, Copy, Printer, Send } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Warning from "../../../../assets/warning.svg";
import { prints } from "../../print/print";
import { ModalConfirmAddress } from "../modal-confirm-address/ModalConfirmAddress";

export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard");
    },
    (err) => {
      console.error("Failed to copy text: ", err);
    }
  );
};

export const printBarcode = async (text: string) => {
  try {
    // Generate barcode on a canvas
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: true,
      fontSize: 18,
      height: 70,
      width: 2,
      margin: 5,
    });

    const imgDataUrl = canvas.toDataURL("image/png");

    // Convert px → mm → pt
    const imgWidthMm = canvas.width * 0.264583;
    const imgHeightMm = canvas.height * 0.264583;
    const imgWidthPt = imgWidthMm * 2.83465;
    const imgHeightPt = imgHeightMm * 2.83465;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([imgWidthPt, imgHeightPt]);

    const pngImage = await pdfDoc.embedPng(imgDataUrl);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: imgWidthPt,
      height: imgHeightPt,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create hidden iframe to print PDF
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  } catch (err) {
    toast.error("Lỗi khi in mã vạch!", { autoClose: 3000 });
    console.error(err);
  }
};

const showContent = async (item: string) => {
  document.activeElement && (document.activeElement as HTMLElement).blur();
  try {
    await prints(item);
  } catch (error) {
    console.error("File error !!!", error);
    alert("File error !!!");
  }
};

const convertPrice = (item: any) => {
  if (item.status_string == PACKAGE_STATUS_CREATED_TEXT) {
    return item.shipping_fee; // turn off peak_fee + 0.5;
  } else {
    return item.shipping_fee;
  }
};

export const columns = (packageListType: number): ColumnDef<TPackage>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    header: "Số đơn hàng",
    cell: ({ row }) => {
      return (
        <div className="flex gap-10 justify-between">
          <div className="capitalize font-medium flex gap-2">
            <Link
              to={{
                pathname: `/package${packageListType == 0 ? "" : "-china"}/details/${row.original.id}`,
              }}
              className="text-no-underline text-[#006a5e]"
            >
              {row.getValue("order_number")}
            </Link>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Copy
                className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                onClick={() => handleCopy(`${row.original.order_number}`)}
              />
              <Printer
                className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                onClick={() => printBarcode(`${row.original.order_number}`)}
              />
            </div>
          </div>
          {!row.original.validate_address && (
            <ModalConfirmAddress
              add={row.original.address_1}
              id={row.original.id}
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Mã AB",
    cell: ({ row }) => {
      const packageCode: string = row.getValue("code") || "N/A";

      return (
        <div className="capitalize font-medium">
          {packageCode !== "N/A" ? (
            <div className="flex gap-3 relative">
              <Link
                to={`/package/details/${row.original.id}`}
                className="text-no-underline text-[#006a5e]"
              >
                {packageCode}
              </Link>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy
                  className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                  onClick={() => handleCopy(`${row.original.code}`)}
                />
                <Printer
                  className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                  onClick={() => printBarcode(`${row.original.code}`)}
                />
              </div>
            </div>
          ) : (
            <span className="text-black">{packageCode}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tracking_number",
    header: "Mã theo dõi",
    cell: ({ row }) => {
      const packageCode: string = row.getValue("tracking_number") || "N/A";

      return (
        <div className="max-w-[400px] font-medium">
          {packageCode !== "N/A" ? (
            <div className="flex gap-2">
              <a
                href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${row.original.tracking_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="hover:text-[#006a5e]">
                  <div className="flex gap-2">
                    {packageCode}
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </a>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {/* <Copy
                  className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                  onClick={() => handleCopy(`${row.original.tracking_number}`)}
                /> */}
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy
                    className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                    onClick={() =>
                      handleCopy(`${row.original.tracking_number}`)
                    }
                  />
                  <Printer
                    className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
                    onClick={() => showContent(`${row.original.label}`)}
                  />
                  <a
                    target="_blank"
                    href={`https://t.17track.net/en#nums=${row.original.tracking_number}`}
                  >
                    <Send className="h-4 w-4 hover:text-[#20bddb] cursor-pointer" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-black">{packageCode}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "service_name",
    header: "Dịch vụ",
    cell: ({ row }) => {
      return (
        <div className="capitalize font-medium">
          {row.original.service_name === "Saver"
            ? "Standard"
            : row.original.service_name}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      return (
        <div className="capitalize font-medium">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "dd/MM/yyyy")
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "accepted_at",
    header: "Ngày chấp nhận",
    cell: ({ row }) => {
      return (
        <div className="capitalize font-medium">
          {row.original.accepted_at
            ? format(new Date(row.original.accepted_at), "dd/MM/yyyy")
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "last_print_label_at",
    header: "Ngày in label",
    cell: ({ row }) => {
      return (
        <div className="capitalize font-medium">
          {row.original.last_print_label_at
            ? format(new Date(row.original.last_print_label_at), "dd/MM/yyyy")
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status_string",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <div className="flex justify-between">
          <span
            className={`text-base capitalize p-0.5 px-1 rounded-full font-medium whitespace-nowrap ${
              row.original?.status_string
                ? MAP_STATUS_CLASS_NAME[row.original?.status_string].className
                : "N/A"
            }`}
          >
            {row.original.status_string}
          </span>
          {row.original.alert > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <img src={Warning} alt="Warning" className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Quay lại đơn hàng</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "shipping_fee",
    header: "Tổng chi phí",
    cell: ({ row }) => {
      if (row.original.is_package_exceed) {
        if (!row.original.shipping_fee) {
          return (
            <div
              className="capitalize font-medium text-center mr-5"
              style={{ color: "#FA8C16" }}
            >
              <span className="pkg-exceed">Calculating Price</span>
            </div>
          );
        } else {
          return (
            <div
              className="capitalize font-medium text-center mr-5"
              style={{ color: "#FA8C16" }}
            >
              <span className="pkg-exceed" title="Oversized Package">
                {packageListType == 0 ? "$" : "$"}
                {convertPrice(row.original).toFixed(2)}
              </span>
            </div>
          );
        }
      } else {
        return (
          <div className="capitalize font-medium text-center mr-5">
            {packageListType == 0 ? "$" : "$"}
            {convertPrice(row.original).toFixed(2)}
          </div>
        );
      }
    },
  },
];
