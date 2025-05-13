
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  dataKey: string;
  nameKey?: string;
  lineColor?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  nameKey = "name",
  lineColor = "#0EA5E9",
  height = 300,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={nameKey} 
          tick={{ fontSize: 12 }} 
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={false}
          label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -10 } : undefined}
        />
        <YAxis 
          axisLine={{ stroke: "#E2E8F0" }} 
          tickLine={false} 
          tick={{ fontSize: 12 }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
