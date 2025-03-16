import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface TabProps {
  label: string;
  index: number;
  setSelectedIndex: (index: number) => void;
  selectedIndex: number;
}

const initTabs = [
  "All",
  "Purchased",
  "Pending",
  "Pre-Transit",
  "In-Transit",
  "Delivered",
  "Alert",
  "Canceled",
  "Expired",
  "Undelivered",
  "Archived",
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
        initTabs[index] === "All" ? "" : initTabs[index]
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
      Pending: "pending",
      Purchased: "purchased",
      "Pre-Transit": "pre-transit",
      "In-Transit": "in-transit",
      Delivered: "delivered",
      Alert: "alert",
      Canceled: "canceled",
      Expired: "expired",
      Undelivered: "undelivered",
      Archived: "archived",
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
        (statusObj: { status: string }) => statusObj.status === mappedStatus
      );
      let count = foundStatus ? foundStatus.count : 0;

      if (tab === "All") count = totalCount;
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