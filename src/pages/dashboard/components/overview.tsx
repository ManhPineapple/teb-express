import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OrderStatsChartProps {
  chartData: any;
  options: any;
}

const OrderStatsChart: React.FC<OrderStatsChartProps> = ({
  chartData,
  options,
}) => {
  return chartData ? (
    <Line data={chartData} options={options} />
  ) : (
    <div>Loading...</div>
  );
};

export default OrderStatsChart;
