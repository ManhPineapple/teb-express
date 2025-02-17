import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MAP_COUPON_TEXT } from "@/constants/setting/coupon";
import { format } from "date-fns";
import { CircleAlert, Ticket } from "lucide-react";

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

type DialogCloseButtonProps = {
  coupon: Coupon;
};

export function ModalDetailCoupon({ coupon }: DialogCloseButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer flex">
          <CircleAlert className="p-1" />
          <div>More</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex">
            <div>
              <Ticket className="w-10 h-10" />
            </div>
            <div className="header_title">
              <h2 className="font-[700] text-[20px] leading-[28px] text-[#111212] my-2">
                {`${MAP_COUPON_TEXT[coupon.type]} $${coupon?.value.toFixed(2)}`}
              </h2>
              <span className="text-[12px] font-normal leading-[16px] mb-0 text-[#313232]">
                Coupon giảm giá ($)
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className=" border-y">
          <div className="grid grid-cols-2 flex-1 gap-2 my-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Code:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {coupon.code}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Start date:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {format(new Date(coupon.start_date), "dd/MM/yyyy - HH:mm:ss")}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              End date:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {format(new Date(coupon.end_date), "dd/MM/yyyy - HH:mm:ss")}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Minimum Value:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {coupon.min_apply}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Discount Value:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {coupon.value}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Used:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              {coupon.used}
            </div>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-2 mb-3">
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#898a8a]">
              Status:
            </div>
            <div className="text-[14px] font-normal leading-[20px] mb-0 text-[#313232]">
              mcbvdfg
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <div className="bg-[#fff1f0] text-[#f5222d] py-3 px-36 rounded-xl">
              Close
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
