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
import { cancelPackages } from "@/services/packages";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ModalCancelProps = {
  ids: number[];
};
export function ModalCancel(ids: ModalCancelProps) {
  const [open, setOpen] = useState(false);
  const handleConfirm = async () => {
    try {
      const result = await cancelPackages(ids);
      if (result.success) toast.success("Hủy đơn hàng thành công");
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Failed to cancel packages:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#fff] text-black border-[#e1e2e2] hover:text-[#00978c] hover:bg-[#fff] border"
        >
          Hủy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận hủy</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            Bạn có chắc muốn hủy đơn hàng này?
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-[#00978c] text-[#fff]"
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
