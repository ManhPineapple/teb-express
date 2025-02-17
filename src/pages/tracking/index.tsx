import { Button } from "@/components/ui/button";
import { getLogs } from "@/services/tracking";
import { CustomAxios } from "@/utils/customAxios";
import { FileSearch } from "lucide-react";
import React, { useState } from "react";
import { TrackingFilter } from "./components/TrackingFilter";
import PageHead from "@/components/shared/page-head";

type SearchSectionProps = {
  ListPackages: any[];
  codes: string[];
};

type Tracking = {
  package_id: number;
  tracking_number: string;
};

type PackageCode = {
  code: string;
};

export type Package = {
  id: number;
  tracking: Tracking;
  country_code: string;
  package_code: PackageCode;
  status_string: string;
  delivered_at: string | null;
  checkin_warehouse_at: string | null;
  alert: number;
};

export type Logs = {
  id: number;
  package_id: number;
  location: string;
  description: string;
  status: string;
  type: number;
  code: string;
  ship_time: string;
  created_at: string;
  updated_at: string;
};

export type TrackingFilters = {
  id: number;
  package_code: PackageCode;
  status_string: string;
  tracking: Tracking;
  country_code: string;
  description: string;
};

const Tracking: React.FC<SearchSectionProps> = () => {
  const [isTextarea, setIsTextarea] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const [packages, setPackages] = useState<Package[]>([]);
  const [logs, setLogs] = useState<Logs[]>([]);
  const [logCount, setLogCount] = useState<any>();

  const handleClick = () => {
    setIsTextarea(true);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    const itemArray = value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setItems(itemArray);
    setIsTextarea(false);
  };

  const track = async () => {
    try {
      const logsPromise = getLogs({ codes: items });
      const countPromise = CustomAxios.post("/packages/logs/count", {
        codes: items,
      });

      const [logsResult, countResult] = await Promise.all([
        logsPromise,
        countPromise,
      ]);

      setPackages(logsResult.packages);
      setLogs(logsResult.logs);
      setLogCount(countResult.data);
    } catch (error) {
      console.error("Error filter tracking:", error);
    }
  };

  return (
    <>
      <PageHead title="Tracking | Ananbay" />
      {!(packages.length > 0) ? (
        <div
          className={`search__section relative pt-[140px] max-[900px]:max-w-full max-[900px]:mx-3`}
        >
          <div className="title mx-auto sm:w-[680px] mb-10">
            <h2 className="text-4xl font-bold mb-1">Track Order Journey</h2>
            <span className="text-sm">
              Track up to 50 tracking numbers at once.
            </span>
          </div>

          <div className="search-form sm:w-[680px] mx-auto mb-1.5 relative z-[3] max-sm:w-full">
            <div className="search-input">
              {/* <input
              className={`input-1 absolute border border-[#141f65] box-border rounded-lg w-[545px] h-14 pl-4 text-sm leading-6 text-[#313232]`}
              onClick={openInput}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Please enter the tracking number, separated by enter"
            />
            <ModalTracking
              text={code}
              setText={setCode}
              track={track}
              open={openTextarea}
              closeTextarea={closeTextarea}
            /> */}

              {isTextarea ? (
                <textarea
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={10}
                  cols={50}
                  autoFocus
                  className="sm:absolute border border-[#141f65] box-border rounded-lg sm:w-[545px] pl-4 text-sm leading-6 text-[#313232] max-sm:w-full"
                  placeholder="Please enter the tracking number, separated by enter"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onClick={handleClick}
                  onChange={handleChange}
                  placeholder="Please enter the tracking number, separated by enter"
                  className={`input-1 sm:absolute border border-[#141f65] box-border rounded-lg w-[545px] h-14 pl-4 text-sm leading-6 text-[#313232] max-sm:w-full`}
                />
              )}
            </div>
            <div className="button-group w-[127px] flex flex-col absolute sm:right-0 max-sm:left-0 max-sm:mt-3">
              <Button
                className="btn btn-tracking color-[#fff] bg-[#141f65] h-14"
                onClick={track}
              >
                <FileSearch className="mr-3" />
                <span className="font-medium text-sm leading-6">Track</span>
              </Button>
            </div>
          </div>
          {/* <div className="wrapper" onClick={() => setOpenTextarea(false)}></div> */}
        </div>
      ) : (
        <div className="grid grid-cols-12 mx-3 gap-5 mt-5 max-xl:grid-cols-1">
          <div className="col-span-9">
            <TrackingFilter
              packages={packages}
              logs={logs}
              logCount={logCount}
            />
          </div>
          <div className="col-span-3 max-sm:w-full">
            <textarea
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={10}
              autoFocus
              className="xl:absolute border border-[#141f65] box-border rounded-lg w-[350px] pl-4 text-sm leading-6 text-[#313232]"
            />
            <div className="button-group w-[350px] flex flex-col xl:absolute top-[270px]">
              <Button
                className="btn btn-tracking color-[#fff] bg-[#141f65] h-14"
                onClick={track}
              >
                <FileSearch className="mr-3" />
                <span className="font-medium text-sm leading-6">Track</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tracking;
