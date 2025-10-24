import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createTopupTransaction,
  updateTopupTransaction,
} from "@/services/transaction";
import { ArrowLeftRight, Copy } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VietQR } from "vietqr";

const BankingAccount = {
  bank: "970422",
  bankName: "MB Bank - Ngân hàng Thương mại cổ phần Quân đội",
  accountName: "CONG TY TNHH SAN XUAT THUONG MAI DICH VU ANANBAY",
  accountNumber: "293636688",
};

const BankingTopup: React.FC = () => {
  const [exchangeRate, setExchangeRate] = useState(27200);
  const [rateLastUpdate, setRateLastUpdate] = useState("24/10/2025");
  const [topupId, setTopupId] = useState<number>();
  const [usd, setUsd] = useState("");
  const [vnd, setVnd] = useState("");
  const [qrCode, setQRCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vietQR = useMemo(
    () =>
      new VietQR({
        clientID: "de8a0804-a76d-41e5-8ad6-31503ce7d5f4",
        apiKey: "17c29f09-4ea2-4417-b9c2-7f020d35de42",
      }),
    []
  );

  // const formatDate = (iso: string) => {
  //   const d = new Date(iso);
  //   return `${String(d.getDate()).padStart(2, "0")}/${String(
  //     d.getMonth() + 1
  //   ).padStart(2, "0")}/${d.getFullYear()}`;
  // };
  useEffect(() => {
    // const today = new Date().toISOString().split("T")[0];

    // axios
    //   .get(`https://www.vietcombank.com.vn/api/exchangerates?date=${today}`)
    //   .then(({ data }) => {
    //     setExchangeRate(data.Data[0].sell);
    //     setRateLastUpdate(formatDate(data.Date));
    //   })
    //   .catch(() => console.warn("⚠️ Không thể tải tỉ giá, sử dụng mặc định."));

    createTopupTransaction()
      .then((res) => setTopupId(res.topup.id))
      .catch(() => console.error("⚠️ Không thể tạo giao dịch nạp tiền."));
  }, []);

  // Update USD/VND input
  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsd(value);
    setVnd(
      value
        ? Intl.NumberFormat("en-US").format(Math.round(+value * exchangeRate))
        : ""
    );
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Đã sao chép"))
      .catch(() => toast.error("Không thể sao chép"));
  };

  // Submit top-up
  const handleSubmit = async () => {
    if (!usd || !topupId) return toast.error("Vui lòng nhập số tiền");

    setIsSubmitting(true);

    const res = await updateTopupTransaction(topupId, Number(usd));
    if (res.success) toast.success("Yêu cầu nạp tiền của bạn đang được xử lý");

    setIsSubmitting(false);
  };

  // Generate QR code dynamically
  useEffect(() => {
    vietQR
      .genQRCodeBase64({
        bank: BankingAccount.bank,
        accountName: BankingAccount.accountName,
        accountNumber: BankingAccount.accountNumber,
        amount: `${Math.round(Number(usd) * exchangeRate)}`,
        template: "compact",
      })
      .then((res: any) => setQRCode(res.data.data.qrDataURL))
      .catch(() => console.error("⚠️ Không thể tạo QR code."));
  }, [usd, exchangeRate, vietQR]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Vui lòng chuyển tiền theo thông tin dưới đây:
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bank Info */}
        <div>
          <p className="text-sm text-gray-500">Ngân hàng:</p>
          <b>{BankingAccount.bankName}</b>
        </div>

        <div>
          <p className="text-sm text-gray-500">Tên chủ thẻ:</p>
          <div className="flex gap-2 items-center">
            <b>{BankingAccount.accountName}</b>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleCopy(BankingAccount.accountName)}
                  />
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Số tài khoản:</p>
          <div className="flex gap-2 items-center">
            <b>{BankingAccount.accountNumber}</b>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleCopy(BankingAccount.accountNumber)}
                  />
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Amount Conversion */}
        <div className="flex gap-4 items-center">
          <div className="flex w-1/2 border rounded-lg items-center px-2">
            <Input
              type="number"
              placeholder="Nhập số tiền (USD)"
              value={usd}
              onChange={handleUsdChange}
              className="border-none focus-visible:ring-0"
            />
            <span className="text-gray-500 ml-1">USD</span>
          </div>
          <ArrowLeftRight />
          <div className="flex w-1/2 border rounded-lg items-center px-2">
            <Input
              value={vnd}
              readOnly
              className="border-none focus-visible:ring-0"
            />
            <span className="text-gray-500 ml-1">VND</span>
          </div>
        </div>

        {qrCode && <img src={qrCode} alt="QR Code" className="w-[200px]" />}
      </CardContent>

      <CardFooter className="flex justify-between items-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
        <div className="text-xs text-right italic text-gray-600">
          <div>
            Tỉ giá chuyển đổi: 1 USD ={" "}
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(exchangeRate)}{" "}
            VND
          </div>
          <div>Ngày cập nhật: {rateLastUpdate}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BankingTopup;
