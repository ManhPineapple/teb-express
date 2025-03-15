import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface TabProps {
  label: string;
  index: number;
  setSelectedIndex: (index: number) => void;
  selectedIndex: number;
}
const convertValue: { [key: string]: string } = {
  "all": "tất cả",
  "pending": "đang chờ xử lý",
  "purchased": "đã mua",
  "pre-Transit": "chờ vận chuyển",
  "in-Transit": "đang vận chuyển",
  "delivered": "đã giao hàng",
  "alert": "cảnh báo",
  "canceled": "đã hủy",
  "expired": "hết hạn",
  "undelivered": "không giao được",
  "archived": "đã lưu trữ",
};
const convertValueIntoEnglish: { [key: string]: string } = {
  "tất cả": "all",
  "Đang chờ xử lý": "pending",
  "Đã mua": "purchased",
  "Chờ vận chuyển": "pre-Transit",
  "Đang vận chuyển": "in-Transit",
  "Đã giao hàng": "delivered",
  "Cảnh báo": "alert",
  "Đã hủy": "canceled",
  "Hết hạn": "expired",
  "Không giao được": "undelivered",
  "Đã lưu trữ": "archived",
};
const initTabs = [
  "Tất cả",
  "Đã mua",
  "Đang chờ xử lý",
  "Chờ vận chuyển",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Cảnh báo",
  "Đã hủy",
  "Hết hạn",
  "Không giao được",
  "Đã lưu trữ",
];

const Tab: React.FC<TabProps> = ({
  label,
  index,
  setSelectedIndex,
  selectedIndex,
}) => {
  const isSelected = selectedIndex === index;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSelectedIndex(index);
    if (index === 0) {
      searchParams.delete("status");
    } else {
      searchParams.set(
        "status",
        initTabs[index] === "Tất cả" ? "" : convertValueIntoEnglish[initTabs[index]]
      );
      searchParams.set("page", "1");
    }
    setSearchParams(searchParams);
    window.location.reload();
  };

  return (
    <button
      className={`px-2 py-4 focus:outline-none text-sm font-medium whitespace-nowrap ${isSelected
        ? "text-blue-500 border-b-2 border-blue-500"
        : "text-gray-500"
        }`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

const PackageTabs: React.FC<{ count: any }> = ({ count }) => {
  const [searchParams] = useSearchParams();
  const initIndex = initTabs.findIndex((e) => e === searchParams.get("status"));
  const [selectedIndex, setSelectedIndex] = useState(
    initIndex === -1 ? 0 : initIndex
  );
  const [tabs, setTabs] = useState(initTabs);
  const removeCount = (tab: string) => {
    return tab.replace(/\s*\(\d+\)$/, "");
  };

  useEffect(() => {
    if (!count.status_count) return;
    const statusCount = count;
    const statusMapping: Record<string, string> = {
      "Tất cả": "tất cả",
      "Đang chờ xử lý": "đang chờ xử lý",
      "Đã mua": "đã mua",
      "Chờ vận chuyển": "chờ vận chuyển",
      "Đang vận chuyển": "đang vận chuyển",
      "Đã giao hàng": "đã giao hàng",
      "Cảnh báo": "cảnh báo",
      "Đã hủy": "đã hủy",
      "Hết hạn": "hết hạn",
      "Không giao được": "không giao được",
      "Đã lưu trữ": "đã lưu trữ",
    };

    const totalCount = statusCount.status_count.reduce(
      (sum: number, countObj: any) => {
        return sum + (countObj.count || 0);
      },
      0
    );

    const updatedTabs = tabs.map((tab) => {
      tab = removeCount(tab);
      const mappedStatus = statusMapping[tab] || tab.toLowerCase();
      const foundStatus = statusCount.status_count.find(
        (statusObj: { status: string }) => convertValue[statusObj.status] === mappedStatus
      );
      let count = foundStatus ? foundStatus.count : 0;

      if (tab === "Tất cả") count = totalCount;
      return `${tab} (${count})`;
    });

    setTabs(updatedTabs);
  }, [count]);

  return (
    <div className="max-w-full overflow-auto">
      <div className="flex space-x-4 border-y">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab}
            index={index}
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default PackageTabs;
