// import { numFormatter } from "@core/utils/formatter";
// import { capitalize } from "@core/utils/string";

// find library for 2 func later
function numFormatter(count: number) {
  console.log(count);
  throw new Error("Function not implemented.");
}

function capitalize(text: string) {
  console.log(text);
  throw new Error("Function not implemented.");
}

import React from "react";
import { COUPON_STATUS_TAB } from "../constants";

interface CouponStatusTabProps {
  value: string | string[];
  countStatus: Array<{ key: string; value: number }>;
  onInput: (value: string) => void;
  onClick: (value: string) => void;
}

const CouponStatusTab: React.FC<CouponStatusTabProps> = ({
  value,
  countStatus,
  onInput,
  onClick,
}) => {
  const getTabs = () => {
    return COUPON_STATUS_TAB.map((item) => {
      let count = 0;
      countStatus.forEach((obj) => {
        if (obj.key === item.value) {
          count = obj.value;
        }
      });

      const countText = count ? ` (${numFormatter(count)})` : " (0)";
      return {
        id: `item_nav_${item.value}`,
        value: item.value,
        text: capitalize(item.text) + countText,
        active: item.value === value,
      };
    });
  };

  const tabs = getTabs();

  const handleClick = (item: string) => {
    if (value !== item) {
      onInput(item);
      onClick(item);
    }
  };

  return (
    <div className="p-tabs nav-tabs-horizontal mb-6" id="tab-coupon">
      <ul role="tablist" className="nav nav-tabs nav-tabs-line flex">
        {tabs.map((item) => (
          <li role="presentation" className="nav-item" key={item.id}>
            <a
              href="#"
              className={`nav-link ${item.active ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.value);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponStatusTab;