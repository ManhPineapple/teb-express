import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createPendingTransaction } from "@/services/bill";
import { Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LianlianTopup: React.FC = () => {
  const receiveTopupInfoEmail = "example@gmail.com";
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");

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

  const handleSubmit = async () => {
    const body = {
      type: 8,
      transaction_id: transactionId,
      amount: amount,
    };

    const res = await createPendingTransaction(body);
    if (res.success) toast.success("Yêu cầu của bạn đang được xử lý");
  };

  return (
    <Card>
      <CardHeader>Topup thông qua LianLian</CardHeader>

      <CardContent className="space-y-2">
        <CardDescription className="flex items-center">
          Vui lòng chuyển tiền tới địa chỉ:
          <strong className="ml-1">{receiveTopupInfoEmail}</strong>
          <Copy
            className="w-4 h-4 cursor-pointer ml-2"
            onClick={() => handleCopy(receiveTopupInfoEmail)}
          />
        </CardDescription>
        <CardDescription>
          Copy <strong> Transaction ID </strong> rồi nhập vào ô phía dưới.
        </CardDescription>
        <CardDescription>
          Nhấn nút <strong> Xác nhận </strong> để nạp Topup.
        </CardDescription>

        <div className="flex items-center">
          <CardDescription className="w-1/4 text-center">
            Transaction ID:
          </CardDescription>
          <Input
            className="w-2/3 focus-visible:outline-none focus-visible:ring-0"
            placeholder="Nhập Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <CardDescription className="w-1/4 text-center">
            Nhập số tiền:
          </CardDescription>
          <div className="w-2/3 flex border rounded-lg items-center">
            <div className="w-5/6">
              <Input
                className="border-none focus-visible:outline-none focus-visible:ring-0"
                placeholder="Nhập số tiền"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <span className="text-gray-500 ml-2">USD</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit}>Submit</Button>
        <div className="w-2/3 ml-auto text-xs text-right italic">
          Thời gian xử lý khoảng 15 phút. Nếu tiền không được chuyển vào topup
          sau thời gian này, vui lòng liên hệ bộ phận support của AnanBay để
          được hỗ trợ.
        </div>
      </CardFooter>
    </Card>
  );
};

export default LianlianTopup;
