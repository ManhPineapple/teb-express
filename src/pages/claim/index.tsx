import React from "react";
import { ListClaimTable } from "./components/ListClaimTable";
import ModalAddClaim from "./components/ModalAddClaim";
import PageHead from "@/components/shared/page-head";

const ListClaim: React.FC = () => {
  return (
    <>
      <PageHead title="Claims | Ananbay" />
      <div className="page-header flex justify-between px-6 pt-0 pb-[18px] mt-5">
        <div className="w-full">
          <h1 className="font-bold text-2xl text-[#17191d]">List claims</h1>
        </div>
        <div className="w-1/2 flex justify-end">
          <ModalAddClaim />
        </div>
      </div>
      <ListClaimTable />
    </>
  );
};

export default ListClaim;
