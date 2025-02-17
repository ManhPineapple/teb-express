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
import {
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
} from "@/constants/packages";
import { cancelPackages, getListPackages } from "@/services/packages";
import { usePackageStore } from "@/store/tableStore";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ModalCancelProps = {
  selectedRowsLabel: any[];
};
export function ModalCancelPackages({ selectedRowsLabel }: ModalCancelProps) {
  const [open, setOpen] = useState(false);
  //   const handleConfirm = async () => {
  //     try {
  //       const result = await cancelPackages(ids);
  //       console.log("Packages cancelled successfully", result);
  //       toast.success("Packages cancelled successfully");
  //       setOpen(false);
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 3000);
  //     } catch (error) {
  //       console.error("Failed to cancel packages:", error);
  //     }
  //   };

  const handleCancel = async () => {
    const selectedInvalid = selectedRowsLabel.filter(
      (ele) =>
        ele.status_string !== PACKAGE_STATUS_CREATED_TEXT &&
        ele.status_string !== PACKAGE_STATUS_PENDING_PICKUP_TEXT
    );

    console.log("selectedInvalid:", selectedInvalid);

    if (selectedInvalid.length > 0) {
      let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number);
      if (codeSelectedInvalid.length > 3) {
        codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), "..."];
      }
      setOpen(false);

      return toast.error(
        `Đơn hàng ${codeSelectedInvalid.join(", ")} không thể hủy đơn.`,
        {
          autoClose: 5000,
        }
      );
    }

    const ids = selectedRowsLabel.map((item) => item.id);
    const order_number = selectedRowsLabel.map((item) => item.order_number);

    const payload = {
      ids: ids,
    };

    try {
      const result = await cancelPackages(payload);

      if (!result || !result.success) {
        return toast.error(result.message, {
          autoClose: 3000,
        });
      }

      toast.success(`Hủy đơn: ${order_number} thành công`, {
        autoClose: 3000,
      });
      setOpen(false);
      const { setPackages } = usePackageStore.getState();
      const newPackages = await getListPackages(
        1,
        50,
        "",
        "",
        undefined,
        undefined,
        undefined
      );
      setPackages(newPackages.packages);
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình hủy đơn.", {
        autoClose: 3000,
      });
    }
  };

  console.log("selected:", selectedRowsLabel);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs md:text-sm bg-[#fff1f0] text-[#f5222d] hover:bg-[#fff]"
        >
          <CircleX className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm cancel</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            The total number of orders currently selected is{" "}
            {selectedRowsLabel.length}. Are you sure you want to cancel the
            order?
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-[#00978c] text-[#fff]"
            onClick={handleCancel}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
