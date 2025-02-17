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
      if (res.data.success) {
        toast.success("Validate address successfully");
      }
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error processing package:", err);
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
          <DialogTitle>Check address</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 bg-[#f6f7f7] p-4 text-[#17191d] font-bold">
          <div className="grid flex-1 gap-2">Address:</div>
          <div>{add}</div>
        </div>
        <div className="text-sm">
          Are you sure this is a valid address? Please kindly confirm!
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirmAddress}
            className="bg-[#00978c]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
