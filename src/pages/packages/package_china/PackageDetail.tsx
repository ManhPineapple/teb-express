import ModalUpdatePackage from "@/components/shared/popup-modal-update";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EXTRA_FEE_CANCEL_LABEL,
  EXTRA_FEE_TYPE_DISCOUNT,
  MAP_STATUS_CLASS_NAME,
  PACKAGE_REFUND_COMPLETE,
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  PACKAGE_STATUS_PURCHASED_TEXT,
} from "@/constants/packages";
import { downloadCNInvoiceImage, getPackagesDetail } from "@/services/packages";
import { format } from "date-fns";
import saveAs from "file-saver";
import JsBarcode from "jsbarcode";
import {
  ArrowUpRight,
  Barcode,
  CircleArrowLeft,
  Info,
  PackageOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { packageListTypeChina } from ".";
import { AuditLog } from "../components/audit-logs";
import DeliveryLog from "../components/deliver-logs";
import { ModalCancel } from "../components/modal-cancel-packages/ModalCancel";
import { ModalCreateTracking } from "../components/modal-create-tracking/ModalCreateTracking";
import ModalUpdatePackages from "../components/modal-update-package/ModalUpdatePackage";
import PackageTracking from "../components/track";

export type PackageDetail = {
  id: number;
  order_number: string;
  label: string;
  recipient: string;
  company: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  city: string;
  state_code: string;
  zipcode: string;
  country_code: string;
  detail: string;
  weight: number;
  width: number;
  length: number;
  height: number;
  actual_weight: number;
  actual_width: number;
  actual_length: number;
  actual_height: number;
  status_string: string;
  service_id: number;
  note: string;
  service_name: string;
  service_code: string;
  tracking_number: string;
  code_package: string;
  shipping_fee: number;
  created_at: string;
  alert: number;
  is_insured: boolean;
  estimate_date_process: string;
  is_package_exceed: boolean;
  include_battery: boolean;
  package_products: any[];
  scan_days: string;
  custom_url: string;
  package_name: string;
  package_quantity: number;
  product_price: number;
  is_purchased: boolean;
  cn_product_link: string;
  cn_product_price: string;
  cn_invoice_image: string;
  cn_shipping_fee: string;
  custom_cn_barcode: string;
};

type RefundFee = {
  id: number;
  created_at: string;
  updated_at: string;
  package_id: number;
  amount: number;
  status: number;
  code: string;
};

type ExtraFee = {
  id: number;
  created_at: string;
  updated_at: string;
  package_id: number;
  coupon_id: number | null;
  customer_shipment_id: number | null;
  bill_id: number;
  extra_fee_type_id: number;
  amount: number;
  description: string;
  status: number;
  package: any;
  extra_fee_types: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    status: number;
    parent_id: number;
    is_refund: boolean;
    Fee: number;
    is_show: boolean;
  } | null;
  coupon: any;
};

