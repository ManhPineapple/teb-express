import { Button } from "@/components/ui/button";
import {
  MAP_COUPON_TEXT
} from "@/constants/setting/coupon";
import { getListCoupons } from "@/services/settings/coupon";
import { format } from "date-fns";
import { Search, Ticket } from "lucide-react";
import React, { useState } from "react";
import { ModalDetailCoupon } from "./ModalDetailCoupon";

type Coupon = {
  id: number;
  code: string;
  point: number;
  type: number;
  min_apply: number;
  max_apply: number;
  start_date: string;
  end_date: string;
  value: number;
  quantity: number;
  used: number;
};

const ListCoupon: React.FC = () => {
  const [listCoupon, setListCoupon] = useState<Coupon[]>([]);

  React.useEffect(() => {
    const fetchListCoupon = async () => {
      try {
        const coupons = await getListCoupons();
        setListCoupon(coupons.coupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchListCoupon();
  }, []);

  return (
    <>
      <div className="bg-[#f6f7f7] relative">
        <Search className="absolute top-[1.9rem] left-[0.6rem] mx-5 pl-2" />
        <input
          type="search"
          placeholder="Search coupon code"
          className="my-5 border border-gray-300 p-2 rounded w-full mx-7 px-8"
        />
      </div>
      <div className="grid grid-cols-2 bg-[#f6f7f7]">
        {listCoupon!.length > 0 ? (
          listCoupon?.map((item) => (
            <div className="flex bg-[url('http://localhost:6969/img/coupon_bg_image.4df680cb.png')] h-[168px] rounded-[8px] bg-cover items-center gap-5 justify-between m-5">
              <div className="icon w-40 pl-[66px]">
                <Ticket className="w-10 h-10" />
              </div>
              <div className="text-left">
                <div className="flex gap-1">
                  <span className="text-[#13c2c2] bg-[#e6fffb] border-[#87e8de] border py-0.5 px-3 rounded-2xl text-xs">
                    {item.code}
                  </span>
                  <span className="text-[#898a8a] bg-[#f6f7f7] border-[#e1e2e2] border py-0.5 px-3 rounded-2xl text-xs">
                    {item.point} point
                  </span>
                </div>
                <h2 className="font-[700] text-[20px] leading-[28px] text-[#111212] my-2">
                  {`${MAP_COUPON_TEXT[item.type]} $${item?.value.toFixed(2)}`}
                </h2>
                {item.min_apply > 0 && (
                  <p className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
                    Giá trị áp dụng tối thiểu: ${item.min_apply}
                  </p>
                )}
                <p className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
                  HSD: {format(new Date(item.end_date), "dd/MM/yyyy")}
                </p>
              </div>
              <div className="action text-right mr-6">
                <Button className="mb-3 bg-[#00978c] font-bold">Buy</Button>
                <ModalDetailCoupon coupon={item} />
              </div>
            </div>
          ))
        ) : (
          <p className="mx-auto">No results</p>
        )}
      </div>
    </>
  );
};

export default ListCoupon;
