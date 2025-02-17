import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FolderDown } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};

export default function ImportModal({ renderModal }: TPopupModalProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const closeImportModal = () => setIsImportModalOpen(false);

  return (
    <>
      <Button
        className="text-xs md:text-sm bg-[#776ca8]"
        onClick={() => setIsImportModalOpen(true)}
      >
        <FolderDown className="mr-2 h-4 w-4" /> Import
      </Button>

      <Modal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        className={"!bg-background !px-1"}
      >
        <ScrollArea className="h-[80dvh] px-6">
          {renderModal(closeImportModal)}
        </ScrollArea>
      </Modal>
    </>
  );
}
