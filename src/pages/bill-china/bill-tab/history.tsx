import { Card, CardContent } from "@/components/ui/card";
import {
  TransactionLogAffiliate,
  TransactionLogTypePay,
  TransactionLogTypePayoneer,
  TransactionLogTypePingPong,
  TransactionLogTypeRefund,
  TransactionLogTypeTopup,
  TransactionStatusFailure,
  TransactionStatusProcess,
  TransactionStatusSuccess,
} from "@/constants/bill";
import { getTransactionsChina } from "@/services/bill";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BillDatePickerWithRange } from "../components/bill-datepicker";

type Bill = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  shipping_fee: number;
  extra_fee: number;
  status: number;
  user_id: number;
  package: any;
};

type BillTransaction = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  admin_id: number;
  bill_id: number;
  bill: Bill;
  amount: number;
  description: string;
  type: number;
  status: number;
  user: any;
  admin: any;
};

export type Status = {
  [key: number]: { text: string; className: string };
};

const HistoryTab: React.FC = () => {
  const [transactions, setTransactions] = useState<BillTransaction[] | null>(
    []
  );
  const [selectedType, setSelectedType] = useState<number | undefined>();

  const typeTopup = TransactionLogTypeTopup;
  const typePingPong = TransactionLogTypePingPong;
  const typePayoneer = TransactionLogTypePayoneer;
  const typePay = TransactionLogTypePay;
  const typeRefund = TransactionLogTypeRefund;
  const typeAffiliate = TransactionLogAffiliate;

  const Process = TransactionStatusProcess;
  const Success = TransactionStatusSuccess;
  const Failure = TransactionStatusFailure;

  const statusText: Status = {
    [Process]: { text: "Pending", className: "text-[#aaabab]" },
    [Success]: { text: "Success", className: "text-[#48be78]" },
    [Failure]: { text: "Failed", className: "text-[#f5222d]" },
  };
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const payments = await getTransactionsChina(
          1,
          50,
          searchParams,
          selectedType
        );
        setTransactions(payments.transactions);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchData();
  }, [selectedType]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value);
    setSelectedType(selectedValue !== -1 ? selectedValue : undefined);
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="sm:flex justify-between mt-5 gap-3">
          <div className="mb-4 w-full">
            <select
              className="border p-2 w-full rounded-md"
              onChange={handleSelectChange}
            >
              <option value="-1">Chọn loại giao dịch</option>
              <option value={typeTopup}>Nạp tiền</option>
              <option value={typePay}>Thanh toán</option>
              <option value={typeRefund}>Hoàn tiền</option>
            </select>
          </div>
          <div className="mb-4">
            <BillDatePickerWithRange />
          </div>
        </div>
        {transactions && transactions.length > 0 ? (
          transactions.map((item, i) => (
            <div
              className="flex justify-between transaction-info border-b pb-5"
              key={i}
            >
              <div>
                {/* {item.type === typeRefund || item.type === typeAffiliate ? (
                  <img src={require("@assets/img/rotate-left.svg")} alt="" />
                ) : (
                  <img
                    src={
                      item.type === typeTopup ||
                      item.type === typePayoneer ||
                      item.type === typePingPong
                        ? require("@assets/img/in.svg")
                        : require("@assets/img/out.svg")
                    }
                    alt=""
                  />
                )} */}
                <div>
                  <div className="flex gap-2 font-medium">
                    <div>
                      {item.type === typeTopup ||
                      item.type === typePayoneer ||
                      item.type === typePingPong
                        ? "Nạp tiền vào ví"
                        : item.type === typeRefund ||
                            item.type === typeAffiliate
                          ? "Hoàn tiền cho hóa đơn"
                          : "Thanh toán hóa đơn"}
                    </div>
                    {item.bill && (
                      <Link
                        to={{
                          pathname: `/bill/detail/${item.bill.code}`,
                        }}
                      >
                        <div className="text-[#006a5e]">{item?.bill.code}</div>
                      </Link>
                    )}
                  </div>
                  <span className="text-sm text-[#626363]">
                    {new Date(item.created_at).toLocaleDateString("us-US", {
                      weekday: "long", // Adjust "long" to "short" or "narrow" for different weekday formats
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(item.created_at).toLocaleTimeString("us-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">
                  {item.type === typePayoneer || item.type === typePingPong
                    ? `+ $ ${Math.abs(item.amount)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : ` ${item.type === typePay ? "-" : "+"} ¥${Math.abs(
                        item.amount
                      )
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                </div>
                <span
                  className={`float-right ${statusText[item.status].className} text-sm`}
                >
                  {statusText[item.status].text}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No transactions available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
