// src/components/tabs/AccountTab.tsx
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
import { CustomAxios } from "@/utils/customAxios";
import axios from "axios";
import { ArrowLeftRight, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VietQR } from "vietqr";

const BankingTopup: React.FC = () => {
  const [exchangeRate, setExchangeRate] = useState(28000);
  const [rateLastUpdateDate, setRateLastUpdateDate] = useState("01/01/2020");
  const [topupId, setTopupId] = useState();

  const [firstInput, setFirstInput] = useState<string>("");
  const [secondInput, setSecondInput] = useState<string>("");
  const [qrCode, setQRCode] = useState<string>("");

  const transformDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`https://www.vietcombank.com.vn/api/exchangerates?date=${today}`)
      .then((response) => {
        setExchangeRate(response.data.Data[10].sell);
        setRateLastUpdateDate(transformDate(response.data.Date));
      })
      .catch((error) => {
        console.error("Error fetching exchange rate:", error);
      });

    CustomAxios.post("/transactions/top-up")
      .then((response) => {
        setTopupId(response.data.topup.id);
      })
      .catch((error) => {
        console.error("Error create transaciton: ", error);
      });
  }, []);

  const handleFirstInputChange = (e: any) => {
    const value = e.target.value;
    setFirstInput(value);
    setSecondInput(
      value
        ? String(Intl.NumberFormat("en-US").format(exchangeRate * value))
        : ""
    );
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

  const handleSubmit = () => {
    const body = {
      amount: Number(firstInput),
    };
    CustomAxios.post(`/transactions/top-up/update-china/${topupId}`, body)
      .then((response) => {
        if (response.status == 200)
          toast.success("Yêu cầu nạp tiền của bạn đang được xử lý");
        else toast.error("Something went wrong");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  let vietQR = new VietQR({
    clientID: "de8a0804-a76d-41e5-8ad6-31503ce7d5f4",
    apiKey: "17c29f09-4ea2-4417-b9c2-7f020d35de42",
  });

  // list banks are supported create QR code by Vietqr
  // vietQR
  //   .getBanks()
  //   .then((banks:any) => {
  //     console.log(banks);
  //   })
  //   .catch((err: any) => {});

  // list templates are supported by Vietqr
  // vietQR
  //   .getTemplate()
  //   .then((data: any) => {
  //     console.log(data);
  //   })
  //   .catch((err: any) => {});

  // create QR code from data
  vietQR
    .genQRCodeBase64({
      bank: "970436",
      accountName: "DO VAN CHIEN",
      accountNumber: "0021002006288",
      amount: `${Number(firstInput) * exchangeRate}`,
      // memo: `Nap topup ${topupId}`, // remove message
      template: "compact",
    })
    .then((data: any) => {
      // console.log("data:", data.data.data.qrDataURL);
      setQRCode(data.data.data.qrDataURL);
    })
    .catch((err: any) => {});

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Vui lòng chuyển tiền theo thông tin dưới đây:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm text-[#626363]">Ngân hàng:</p>
          <b className="text-base">VietcomBank</b>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-[#626363]">Tên chủ thẻ:</p>
          <div className="flex gap-2">
            <b className="text-base">DO VAN CHIEN</b>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleCopy("DO VAN CHIEN")}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-[#626363]">Số tài khoản:</p>
          <div className="flex gap-2">
            <b className="text-base">0021 002 006 288</b>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleCopy("0021 002 006 288")}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* <div className="space-y-1">
          <p className="text-sm text-[#626363]">Nội dung chuyển khoản:</p>
          <div className="flex gap-2">
            <b className="text-base">{`Nap topup ${topupId}`}</b>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleCopy("Nap topup")}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
          </div>
        </div> */}
        <div className="flex gap-5">
          <div className="w-1/2 flex border rounded-lg items-center">
            <div className="w-5/6">
              <Input
                className="border-none focus-visible:outline-none focus-visible:ring-0"
                type="number"
                placeholder="Enter the amount"
                value={firstInput}
                onChange={handleFirstInputChange}
              />
            </div>
            <span className="text-gray-500 ml-2">CNY</span>
          </div>
          <ArrowLeftRight className="mt-1" />
          <div className="w-1/2 flex border items-center">
            <div className="w-5/6">
              <Input
                className="border-none focus-visible:outline-none focus-visible:ring-0"
                value={secondInput}
                readOnly
              />
            </div>
            <span className="text-gray-500 ml-2">VND</span>
          </div>
        </div>
        <img src={qrCode} className="w-[200px]" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit}>Submit</Button>
        <div className="ml-auto text-xs text-right italic">
          <div>{`Tỉ giá chuyển đổi: 1 USD = ${new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(exchangeRate)} VND`}</div>
          {/* <div>{`Tỉ giá chuyển đổi: 1 USD = ${new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(24880)} VND`}</div> */}
          <div>{`Ngày cập nhật: ${rateLastUpdateDate}`}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BankingTopup;
