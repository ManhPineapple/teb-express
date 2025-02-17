import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAP_STATUS_CLASS_NAME } from "@/constants/packages";
import { format } from "date-fns";
import { ChevronsDownUp, ChevronsUpDown, Copy, Link } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Logs, Package } from "..";

type CombinedData = {
  packages: Package[];
  logs: Logs[];
  logCount: any;
};

export function TrackingFilter({ packages, logs, logCount }: CombinedData) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [filteredShipments, setFilteredShipments] =
    useState<Package[]>(packages);
  const initTabs = [
    "All",
    "Pre-Transit",
    "In-Transit",
    "Delivered",
    "Alert",
    "Canceled",
    "Expired",
    "Undelivered",
    "Archived",
  ];
  const [tabs, setTabs] = useState(initTabs);

  const removeCount = (tab: string) => {
    return tab.replace(/\s*\(\d+\)$/, "");
  };

  useEffect(() => {
    if (removeCount(selectedTab.toLowerCase()) === "all") {
      setFilteredShipments(packages);
    } else {
      setFilteredShipments(
        packages.filter(
          (pkg) => pkg.status_string === removeCount(selectedTab.toLowerCase())
        )
      );
    }
  }, [selectedTab]);

  useEffect(() => {
    const fetchData = async () => {
      const statusMapping: any = {
        "Pre-Transit": "pre-transit",
        "In-Transit": "in-transit",
        Delivered: "delivered",
        Alert: "alert",
        Canceled: "canceled",
        Expired: "expired",
        Undelivered: "undelivered",
        Archived: "archived",
      };
      const updatedTabs = tabs.map((tab) => {
        tab = removeCount(tab);
        const mappedStatus = statusMapping[tab] || tab.toLowerCase();
        const foundStatus = logCount.status_count.find(
          (statusObj: { status: any }) => statusObj.status === mappedStatus
        );
        let count = foundStatus ? foundStatus.count : 0;

        if (tab === "All") count = logCount.count;
        return `${tab} (${count})`;
      });

      setTabs(updatedTabs);
    };

    fetchData();
  }, [logCount]);

  const toggleRow = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const handleCopyDetail = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <>
      <div className="tabs mb-3 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab tab-bordered mx-3 text-sm capitalize${selectedTab === tab ? " tab-active text-[#00b4c3] border-b-[#3f51b5] border-b pb-3 capitalize" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">TRACKING CODE</TableHead>
            <TableHead>LAST MILE TRACKING NO.</TableHead>
            <TableHead>ORIGIN / DESTINATION</TableHead>
            <TableHead className="">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShipments.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow>
                <TableCell className="font-medium w-[250px]">
                  <div className="mb-2">{item.package_code.code}</div>
                  <span
                    className={`rounded-2xl capitalize ${
                      item?.status_string
                        ? MAP_STATUS_CLASS_NAME[item.status_string].className
                        : "N/A"
                    }`}
                  >
                    {item.status_string}
                  </span>
                </TableCell>
                <TableCell className="w-[300px]">
                  {item.tracking && item.tracking.tracking_number
                    ? item.tracking.tracking_number
                    : ""}
                </TableCell>
                <TableCell className="w-[200px]">
                  {`VN -> ${item.country_code}`}
                </TableCell>
                <TableCell className="">
                  {logs.find((log) => log.package_id === item.id)
                    ?.description || ""}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => toggleRow(item.id)}
                    className="hover:text-blue-700"
                  >
                    {!expandedRows.includes(item.id) ? (
                      <ChevronsUpDown className="h-4 w-4" />
                    ) : (
                      <ChevronsDownUp className="h-4 w-4" />
                    )}
                  </button>
                </TableCell>
              </TableRow>
              {expandedRows.includes(item.id) && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="bg-gray-100 pt-5 px-10 pb-20"
                  >
                    <div>
                      <div className="">
                        <div className="flex justify-between">
                          <p className="mb-5 font-semibold text-2xl capitalize">
                            {item.status_string}
                          </p>
                          <div className="flex gap-5 mt-5">
                            <div
                              className="flex gap-2 cursor-pointer"
                              onClick={() =>
                                handleCopyDetail(`Ananbay tracking: ${item.package_code.code}
                                Last mile tracking no.: ${item.tracking ? item.tracking.tracking_number : ""}
                                Status: ${item.status_string.charAt(0).toUpperCase() + item.status_string.slice(1)}
                                Country: VN -> ${item.country_code}
                                Origin:\n`)
                              }
                            >
                              <Copy className="h-4 w-4" />
                              <div>Copy Detail</div>
                            </div>
                            <div
                              className="flex gap-2 cursor-pointer"
                              onClick={() =>
                                handleCopyDetail(
                                  `http://ship.ananbay.net/tracking?nums=${item.package_code.code}`
                                )
                              }
                            >
                              <Link className="h-4 w-4" />
                              <div>Copy Link</div>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                      <div className="mt-5 font-semibold text-[#313232]">
                        {format(
                          new Date(
                            logs.find((log) => log.package_id === item.id)
                              ?.ship_time || ""
                          ),
                          "dd/MM/yyyy"
                        )}
                      </div>
                      <div className="mt-2 ml-10">
                        <div className="flex gap-6">
                          <div>
                            {format(
                              new Date(
                                logs.find((log) => log.package_id === item.id)
                                  ?.ship_time || ""
                              ),
                              "HH:mm:ss"
                            )}
                          </div>
                          <div className="font-semibold text-[#313232]">
                            {logs.find((log) => log.package_id === item.id)
                              ?.description || ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
