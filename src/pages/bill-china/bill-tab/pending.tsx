import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { PendingTable } from "../components/data-table/pending-table";

const PendingTab: React.FC = () => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="">
          <PendingTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTab;