export default function PackageDetailChina() {
  const navigate = useNavigate();
  const { package_id } = useParams<{ package_id: any }>();
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(
    null
  );
  const [refundFee, setRefundFee] = useState<RefundFee[] | null>([]);
  const [extraFee, setExtraFee] = useState<ExtraFee[] | null>([]);
  const [displayDeliverDetail, setDisplayDeliverDetail] = useState(false);
  const ids = parseInt(package_id, 10);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        if (package_id) {
          const data = await getPackagesDetail(package_id);
          setPackageDetail(data.package);
          setRefundFee(data.package_refund);
          setExtraFee(data.extra_fee);
        }
      } catch (error) {
        /* empty */
      }
    };

    fetchPackageDetail();
  }, [package_id]);

  const currentPackage = {
    tracking_number: packageDetail?.tracking_number,
    service_name: packageDetail?.service_name,
    country_code: packageDetail?.country_code,
  };

  const isAlreadyRefunded = () => {
    return (
      refundFee!.length > 0 &&
      refundFee!.filter(({ status }) => status !== PACKAGE_REFUND_COMPLETE)
        .length === 0
    );
  };

  const extraFees = () => {
    return (extraFee || []).filter(
      ({ extra_fee_type_id }) => extra_fee_type_id !== EXTRA_FEE_TYPE_DISCOUNT
    );
  };

  const extraFeeDiscount = () => {
    return (extraFee || []).filter(
      ({ extra_fee_type_id }) => extra_fee_type_id === EXTRA_FEE_TYPE_DISCOUNT
    );
  };

  const sumExtraFee = () => {
    let amount = 0;

    amount += extraFees().reduce((total, v) => {
      if (
        !isAlreadyRefunded() &&
        v.extra_fee_type_id === EXTRA_FEE_CANCEL_LABEL
      ) {
        return total;
      }
      return total + v.amount;
    }, 0);

    return amount;
  };

  const discount = () => {
    const total = extraFeeDiscount().reduce(
      (total, { amount }) => total + amount,
      0
    );
    return total;
  };

  const sumRefundFee = () => {
    const total = refundFee?.reduce((total, { amount }) => total + amount, 0);
    return total?.toFixed(2);
  };

  const sumFee = () => {
    return (packageDetail?.shipping_fee ?? 0) + sumExtraFee() + discount();
  };

  const handleBackClick = () => {
    navigate("/packages-china");
  };

  const handleDownloadBarcode = async () => {
    const files: any[] = [];

    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, packageDetail!.code_package, {
        format: "CODE128",
        displayValue: true,
        fontSize: 8,
        height: 50,
        width: 0.8,
      });

      const imageDataUrl = canvas.toDataURL("image/png");

      files.push({
        fileName: `${packageDetail?.order_number || "barcode"}.png`,
        imageDataUrl,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast.error("Error generating barcode", {
        autoClose: 3000,
      });
    }

    files.forEach(({ fileName, imageDataUrl }) => {
      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = fileName;
      link.click();
    });

    if (files.length > 0) {
      toast.success("Barcodes downloaded successfully!", {
        autoClose: 3000,
      });
    } else {
      toast.error("No barcodes generated!", {
        autoClose: 3000,
      });
    }
  };

  const handleViewImage = async () => {
    try {
      const imageBlob = await downloadCNInvoiceImage(
        packageDetail?.cn_invoice_image || ""
      );
      const blob = new Blob([imageBlob], { type: "image/png" });
      saveAs(blob, `Image ${packageDetail?.order_number}`);
    } catch (error) {
      toast.error("Download image failed");
    }
  };

  return (
    <div className="max-w-full rounded-lg h-full">
      <div className="p-3 px-6">
        <div className="sm:flex justify-between">
          <div className="flex gap-10 max-sm:flex-wrap max-sm:mb-3">
            <div className="flex justify-between">
              <CircleArrowLeft
                className="absolute top-5 cursor-pointer"
                onClick={handleBackClick}
              />
              <div className="ml-[30px]">
                <div className="text-sm font-normal text-[#626363]">
                  Mã đơn hang:
                </div>
                <span className="text-base font-bold">
                  {packageDetail?.code_package
                    ? packageDetail.code_package
                    : "N/A"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-normal text-[#626363]">Dịch vụ:</div>
              <span className="font-medium text-sm tracking-[.2px] text-[#111212]">
                {packageDetail?.service_name === "Saver"
                  ? "Standard"
                  : packageDetail?.service_name}
              </span>
            </div>
            {packageDetail?.tracking_number ? (
              <PackageTracking current={currentPackage} />
            ) : (
              <div>
                <div className="text-sm font-normal text-[#626363]">
                  Theo dõi chặng cuối:
                </div>
                <div className="flex hover:text-[#13c2c2]">
                  <span className="font-medium text-sm tracking-[.2px] text-[#111212] hover:text-[#13c2c2]">
                    {currentPackage?.tracking_number
                      ? currentPackage.tracking_number
                      : "N/A"}
                  </span>
                  {currentPackage?.tracking_number && (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-normal text-[#626363]">
                Ngày tạo:
              </div>
              <span className="font-medium text-sm tracking-[.2px] text-[#111212]">
                {packageDetail?.created_at
                  ? format(
                    new Date(packageDetail.created_at),
                    "dd/MM/yyyy - HH:mm:ss"
                  )
                  : "N/A"}
              </span>
            </div>
            <div>
              <div className="text-sm font-normal text-[#626363]">Trạng thái:</div>
              <span
                className={`text-base font-medium px-2 p-1 rounded-2xl capitalize whitespace-nowrap mr-5 ${packageDetail?.status_string
                  ? MAP_STATUS_CLASS_NAME[packageDetail?.status_string]
                    .className
                  : "N/A"
                  }`}
              >
                {packageDetail?.status_string}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {(packageDetail?.status_string === PACKAGE_STATUS_CREATED_TEXT ||
              packageDetail?.status_string === PACKAGE_STATUS_PURCHASED_TEXT ||
              packageDetail?.status_string ===
              PACKAGE_STATUS_PENDING_PICKUP_TEXT) && (
                <div className="">
                  <ModalCancel ids={[ids]} />
                </div>
              )}

            {(packageDetail?.status_string === PACKAGE_STATUS_CREATED_TEXT ||
              packageDetail?.status_string ===
              PACKAGE_STATUS_PURCHASED_TEXT) && (
                <div className="">
                  <ModalUpdatePackage
                    renderModal={(onClose) => (
                      <ModalUpdatePackages
                        modalClose={onClose}
                        packageDetail={packageDetail}
                        packageListType={packageListTypeChina}
                      />
                    )}
                  />
                </div>
              )}

            <Button
              className="text-xs md:text-sm bg-[#8D181B]"
              onClick={() => handleDownloadBarcode()}
              disabled={!packageDetail?.tracking_number}
            >
              <Barcode className="mr-2 h-4 w-4" /> Tải xuống mã vạch
            </Button>

            {packageDetail?.status_string === PACKAGE_STATUS_PURCHASED_TEXT && (
              <div className="">
                <ModalCreateTracking sumFee={sumFee} />
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />

      <div className="grid grid-cols-12 max-xl:grid-cols-1">
        <div className="grid grid-cols-2 xl:col-span-7 max-sm:grid-cols-1">
          <div className="">
            <div className=" sm:h-[450px] items-center justify-center p-6">
              <div className="border-b pb-3 font-bold ">Order Details:</div>
              <div className="grid grid-cols-12 my-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Chi tiết:
                </div>
                <div className="col-span-8"> {packageDetail?.detail}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Số đơn hàng:
                </div>
                <div className="col-span-8">{packageDetail?.order_number}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Cân nặng:
                </div>
                <div className="col-span-8">{packageDetail?.weight} gram</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Chiều dài:
                </div>
                <div className="col-span-8"> {packageDetail?.length} cm</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Chiều rộng:
                </div>
                <div className="col-span-8"> {packageDetail?.width} cm</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Chiều cao:
                </div>
                <div className="col-span-8"> {packageDetail?.height} cm</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Pin:
                </div>
                <div className="col-span-8">
                  {packageDetail?.include_battery ? "Yes" : "No"}
                </div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Link sản phẩm:
                </div>
                <div className="col-span-8 overflow-hidden text-ellipsis whitespace-nowrap">
                  <a
                    href={packageDetail?.cn_product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {packageDetail?.cn_product_link || "N/A"}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Tùy chỉnh mã vạch:
                </div>
                <div className="col-span-8">
                  {packageDetail?.custom_cn_barcode || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Ảnh biên nhận:
                </div>
                <button
                  className={`bg-transparent border-none p-0 ${packageDetail?.cn_invoice_image ? "col-span-2 text-blue-500 underline cursor-pointer" : "col-span-1 text-bl"}`}
                  disabled={!packageDetail?.cn_invoice_image}
                  onClick={handleViewImage}
                >
                  {packageDetail?.cn_invoice_image ? "Xem ảnh" : "None"}
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <div className=" h-full items-center justify-center p-6">
              <div className="border-b pb-3 font-bold">Recipient:</div>
              <div className="grid grid-cols-12 my-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Họ tên:
                </div>
                <div className="col-span-8"> {packageDetail?.recipient}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Số điện thoại:
                </div>
                <div className="col-span-8"> {packageDetail?.phone_number}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Địa chỉ:
                </div>
                <div className="col-span-8"> {packageDetail?.address_1}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Địa chỉ 2:
                </div>
                <div className="col-span-8"> {packageDetail?.address_2}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Thành phố:
                </div>
                <div className="col-span-8"> {packageDetail?.city}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Mã bang:
                </div>
                <div className="col-span-8"> {packageDetail?.state_code}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Mã bưu điện:
                </div>
                <div className="col-span-8"> {packageDetail?.zipcode}</div>
              </div>
              <div className="grid grid-cols-12 mb-2">
                <div className="col-span-4 font-normal text-[#626363]">
                  Mã quốc gia:
                </div>
                <div className="col-span-8">{packageDetail?.country_code}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 mt-2 mx-5">
          <Card className="max-w-screen">
            <CardHeader>
              <CardTitle className="border-b pb-3">Fee:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="total-title font-medium text-[#aaabab]">
                  Phí vận chuyển:
                </div>
                <div className="total-number text-lg font-medium text-[#111212] tracking-[.2px]">
                  ${packageDetail?.shipping_fee}
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="total-title font-medium text-[#aaabab]">
                  Phụ phí:
                </div>
                <span className="total-number text-lg font-medium text-[#111212] tracking-[.2px]">
                  ${sumExtraFee().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <div className="total-title font-medium text-[#aaabab]">
                  Giảm giá:
                </div>
                <div className="flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="pt-1.5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Giảm giá trên cân nặng</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="total-number text-lg font-medium text-[#111212] tracking-[.2px]">
                    ${discount().toFixed(2)}
                  </span>
                </div>
              </div>
              {refundFee!.length > 0 && (
                <div className=" mt-[15px]">
                  <div className="flex justify-between">
                    <div className="total-title font-medium text-[#aaabab]">
                      Phí hoàn tiền:
                    </div>
                    <div className="total-number text-lg font-medium text-[#111212] tracking-[.2px]">
                      ${sumRefundFee()}
                    </div>
                  </div>
                </div>
              )}
              <hr className="mt-5" />
              <div className="total mt-3 flex justify-between">
                <div className="total-title font-medium text-[#aaabab]">
                  Tổng chi phí:
                </div>
                <span className="total-number text-[28px] font-semibold leading-[34px] text-[#111212]">
                  ${sumFee().toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 max-xl:grid-cols-1">
        <div className="col-span-7">
          <div className="p-6">
            <div className="max-xl:mb-5 mt-5">
              <Card className="h-full">
                <CardHeader className="">
                  <div>
                    <div className="flex gap-5 border-b">
                      <button
                        className={`pb-3 ${!displayDeliverDetail ? "font-bold border-b border-[#006a5e]" : ""}`}
                        onClick={() => setDisplayDeliverDetail(false)}
                      >
                        Giao đơn hàng"
                      </button>
                      <button
                        className={`pb-3 ${displayDeliverDetail ? "font-bold border-b border-[#006a5e]" : ""}`}
                        onClick={() => setDisplayDeliverDetail(true)}
                      >
                        Lịch sử đơn hàng
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {displayDeliverDetail ? <AuditLog /> : <DeliveryLog />}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="col-span-5">
          <div className="">
            <div className=" h-full items-center justify-center p-6">
              <div className="border-b pb-3 font-bold">
                Thông tin phụ phí:
              </div>
              {extraFee && extraFee.length > 0 ? (
                <div className="mt-3">
                  <div className="grid grid-cols-12 mb-5">
                    <div className="col-span-10 text-[#626363]">
                      Tên dịch vụ
                    </div>
                    <div className="col-span-2 text-center">Fee</div>
                  </div>
                  {extraFee.map((extraFee, index) => (
                    <div className="grid grid-cols-12" key={index}>
                      <div className="col-span-10">
                        {extraFee.extra_fee_types?.name}
                      </div>
                      <div className="col-span-2 text-center">
                        ${extraFee.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <PackageOpen
                    strokeWidth={0.5}
                    className="w-[106px] h-[84px] mx-auto mt-[80px] text-[#aaabab]"
                  />
                  <p className="text-[#aaabab] mt-3">
                    Chưa có thông tin sản phẩm.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="">
            <div className=" h-full items-center justify-center p-6">
              <div className="border-b pb-3 font-bold">
                Thông tin sản phẩm:
              </div>
              {packageDetail?.package_products &&
                packageDetail?.package_products?.length > 0 ? (
                <div className="mt-3">
                  <div className="grid grid-cols-12 mb-5">
                    <div className="col-span-5 text-[#626363]">SKU</div>
                    <div className="col-span-5 text-[#37393e]">Tên</div>
                    <div className="col-span-2">Số lượng</div>
                  </div>
                  {packageDetail?.package_products.map((product, index) => (
                    <div className="grid grid-cols-12" key={index}>
                      <Link
                        to={`/setting/products?search=${product.sku}`}
                        className="col-span-5"
                      >
                        <div className="text-[#0554f2]">{product.sku}</div>
                      </Link>
                      <div className="col-span-5">{product.name}</div>
                      <div className="col-span-2 text-center">
                        {product.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <PackageOpen
                    strokeWidth={0.5}
                    className="w-[106px] h-[84px] mx-auto mt-[80px] text-[#aaabab]"
                  />
                  <p className="text-[#aaabab] mt-3">
                    Chưa có thông tin sản phẩm.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="">
            <div className=" h-full items-center justify-center p-6">
              <div className="border-b pb-3 font-bold">Hỗ trợ & Khiếu nại:</div>
              <div>
                <div className="text-center">
                  <PackageOpen
                    strokeWidth={0.5}
                    className="w-[106px] h-[84px] mx-auto mt-[80px] text-[#aaabab]"
                  />
                  <p className="text-[#aaabab] mt-3">
                    Chưa có thông tin hỗ trợ và khiếu nại.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
