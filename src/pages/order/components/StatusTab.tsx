import React, { useState } from "react";

interface TabProps {
  label: string;
  index: number;
  setSelectedIndex: (index: number) => void;
  selectedIndex: number;
}

const Tab: React.FC<TabProps> = ({
  label,
  index,
  setSelectedIndex,
  selectedIndex,
}) => {
  const isSelected = selectedIndex === index;
  return (
    <button
      className={`px-4 py-2 focus:outline-none ${
        isSelected
          ? "text-blue-500 border-b-2 border-blue-500"
          : "text-gray-500"
      }`}
      onClick={() => setSelectedIndex(index)}
    >
      {label}
    </button>
  );
};

const OrderTabs: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = ["All", "Process", "In-Transit", "Delivered"];

  return (
    <div>
      <div className="flex space-x-4 border-b mx-8 mt-5">
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

export default OrderTabs;
