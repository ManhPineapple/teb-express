import { Button } from "@/components/ui/button";
import { ModalUpdate } from "@/components/ui/modal";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};

export default function ModalUpdatePackage({ renderModal }: TPopupModalProps) {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const closeAddNewModal = () => setIsAddNewModalOpen(false);

  return (
    <>
      <Button
        className="text-xs md:text-sm bg-[#fff] text-black border-[#e1e2e2] hover:text-[#00978c] hover:bg-[#fff] border"
        onClick={() => setIsAddNewModalOpen(true)}
      >
        Update
      </Button>

      <ModalUpdate
        isOpen={isAddNewModalOpen}
        onClose={closeAddNewModal}
        className={"!bg-background !px-1"}
      >
        <ScrollArea className="h-[80dvh] px-6">
          {renderModal(closeAddNewModal)}
        </ScrollArea>
      </ModalUpdate>
    </>
  );
}
