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
import { useState } from "react";
import { toast } from "react-toastify";
import { TriangleAlert } from "lucide-react";

type AddressProps = {
  selectedRowsLabel: any[];
};

export function ModalConfirmAddresses({ selectedRowsLabel }: AddressProps) {
  const [open, setOpen] = useState(false);

  const handleConfirmAddress = async () => {
    const paramsList = selectedRowsLabel.map((item) => ({
      ids: [item.id],
      coupon_user_id: null,
    }));

    try {
      const results = await Promise.all(
        paramsList.map((params) => validateAddress(params))
      );

      const successCount = results.filter((res) => res.data.success).length;

      if (successCount === results.length) {
        toast.success("Tất cả địa chỉ đã được xác thực thành công!");
      } else if (successCount > 0) {
        toast.warn(
          `Đã xác thực thành công ${successCount} địa chỉ. Một số địa chỉ không hợp lệ.`
        );
      } else {
        toast.error("Tất cả xác thực địa chỉ đều thất bại.");
      }

      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error processing addresses:", err);
      toast.error("Đã xảy ra lỗi khi xác thực địa chỉ.");
      setOpen(false);
    }
  };

  const order_number = selectedRowsLabel
    .filter((item) => item.validate_address === 0)
    .map((item) => item.order_number);

  const address = selectedRowsLabel
    .filter((item) => item.validate_address === 0)
    .map((item) => item.address_1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs md:text-sm bg-[#ffd591] hover:bg-[#fff] text-yellow-800"
          disabled={order_number.length === 0}
        >
          <TriangleAlert className="mr-2 h-4 w-4" />
          Xác nhận địa chỉ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kiểm tra địa chỉ</DialogTitle>
        </DialogHeader>
        <div className="items-center bg-[#f6f7f7] p-4 text-[#17191d] font-bold">
          <div className="overflow-auto max-h-52">
            {/* {order_number.map((order, index) => (
              <div key={index} className="flex gap-4 justify-between">
                <div>{order}</div>
                <div>{address[index]}</div>
              </div>
            ))} */}

            {order_number.map((order, index) => (
              <div key={index} className="flex gap-4 justify-between">
                <div>{order}</div>
                {/* <div>{address[index]}</div> */}
              </div>
            ))}
          </div>
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
