import { DELIVER_LOG_PACKAGE } from "@/constants/packages";
import { getPackagesDetail } from "@/services/packages";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// types.ts
export interface Log {
  ship_time: string;
  description: string;
  location?: string;
  type: number;
}

export interface Item {
  name: string;
  data: Log[];
}

const DeliveryLog = () => {
  const { package_id } = useParams<{ package_id: string }>();
  const [logs, setLogs] = useState<Log[] | null>([]);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        if (package_id) {
          const data = await getPackagesDetail(package_id);
          setLogs(data.deliver_logs);
        }
      } catch (error) {}
    };

    fetchPackageDetail();
  }, [package_id]);
  const items: Item[] = React.useMemo(() => {
    const timelines: { [key: string]: Log[] } = {};

    logs?.map((log: Log) => {
      const date = format(new Date(log.ship_time), "dd/MM/yyyy");

      if (!timelines[date]) {
        timelines[date] = [];
      }

      log.description =
        log.description !== ""
          ? log.description
          : DELIVER_LOG_PACKAGE[log.type] || "";
      timelines[date].push(log);
    });

    return Object.keys(timelines).map((key) => ({
      name: key,
      data: timelines[key],
    }));
  }, [logs]);

  return (
    <div className="deliver-log">
      <div className="timeline-new">
        {items.map((item, i) => (
          <div
            key={i}
            className={`timeline-item-new ${i === 0 ? "first-item" : ""}`}
          >
            <div className="item__right flex">
              <CircleCheck className="h-5 w-5 mr-2 bg-[#20bddb] border border-[#20bddb] text-[#fff] rounded-full" />
              <div className="title font-bold text-[#111212]">{item.name}</div>
            </div>
            {item.data.map((it, j) => (
              <div
                key={j}
                className={`item__right__data ${j === 0 ? "first-data" : ""} ml-10 flex gap-5`}
              >
                <div className="time">
                  {format(new Date(it.ship_time), "HH:mm:ss")}
                </div>
                <div className="right-content">
                  <div className="des font-bold text-[#111212]">
                    {it.description}
                  </div>
                  {it.location && (
                    <span className="location">___{it.location}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryLog;
