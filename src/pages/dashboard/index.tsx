import PageHead from "@/components/shared/page-head";
import {
  PACKAGE_STATUS_CANCELLED,
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_DELIVERED,
  PACKAGE_STATUS_EXPORT_HUB,
  PACKAGE_STATUS_IMPORT_HUB,
  PACKAGE_STATUS_INTRANSIT,
  PACKAGE_STATUS_PENDING_PICKUP,
  PACKAGE_STATUS_PICKED,
  PACKAGE_STATUS_RESHIP,
  PACKAGE_STATUS_RETURNED,
  PACKAGE_STATUS_WAREHOUSE_EXPORT,
  PACKAGE_STATUS_WAREHOUSE_INCONTAINER,
  PACKAGE_STATUS_WAREHOUSE_INSHIPMENT,
  PACKAGE_STATUS_WAREHOUSE_LABELED,
} from "@/constants/dashboard";
import { fetchAnalytics } from "@/services/dashboard";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChartBackUp } from "./components/barChart";

type TimeFrame = "d7" | "d14" | "d30";

interface Analytic {
  status: number;
  count: number;
  date_time: string;
}

interface DataValues {
  created: number[];
  pendingPickup: number[];
  intransit: number[];
  delivered: number[];
  returned: number[];
  cancelled: number[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [time, setTime] = useState<TimeFrame>("d14");
  const [analytics, setAnalytics] = useState<Analytic[]>([]);
  const [dataValues, setDataValues] = useState<DataValues>({
    created: [],
    pendingPickup: [],
    intransit: [],
    delivered: [],
    returned: [],
    cancelled: [],
  });

  // ⏱ Parse date range
  const startDate = searchParams.get("start_date")
    ? new Date(searchParams.get("start_date")!)
    : new Date(Date.now() - 14 * 86400 * 1000);
  const endDate = searchParams.get("end_date")
    ? new Date(searchParams.get("end_date")!)
    : new Date();

  const formattedStartDate = startDate.toISOString().split("T")[0];
  const formattedEndDate = endDate.toISOString().split("T")[0];

  // 🧭 Update URL when time range changes
  useEffect(() => {
    if (!time) return;

    const today = new Date();
    const range = { d7: 7, d14: 14, d30: 30 }[time];
    const start = new Date(today);
    start.setDate(today.getDate() - range + 1);

    setSearchParams({
      start_date: start.toISOString().split("T")[0],
      end_date: today.toISOString().split("T")[0],
    });
  }, [time]);

  // 🧮 Determine timeframe from startDate
  useEffect(() => {
    const daysDiff =
      (Date.now() - startDate.getTime()) / (1000 * 86400);

    if (daysDiff <= 7) setTime("d7");
    else if (daysDiff <= 14) setTime("d14");
    else setTime("d30");
  }, [formattedStartDate]);

  // 📊 Fetch analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchAnalytics(formattedStartDate, formattedEndDate);
        setAnalytics(res.package_analytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    loadAnalytics();
  }, [formattedStartDate, formattedEndDate]);

  // 📅 Generate list of days between start and end
  const days = useMemo(() => {
    const diff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 86400) + 1;
    const result: string[] = [];
    const temp = new Date(endDate);
    for (let i = 0; i < diff; i++) {
      const d = temp.getDate().toString().padStart(2, "0");
      const m = (temp.getMonth() + 1).toString().padStart(2, "0");
      result[diff - i - 1] = `${d}/${m}`;
      temp.setDate(temp.getDate() - 1);
    }
    return result;
  }, [startDate, endDate]);

  // 🧠 Process analytics data
  useEffect(() => {
    const baseData = Object.keys(dataValues).reduce(
      (acc, key) => ({
        ...acc,
        [key]: Array(days.length).fill(0),
      }),
      {} as DataValues
    );

    const updated = { ...baseData };
    for (const v of analytics) {
      const day = formatDateLabel(v.date_time);
      const idx = days.indexOf(day);
      if (idx === -1) continue;

      switch (v.status) {
        case PACKAGE_STATUS_CREATED:
          updated.created[idx] += v.count;
          break;
        case PACKAGE_STATUS_PENDING_PICKUP:
          updated.pendingPickup[idx] += v.count;
          break;
        case PACKAGE_STATUS_PICKED:
        case PACKAGE_STATUS_WAREHOUSE_LABELED:
        case PACKAGE_STATUS_WAREHOUSE_INCONTAINER:
        case PACKAGE_STATUS_WAREHOUSE_INSHIPMENT:
        case PACKAGE_STATUS_WAREHOUSE_EXPORT:
        case PACKAGE_STATUS_IMPORT_HUB:
        case PACKAGE_STATUS_EXPORT_HUB:
        case PACKAGE_STATUS_INTRANSIT:
        case PACKAGE_STATUS_RESHIP:
          updated.intransit[idx] += v.count;
          break;
        case PACKAGE_STATUS_DELIVERED:
          updated.delivered[idx] += v.count;
          break;
        case PACKAGE_STATUS_RETURNED:
          updated.returned[idx] += v.count;
          break;
        case PACKAGE_STATUS_CANCELLED:
          updated.cancelled[idx] += v.count;
          break;
      }
    }

    setDataValues(updated);
  }, [analytics, days]);

  // 🔢 Helpers
  const formatDateLabel = (date: string) => {
    const d = date.slice(-2);
    const m = date.slice(5, 7);
    return `${d}/${m}`;
  };

  const formatChartData = useMemo(() => {
    const year = new Date().getFullYear();
    return days.map((d, i) => ({
      date: `${year}-${d.split("/").reverse().join("-")}`,
      intransit: dataValues.intransit[i],
      delivered: dataValues.delivered[i],
      pretransit: dataValues.pendingPickup[i],
    }));
  }, [days, dataValues]);

  const goListPackage = (status: string) => {
    const mapDays = { d7: 7, d14: 14, d30: 30 };
    const daysRange = mapDays[time] || 14;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysRange + 1);

    const format = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

    navigate({
      pathname: "/packages",
      search: `?status=${status}&start_date=${format(start)}&end_date=${format(end)}`,
    });
  };

  return (
    <>
      <PageHead title="Dashboard | Ananbay" />
      <div className="p-4 pt-6 md:p-8 max-w-full mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Chào mừng quay trở lại 👋</h2>
          <div className="flex items-center gap-3">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value as TimeFrame)}
              className="rounded-xl border bg-white px-3 py-1 text-[#626363]"
            >
              <option value="d7">7 ngày gần đây</option>
              <option value="d14">14 ngày gần đây</option>
              <option value="d30">30 ngày gần đây</option>
            </select>
            <p>
              {startDate.toLocaleDateString()} -{" "}
              {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <ChartBackUp chartData={formatChartData} goListpackage={goListPackage} />
      </div>
    </>
  );
};

export default DashboardPage;
