import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { processPackage } from "@/services/packages";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function ModalCreateTracking({ sumFee }: { sumFee: () => number }) {
  const { package_id } = useParams<{ package_id: any }>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const idss = parseInt(package_id, 10);

  const handleActionWayBill = async () => {
    setLoading(true);
    const params = {
      ids: [idss],
      coupon_user_id: null,
    };

    try {
      const res = await processPackage(params);
      if (res.success) {
        toast.success(
          "The order is being processed and tracking is created, processing information will be updated later"
        );
      }
    } catch (err: any) {
      console.error("Error processing package:", err);
      toast.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#00978c] text-[#fff]">
          Tạo theo dõi đơn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận tạo theo dõi đơn</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            Bạn có 1 đơn hàng đang được chọn. Tổng số lượng là: ${sumFee()}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-[#00978c] text-[#fff]"
            onClick={handleActionWayBill}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tạo theo dõi đơn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
