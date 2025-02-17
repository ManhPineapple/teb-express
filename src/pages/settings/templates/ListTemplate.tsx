import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";
import ImportTemplateForm from "./ModalCreateImportTemplate";

const ListTemplate: React.FC = () => {
  return (
    <div className="page-header flex justify-between px-6 pt-0 pb-[18px] mt-5">
      <div className="w-full">
        <h1 className="font-bold text-2xl text-[#17191d]">List templates</h1>
      </div>
      <div className="w-1/2 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="btn btn-primary flex items-center bg-blue-500 text-white p-2 rounded-xl px-4"
            >
              <Plus /> Import Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="border-b pb-4 border-slate-500">
                Add product
              </DialogTitle>
            </DialogHeader>
            <ImportTemplateForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ListTemplate;
