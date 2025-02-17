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
        toast.success("All addresses validated successfully!");
      } else if (successCount > 0) {
        toast.warn(
          `Successfully validated ${successCount} addresses. Some validations failed.`
        );
      } else {
        toast.error("All address validations failed.");
      }

      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error processing addresses:", err);
      toast.error("An error occurred while validating addresses.");
      setOpen(false);
    }
  };

  const order_number = selectedRowsLabel
    .filter((item) => item.validate_address === 0)
    .map((item) => item.order_number);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs md:text-sm bg-[#ffd591] hover:bg-[#fff] text-yellow-800"
          disabled={order_number.length === 0}
        >
          <TriangleAlert className="mr-2 h-4 w-4" />
          Confirm Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check address</DialogTitle>
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
