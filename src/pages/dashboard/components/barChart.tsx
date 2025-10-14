"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowUpRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chartConfig = {
  views: {
    label: "Lượt truy cập trang",
  },
  intransit: {
    label: "Đang vận chuyển",
    color: "#02baba",
  },
  delivered: {
    label: "Đã giao hàng",
    color: "#48be78",
  },
  pretransit: {
    label: "Chờ vận chuyển",
    color: "#3f51b5",
  },
} satisfies ChartConfig;

interface OrderStatsChartProps {
  chartData: any;
  goListpackage: (s: string) => void;
}

export function ChartBackUp({
  chartData,
  goListpackage,
}: OrderStatsChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("intransit");

  const total = React.useMemo(
    () => ({
      intransit: chartData.reduce(
        (acc: any, curr: any) => acc + curr.intransit,
        0
      ),
      delivered: chartData.reduce(
        (acc: any, curr: any) => acc + curr.delivered,
        0
      ),
      pretransit: chartData.reduce(
        (acc: any, curr: any) => acc + curr.pretransit,
        0
      ),
    }),
    [chartData]
  );

  return (
    <Card className="mt-20">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Biểu đồ cột tương tác</CardTitle>
          <CardDescription>
            Hiển thị thống kê đơn hàng trong 1 tháng gần đây
          </CardDescription>
        </div>
        <div className="flex">
          {["pretransit", "intransit", "delivered"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 max-sm:even:border-r"
                onClick={() => setActiveChart(chart)}
              >
                <span
                  //@ts-expect-error has field
                  className={`text-xs  text-[${chartConfig[chart].color}] flex whitespace-nowrap`}
                >
                  {chartConfig[chart].label.toLocaleUpperCase()}
                  <a
                    onClick={() => goListpackage(`${chartConfig[chart].label}`)}
                    className="cursor-pointer"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ArrowUpRight className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Đi tới danh sách đơn hàng</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </a>
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            {/* <YAxis tickLine={false} /> */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
