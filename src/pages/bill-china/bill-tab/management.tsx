import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { ManagementTable } from "../components/data-table/management-table";

const ManagementTab: React.FC = () => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="">
          <ManagementTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementTab;
