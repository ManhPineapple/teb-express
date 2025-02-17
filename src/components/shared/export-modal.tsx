import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FolderUp } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};

export default function ExportModal({ renderModal }: TPopupModalProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const closeExportModal = () => setIsExportModalOpen(false);

  return (
    <>
      <Button
        className="text-xs md:text-sm"
        onClick={() => setIsExportModalOpen(true)}
      >
        <FolderUp className="mr-2 h-4 w-4" /> Export
      </Button>

      <Modal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        className={"!bg-background !px-1"}
      >
        <ScrollArea className="h-[80dvh] px-6">
          {renderModal(closeExportModal)}
        </ScrollArea>
      </Modal>
    </>
  );
}
