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
  const idss = parseInt(package_id, 10);

  const handleActionWayBill = async () => {
    const params = {
      ids: [idss],
      coupon_user_id: null,
    };

    try {
      const res = await processPackage(params);
      if (res.success)
        toast.success(
          "The order is being processed and tracking is created, processing information will be updated later"
        );
    } catch (err: any) {
      console.error("Error processing package:", err);
      toast.error(err.response.data || err.message);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#00978c] text-[#fff]">
          Create tracking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm create tracking</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            You have 1 order being selected. Total amount is ${sumFee()}
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
            onClick={handleActionWayBill}
          >
            Create tracking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
