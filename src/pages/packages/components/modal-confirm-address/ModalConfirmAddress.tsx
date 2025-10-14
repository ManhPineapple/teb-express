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
import { validateAddress } from "@/services/packages";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type AddressProps = {
  add: string;
  id: number;
};

export function ModalConfirmAddress({ add, id }: AddressProps) {
  const [open, setOpen] = useState(false);

  const handleConfirmAddress = async () => {
    const params = {
      ids: [id],
      coupon_user_id: null,
    };

    try {
      const res = await validateAddress(params);
      if (res.success) {
        toast.success("Xác thực địa chỉ thành công");
      }
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Lỗi xử lý kiện hàng:", err);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriangleAlert
          color="#ffd591"
          absoluteStrokeWidth
          className="w-5 h-5 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kiểm tra địa chỉ</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 bg-[#f6f7f7] p-4 text-[#17191d] font-bold">
          <div className="grid flex-1 gap-2">Địa chỉ:</div>
          <div>{add}</div>
        </div>
        <div className="text-sm">
          Bạn có chắc đây là địa chỉ hợp lệ không? Vui lòng xác nhận!
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose>
            <Button type="button" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirmAddress}
            className="bg-[#00978c]"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
