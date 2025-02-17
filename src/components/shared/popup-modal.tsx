import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};

export default function PopupModal({ renderModal }: TPopupModalProps) {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const closeAddNewModal = () => setIsAddNewModalOpen(false);

  return (
    <>
      <Button
        className="text-xs md:text-sm bg-[#9e7bb5]"
        onClick={() => setIsAddNewModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Order
      </Button>

      <Modal
        isOpen={isAddNewModalOpen}
        onClose={closeAddNewModal}
        className={"!bg-background !px-1"}
      >
        <ScrollArea className="h-[80dvh] px-6">
          {renderModal(closeAddNewModal)}
        </ScrollArea>
      </Modal>
    </>
  );
}
