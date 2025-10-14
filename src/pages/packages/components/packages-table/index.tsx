import DataTable from "@/components/shared/data-table";
import {
  fetchLabel,
  getExportedFile,
  processPackage,
} from "@/services/packages";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { toast } from "react-toastify";
import { columns } from "./columns";
import PackageTabs from "./package-status-tab";
import PackageTableActions from "./package-table-action";

type TPackagesTableProps = {
  packages: any;
  page: number;
  count: any;
  pageCount: number;
  packageListType: number;
};

export type SelectedRowLabel = {
  order_number: string;
  code: string;
  label: string;
  status_string: string;
  id: number;
  tracking_number: string;
};

export default function PackagesTable({
  count,
  packages,
  pageCount,
  packageListType,
}: TPackagesTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedRowsLabel, setSelectedRowsLabel] = useState<
    SelectedRowLabel[]
  >([]);
  const [countSelectedRows, setCountSelectedRows] = useState<number>();
  const [feeSelectedRows, setFeeSelectedRows] = useState<number>();

  const handleChangeSelectedIds = (selectedIds: number[]) => {
    setSelectedIds(selectedIds);
  };

  const handleChangeCountSelectedRows = (countSelectedRows: number) => {
    setCountSelectedRows(countSelectedRows);
  };

  const handleChangeFeeSelectedRows = (feeSelectedRows: number) => {
    setFeeSelectedRows(feeSelectedRows);
  };

  const handleChangeSelectedRowsLabel = (
    selectedRowsLabel: SelectedRowLabel[]
  ) => {
    setSelectedRowsLabel(selectedRowsLabel);
  };

  const handleExport = async () => {
    const exportFile: any = await getExportedFile(selectedIds);
    const blob = new Blob([exportFile.file], {
      type: exportFile.fileType,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", exportFile.filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  function openPrintWindow(files: { blob: Blob; type: string }[]) {
    return new Promise<void>((resolve) => {
      async function processFiles() {
        if (files.length === 0) {
          resolve();
          return;
        }

        const mergedPdf = await PDFDocument.create();

        for (const { blob, type } of files) {
          const fileBytes = await blob.arrayBuffer();

          if (type === "pdf") {
            const pdfDoc = await PDFDocument.load(fileBytes);
            const copiedPages = await mergedPdf.copyPages(
              pdfDoc,
              pdfDoc.getPageIndices()
            );
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } else {
            const imagePdf = await PDFDocument.create();
            const imageBytes = new Uint8Array(fileBytes);

            let img;
            if (type === "image/png") {
              img = await imagePdf.embedPng(imageBytes);
            } else {
              img = await imagePdf.embedJpg(imageBytes);
            }

            const page = imagePdf.addPage([img.width + 60, img.height + 60]);
            page.drawImage(img, {
              x: 30,
              y: 30,
              width: img.width,
              height: img.height,
            });

            const imagePdfBytes = await imagePdf.save();
            const imgPdfDoc = await PDFDocument.load(imagePdfBytes);
            const copiedPages = await mergedPdf.copyPages(
              imgPdfDoc,
              imgPdfDoc.getPageIndices()
            );
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(mergedBlob);
        const pdfWindow = window.open(url, "_blank");

        if (pdfWindow) {
          pdfWindow.onload = () => pdfWindow.print();
        } else {
          console.error("Failed to open print window");
        }

        resolve();
      }

      processFiles();
    });
  }

  const MAX_CONCURRENT = 10;
  async function processItemsConcurrently(
    items: any,
    handler: any,
    maxConcurrent = MAX_CONCURRENT
  ) {
    const results: any = [];
    let i = 0;

    const next = async () => {
      if (i >= items.length) return;
      const index = i++;
      try {
        results[index] = await handler(items[index]);
      } catch (error) {
        results[index] = null;
      }
      return next();
    };

    // Kick off initial batch
    await Promise.all(Array.from({ length: maxConcurrent }, next));
    return results;
  }

  const handlerDownloadLabels = async () => {
    const files: any[] = [];
    const selectedItems = selectedRowsLabel.map((x) => ({
      order_number: x.order_number,
      code: x.code,
      url: x.label,
    }));

    const allUrlsEmpty = selectedItems.every((element) => element.url === "");

    if (allUrlsEmpty) {
      toast.error("Đơn hàng đã chọn không có nhãn!", {
        autoClose: 3000,
      });
      return;
    }

    await processItemsConcurrently(selectedItems, async (item: any) => {
      if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
        try {
          const response = await fetch(item.url);
          if (!response.ok) throw new Error("Failed to fetch file");

          const fileBlob = await response.blob();
          if (fileBlob.type === "application/pdf") {
            files.push({ blob: fileBlob, type: "pdf" });
          } else if (fileBlob.type.startsWith("image/")) {
            files.push({ blob: fileBlob, type: "image" });
          } else {
            toast.error(
              "Kiểu tệp tải xuống không hỗ trợ (Yêu cầu pdf/image).",
              { autoClose: 3000 }
            );
          }
        } catch (error) {
          toast.error("Lỗi khi lấy tệp từ URL", { autoClose: 3000 });
        }
      } else {
        const res = await fetchLabel({ url: item.url, type: "labels" });

        if (!res || res.error) {
          toast.error(res?.errorMessage || "Lỗi khi lấy tệp", {
            autoClose: 3000,
          });
          return;
        }

        const type = res.type || "";
        if (type.startsWith("image/")) {
          files.push({ blob: res, type });
        } else if (type === "application/pdf") {
          files.push({ blob: res, type: "pdf" });
        } else {
          toast.error(`Lỗi khi lấy tệp: ${item.order_number}`, {
            autoClose: 3000,
          });
        }
      }
    });
    await openPrintWindow(files);
  };

  const handlePrintBarcode = async (
    barcodeSource: "code" | "order_number",
    labelSource: "code" | "order_number"
  ) => {
    const selectedItems = selectedRowsLabel.map((x) => ({
      order_number: x.order_number,
      code: x.code,
      tracking_number: x.tracking_number,
    }));

    const allBarcodesEmpty = selectedItems.every(
      (item) => !item[barcodeSource]
    );
    if (allBarcodesEmpty) {
      toast.error("Đơn hàng đã chọn không có mã vạch!", {
        autoClose: 3000,
      });
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", format: [170, 85] });

    selectedItems.forEach((item, index) => {
      const barcodeValue = item[barcodeSource];
      const labelValue = item[labelSource] || "N/A";

      if (!barcodeValue) return;

      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcodeValue, {
        format: "CODE128",
        displayValue: true,
        fontSize: 20,
        height: 50,
        width: 2,
        margin: 0,
      });

      const imageDataUrl = canvas.toDataURL("image/png");
      doc.setFontSize(20);
      doc.text(labelValue, 85, 15, { align: "center" });
      doc.addImage(imageDataUrl, "PNG", 20, 25, 130, 40);

      if (index < selectedItems.length - 1) {
        doc.addPage();
      }
    });

    // Open PDF in new tab and trigger print
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl);
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in!", { autoClose: 3000 });
      return;
    }

    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleActionWayBill = async () => {
    // const selectedInvalid = selectedRowsLabel.filter(
    //   (ele) =>
    //     ele.status_string !== PACKAGE_STATUS_CREATED_TEXT &&
    //     ele.status_string !== PACKAGE_STATUS_PURCHASED_TEXT
    // );
    // if (selectedInvalid.length > 0) {
    //   let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number);
    //   if (codeSelectedInvalid.length > 3) {
    //     codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), "..."];
    //   }
    //   toast.error(
    //     `Đơn hàng ${codeSelectedInvalid.join(", ")} không thể tạo mã theo dõi.`,
    //     {
    //       autoClose: 5000,
    //     }
    //   );
    //   return;
    // }

    const ids = selectedRowsLabel.map((item) => item.id);
    const params = {
      ids: ids,
      coupon_user_id: null,
    };

    const result = await processPackage(params);
    if (result.success) {
      toast.success(
        "Đơn hàng đang được xử lý và mã theo dõi đã được tạo, thông tin xử lý sẽ được cập nhật sau."
      );
    }

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  return (
    <>
      <div className="w-full flex justify-center items-center gap-2 overflow-hidden py-2">
        <span className="text-red-600 font-bold text-xl animate-pulse">!</span>
        <div className="relative w-50% overflow-hidden bg-red-50">
          <p className="whitespace-nowrap font-bold text-red-600 animate-marquee">
            Mẫu file Import đơn đã được cập nhật vào 16:17 14/10/2025. Hãy tải về mẫu mới trước khi tải đơn lên hệ thống. Xin cảm ơn!
          </p>
        </div>
      </div>
      <PackageTableActions
        handleExport={handleExport}
        handleDownloadLabel={handlerDownloadLabels}
        handlePrintBarcode={handlePrintBarcode}
        handleTracking={handleActionWayBill}
        // handleCancel={handleCancel}
        selectedRow={selectedIds}
        countSelectedRows={countSelectedRows}
        feeSelectedRows={feeSelectedRows}
        selectedRowsLabel={selectedRowsLabel}
        packageListType={packageListType}
      />
      <PackageTabs count={count} />
      {packages && (
        <DataTable
          columns={columns(packageListType)}
          data={packages}
          pageCount={pageCount}
          changeSelectedIds={handleChangeSelectedIds}
          changeSelectedRowsLabel={handleChangeSelectedRowsLabel}
          changeCountSelectedRows={handleChangeCountSelectedRows}
          changeFeeSelectedRows={handleChangeFeeSelectedRows}
        />
      )}
    </>
  );
}
