import PageHead from "@/components/shared/page-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Box, PackageCheck, PackageX, Plane, Search } from "lucide-react";
import OrderStatsChart from "./components/overview";

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

type Analytic = {
  status: number;
  status_text: number;
  count: number;
  date_time: string;
};

type DataValues = {
  created: number[];
  pendingPickup: number[];
  intransit: number[];
  delivered: number[];
  returned: number[];
  cancelled: number[];
  processing: number[];
};

const DashboardPage: React.FC = () => {
  const [time, setTime] = useState<TimeFrame>();
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParams.get("start_date")
    ? //@ts-ignore
    new Date(searchParams.get("start_date"))
    : new Date(new Date().getTime() - 14 * 86400 * 1000);
  const endDate = searchParams.get("end_date")
    ? //@ts-ignore
    new Date(searchParams.get("end_date"))
    : new Date();

  const formattedStartDate = startDate.toISOString().split("T")[0];
  const formattedEndDate = endDate.toISOString().split("T")[0];

  // Function to calculate start and end dates based on selected time
  useEffect(() => {
    if (!time) return;

    const today = new Date();
    let daysToAdd = 0;

    switch (time) {
      case "d7":
        daysToAdd = 7;
        break;
      case "d14":
        daysToAdd = 14;
        break;
      case "d30":
        daysToAdd = 30;
        break;
      // default:
      //   daysToAdd = 14; // Default to 14 days if none is selected
      //   break;
    }

    const start = new Date(today);
    start.setDate(today.getDate() - daysToAdd + 1); // Calculate start date

    setSearchParams({
      start_date: start.toISOString().split("T")[0], // format yyyy-mm-dd
      end_date: today.toISOString().split("T")[0],
    });
  }, [time]);

  useEffect(() => {
    const startDaysAgo =
      (new Date().getTime() - startDate.getTime()) / (1000 * 86400);
    if (startDaysAgo <= 7) {
      setTime("d7");
    } else if (startDaysAgo <= 14) {
      setTime("d14");
    } else {
      setTime("d30");
    }
  }, [formattedStartDate]);

  const [analytics, setAnalytics] = useState<Analytic[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  const initNumbers = {
    created: 0,
    pendingPickup: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
    processing: 0,
  };
  const [numbers, setNumbers] = useState(initNumbers);

  const [datavalues, setDatavalues] = useState<DataValues>({
    created: [],
    pendingPickup: [],
    intransit: [],
    delivered: [],
    returned: [],
    cancelled: [],
    processing: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await fetchAnalytics(
          formattedStartDate,
          formattedEndDate
        );
        setAnalytics(analytics.package_analytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchData();
  }, [formattedStartDate, formattedEndDate]);

  const days = useMemo(() => {
    const num =
      (endDate.getTime() -
        (startDate ? startDate.getTime() : endDate.getTime())) /
      (1000 * 3600 * 24) +
      1;
    const result: string[] = [];
    const date = new Date(endDate);
    for (let i = 0; i < num; i++) {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      result[num - i - 1] = `${d > 9 ? d : "0" + d}/${m > 9 ? m : "0" + m}`;
      date.setDate(date.getDate() - 1);
    }
    return result;
  }, []);

  useEffect(() => {
    createBaseData();

    if (!analytics || analytics.length === 0) return;

    const newNumbers = { ...initNumbers };
    const newDatavalues = { ...datavalues };

    for (const v of analytics) {
      const day = dateToDay(v.date_time);
      const index = days.findIndex((item) => item === day);
      if (index === -1) continue;

      const count = v.count;
      switch (v.status) {
        case PACKAGE_STATUS_CREATED:
          newNumbers.created += count;
          newDatavalues.created[index] += count;
          break;
        case PACKAGE_STATUS_PENDING_PICKUP:
          newNumbers.pendingPickup += count;
          newDatavalues.pendingPickup[index] += count;
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
          newNumbers.intransit += count;
          newDatavalues.intransit[index] += count;
          break;
        case PACKAGE_STATUS_DELIVERED:
          newNumbers.delivered += count;
          newDatavalues.delivered[index] += count;
          break;
        case PACKAGE_STATUS_RETURNED:
          newNumbers.returned += count;
          newDatavalues.returned[index] += count;
          break;
        case PACKAGE_STATUS_CANCELLED:
          newNumbers.cancelled += count;
          newDatavalues.cancelled[index] += count;
          break;
      }
    }

    setNumbers(newNumbers);
    setDatavalues(newDatavalues);
    fillData(newDatavalues, days);
  }, [days, analytics]);

  const dateToDay = (date: string) => {
    const d = date.substr(-2, 2);
    const m = date.substr(5, 2);
    return `${d}/${m}`;
  };

  const fillData = (datavalues: any, days: string[]) => {
    setChartData({
      labels: days,
      datasets: [
        {
          label: "Delivered",
          borderColor: "#48BE78",
          borderWidth: 1,
          backgroundColor: "#F0FFF3",
          data: datavalues.delivered,
        },
        {
          label: "In-transit",
          borderColor: "#02baba",
          borderWidth: 1,
          backgroundColor: "#ddf3f4",
          data: datavalues.intransit,
        },
      ],
    });
  };

  const createBaseData = () => {
    for (const key in datavalues) {
      if (!Object.hasOwnProperty.call(datavalues, key)) continue;
      datavalues[key as keyof DataValues] = [];
      for (let i = 0; i < days.length; i++) {
        datavalues[key as keyof DataValues].push(0);
      }
    }
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const navigate = useNavigate();

  const searchHandle = (e: any) => {
    const keyword = e.target.value.trim();
    if (keyword === "") return;

    navigate({ pathname: "/packages", search: `?code=${keyword}` });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchHandle(e);
    }
  };

  const dateformat = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const goListpackage = (status: string) => {
    const mapdays = { d7: 7, d14: 14, d30: 30 };
    //@ts-ignore
    const num = mapdays[time] || 14;

    const t = new Date();
    const ed = dateformat(t);

    t.setDate(t.getDate() - num + 1);
    const sd = dateformat(t);

    navigate({
      pathname: "/packages",
      search: `?status=${status}&start_date=${sd}&end_date=${ed}`,
    });
  };

  interface TransformedDataItem {
    date: string;
  }

  const transformedData: TransformedDataItem[] = days.map((item, index) => {
    const year = new Date().getFullYear();
    const formattedDate = `${year}-${item.split("/").reverse().join("-")}`;

    return {
      date: formattedDate,
    };
  });

  const formatChartData = () => {
    const labels = transformedData;
    const intransitData = datavalues.intransit;
    const deliveredData = datavalues.delivered;
    const pretransitData = datavalues.pendingPickup;

    const formattedChartData = labels.map((label: any, index: number) => ({
      date: label.date,
      intransit: intransitData[index],
      delivered: deliveredData[index],
      pretransit: pretransitData[index],
    }));

    return formattedChartData;
  };

  const formattedData = formatChartData();

  return (
    <>
      <PageHead title="Dashboard | Ananbay" />
      <div className="">
        <div className="p-4 pt-6 md:p-8 max-w-full mx-auto">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Chào mừng quay trở lại 👋
            </h2>
            <div className="actions">
              <select
                defaultValue={"d14"}
                value={time}
                onChange={(e) => setTime(e.target.value as TimeFrame)}
                className="rounded-xl border bg-[#fff] px-3 pb-[7px] pt-[3px] leading-[2.2rem] text-[#626363]"
              >
                <option selected value=""></option>
                <option value="d7">7 ngày gần đây</option>
                <option value="d14">14 ngày gần đây</option>
                <option value="d30">30 ngày gần đây</option>
              </select>
              {startDate && (
                <p>
                  {startDate.toLocaleDateString()} -{" "}
                  {endDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {/* <div className="relative">
            <Input
              className="rounded-3xl h-[3rem] pl-[1.5rem] mt-4"
              placeholder="Search by tracking code"
              onKeyDown={handleKeyDown}
            />
            <Search className="absolute right-[15px] top-[12px]" />
          </div> */}
          {/* <div className="grid grid-cols-4 mt-5 max-sm:grid-cols-1">
            <a
              onClick={() => goListpackage("Pre-Transit")}
              className="cursor-pointer max-sm:mb-3"
            >
              <div className="shadow-xl shadow-[#F9F0FF] p-8 rounded-2xl sm:mr-3 border">
                <div className="float-left">
                  <Box className="h-10 w-10 text-[#722ED1]" strokeWidth={1} />
                </div>
                <p className="text-[#722ED1] text-lg font-bold">PRE-TRANSIT</p>
                <p className="font-bold text-3xl">{numbers.pendingPickup}</p>
              </div>
            </a>
            <a
              onClick={() => goListpackage("In-Transit")}
              className="cursor-pointer"
            >
              <div className="shadow-xl shadow-[#ddf3f4] p-8 rounded-2xl sm:mr-3 bg-[#fff] max-sm:mb-3 border">
                <div className="float-left">
                  <Plane className="text-[#02baba] w-10 h-10" strokeWidth={1} />
                </div>
                <p className="text-[#02baba] text-lg font-bold">IN-TRANSIT</p>
                <p className="font-bold text-3xl">{numbers.intransit}</p>
              </div>
            </a>
            <a
              onClick={() => goListpackage("Delivered")}
              className="cursor-pointer max-sm:mb-3"
            >
              <div className="shadow-xl shadow-[#f0fff3] p-8 rounded-2xl sm:mr-3 bg-[#fff] border">
                <div className="float-left">
                  <PackageCheck
                    className="h-10 w-10 text-[#48be78]"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-[#48be78] text-lg font-bold">DELIVERED</p>
                <p className="font-bold text-3xl">{numbers.delivered}</p>
              </div>
            </a>
            <a
              onClick={() => goListpackage("Canceled")}
              className="cursor-pointer"
            >
              <div className="shadow-xl shadow-[#FFF1F0] p-8 rounded-2xl border">
                <div className="float-left">
                  <PackageX
                    className="h-10 w-10 text-[#F5222D]"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-[#F5222D] text-lg font-bold">CANCELED</p>
                <p className="font-bold text-3xl">{numbers.cancelled}</p>
              </div>
            </a>
          </div> */}
          {/* <Tabs defaultValue="overview" className="space-y-4 mt-5">
            <TabsContent value="overview" className="space-y-4">
              <div className="">
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-xl">Thống kê đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <OrderStatsChart chartData={chartData} options={options} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs> */}
          <ChartBackUp
            chartData={formattedData}
            goListpackage={goListpackage}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
