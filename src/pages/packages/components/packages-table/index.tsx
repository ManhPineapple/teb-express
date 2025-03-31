import DataTable from "@/components/shared/data-table";
import {
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_PURCHASED_TEXT,
} from "@/constants/packages";
import {
  fetchBarcodeFile,
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

  // const openPrintWindow = (file: File) => {
  //   return new Promise<void>((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const imgData = e.target.result;
  //       const pdf = new jsPdfLib.jsPDF();
  //       pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
  //       const pdfOutput = pdf.output("blob");
  //       const url = URL.createObjectURL(pdfOutput);

  //       const pdfWindow = window.open(url, "_blank");
  //       if (pdfWindow) {
  //         pdfWindow.onload = () => {
  //           pdfWindow.print();
  //         };
  //       } else {
  //         resolve();
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

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
            page.drawImage(img, { x: 30, y: 30, width: img.width, height: img.height });            

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

    for (const item of selectedItems) {
      if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
        try {
          const response = await fetch(item.url);
          if (!response.ok) throw new Error("Failed to fetch file");
          const fileBlob = await response.blob();

          if (fileBlob.type === "application/pdf") {
            files.push({ blob: fileBlob, type: "pdf" }); // Merge PDFs
          } else if (fileBlob.type.startsWith("image/")) {
            files.push({ blob: fileBlob, type: "image" }); // Convert image to PDF
          } else {
            toast.error("Unsupported file type", { autoClose: 3000 });
          }
        } catch (error) {
          toast.error("Lỗi khi lấy tệp từ URL", { autoClose: 3000 });
        }
      } else {
        const res = await fetchBarcodeFile({ url: item.url, type: "labels" });

        if (!res || res.error) {
          toast.error(res?.errorMessage || "Lỗi khi lấy tệp", {
            autoClose: 3000,
          });
          toast.error(res?.errorMessage || "Error fetching file", {
            autoClose: 3000,
          });
          continue;
        }
        files.push({
          blob: res,
          type: res.type.startsWith("image/") ? res.type : "pdf",
        });
      }
    }
    await openPrintWindow(files);
  };

  const handlerDownloadBarcodes = async () => {
    const selectedItems = selectedRowsLabel.map((x) => ({
      order_number: x.order_number,
      code: x.code,
      tracking_number: x.tracking_number,
    }));

    const allTrackingNumbersEmpty = selectedItems.every(
      (element) => element.tracking_number === ""
    );

    if (allTrackingNumbersEmpty) {
      toast.error("Đơn hàng đã chọn không có mã vạch!", {
        autoClose: 3000,
      });
      return;
    }

    const pdf = new jsPDF();

    let currentY = 10; // Starting Y position for the first barcode
    const lineHeight = 60; // Height reserved for each barcode (including spacing)

    for (const item of selectedItems) {
      if (item.tracking_number === "") continue;

      try {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, item.code, {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
          height: 50,
          width: 1,
        });

        const imageDataUrl = canvas.toDataURL("image/png");

        if (currentY + lineHeight > pdf.internal.pageSize.height) {
          // Add a new page if the content exceeds the current page
          pdf.addPage();
          currentY = 10; // Reset Y position
        }

        // Add barcode image
        pdf.addImage(imageDataUrl, "PNG", 10, currentY, 100, 50);

        // Add order number below the barcode
        // pdf.text(`Order Number: ${item.order_number}`, 10, currentY + 55);

        currentY += lineHeight; // Move to the next line for the next barcode
      } catch (error) {
        console.error("Error generating barcode:", error);
        toast.error("Lỗi tạo mã vạch", {
          autoClose: 3000,
        });
      }
    }

    // Save the PDF if barcodes were added
    if (currentY > 10) {
      pdf.save("barcodes.pdf");
      toast.success("Tệp PDF mã vạch đã được tải xuống thành công!", {
        autoClose: 3000,
      });
    } else {
      toast.error("Không có mã vạch nào được tạo!", {
        autoClose: 3000,
      });
    }
  };
  const handleActionWayBill = async () => {
    const selectedInvalid = selectedRowsLabel.filter(
      (ele) =>
        ele.status_string !== PACKAGE_STATUS_CREATED_TEXT &&
        ele.status_string !== PACKAGE_STATUS_PURCHASED_TEXT
    );

    if (selectedInvalid.length > 0) {
      let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number);

      if (codeSelectedInvalid.length > 3) {
        codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), "..."];
      }

      toast.error(
        `Đơn hàng ${codeSelectedInvalid.join(", ")} không thể tạo mã theo dõi.`,
        {
          autoClose: 5000,
        }
      );

      return;
    }

    const ids = selectedRowsLabel.map((item) => item.id);

    const params = {
      ids: ids,
      coupon_user_id: null,
    };

    const result = await processPackage(params);

    if (!result || !result.success) {
      toast.error(result.message, {
        autoClose: 3000,
      });
      return;
    }

    let msg = "Tạo mã theo dõi thành công";
    if (result.promotion_label) {
      msg =
        "Đơn hàng đang được xử lý và mã theo dõi đã được tạo, thông tin xử lý sẽ được cập nhật sau.";
    }

    toast.success(msg, {
      autoClose: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  // const handleCancel = async () => {
  //   const selectedInvalid = selectedRowsLabel.filter(
  //     (ele) =>
  //       ele.status_string !== PACKAGE_STATUS_CREATED_TEXT &&
  //       ele.status_string !== PACKAGE_STATUS_PENDING_PICKUP_TEXT
  //   );

  //   if (selectedInvalid.length > 0) {
  //     let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number);
  //     if (codeSelectedInvalid.length > 3) {
  //       codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), "..."];
  //     }

  //     return toast.error(
  //       `Đơn hàng ${codeSelectedInvalid.join(", ")} không thể hủy đơn.`,
  //       {
  //         autoClose: 5000,
  //       }
  //     );
  //   }

  //   const ids = selectedRowsLabel.map((item) => item.id);
  //   const order_number = selectedRowsLabel.map((item) => item.order_number);

  //   const payload = {
  //     ids: ids,
  //   };

  //   try {
  //     const result = await cancelPackages(payload);

  //     if (!result || !result.success) {
  //       return toast.error(result.message, {
  //         autoClose: 3000,
  //       });
  //     }

  //     toast.success(`Hủy đơn: ${order_number} thành công`, {
  //       autoClose: 3000,
  //     });
  //     const { setPackages } = usePackageStore.getState();
  //     const newPackages = await getListPackages(
  //       1,
  //       50,
  //       "",
  //       "",
  //       undefined,
  //       undefined,
  //       undefined
  //     );
  //     setPackages(newPackages.packages);
  //   } catch (error) {
  //     toast.error("Đã xảy ra lỗi trong quá trình hủy đơn.", {
  //       autoClose: 3000,
  //     });
  //   }
  // };

  return (
    <>
      <PackageTableActions
        handleExport={handleExport}
        handleDownloadLabel={handlerDownloadLabels}
        handleDownloadBarcode={handlerDownloadBarcodes}
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
