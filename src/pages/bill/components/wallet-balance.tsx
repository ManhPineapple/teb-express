// src/components/WalletBalance.tsx
import { ArrowUpRight } from "lucide-react";
import React from "react";

interface WalletBalanceProps {
  balance: number;
  points: number;
  pendingAmount: number;
  user_info: {
    debt_max_amount: number;
    debt_time: string;
    debt_max_day: number;
  };
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  points,
  pendingAmount,
  user_info,
}) => {
  const debit = () => {
    return balance < 0 ? Math.abs(balance) : 0;
  };

  const maxDebitAmoung = () => {
    return user_info ? user_info.debt_max_amount : null;
  };

  const debitDayLeft = () => {
    if (!user_info || !user_info.debt_time || !user_info.debt_max_day) {
      return null;
    }

    let now = new Date().getTime();
    let target = new Date(user_info.debt_time).getTime();
    let daysLeft = user_info.debt_max_day - (now - target) / (24 * 3600 * 1000);
    let text = "0 ngày";
    if (daysLeft >= 1) {
      text = `${Math.floor(daysLeft)} ngày`;
    } else if (daysLeft * 24 >= 1) {
      text = `${Math.floor(daysLeft * 24)} giờ`;
    } else if (daysLeft * 24 * 60 >= 1) {
      text = `${Math.floor(daysLeft * 24 * 60)} phút`;
    }
    return text;
  };

  return (
    <div className="grid grid-cols-3 gap-4 m-10 max-w-full max-sm:grid-cols-1">
      <div className="flex flex-col items-center p-4 bg-blue-100 rounded-xl">
        <span className="text-gray-700">Số dư trong ví</span>
        <span className="text-2xl font-bold">
          $
          {(Math.trunc(balance * 100) / 100)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </span>
        <span className="text-lg text-gray-500">
          Điểm tích lũy: {points} điểm
        </span>
        <a href="setting/coupon">
          <span className="text-xs text-green-600 flex">
            <div>Sử dụng</div> <ArrowUpRight className="w-4 h-4" />
          </span>
        </a>
      </div>
      <div className="flex flex-col items-center p-4 bg-[#fff7e6] rounded-xl">
        <span className="text-gray-700">Tiền chưa thanh toán</span>
        <span className="text-xl font-semibold">
          ${(Math.trunc(debit() * 100) / 100).toFixed(2)}
          <span>(Tối đa: ${maxDebitAmoung()})</span>
          {debitDayLeft() != null && (
            <div className="text-sm font-light">
              Thời gian công nợ còn lại: {debitDayLeft()}
            </div>
          )}
        </span>
      </div>
      <div className="flex flex-col items-center p-4 bg-purple-100 rounded-xl">
        <span className="text-gray-700">Tiền chờ xử lý</span>
        <span className="text-xl font-semibold">
          ${(Math.round(pendingAmount * 100) / 100).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default WalletBalance;
