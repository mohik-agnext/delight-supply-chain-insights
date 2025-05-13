
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
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

interface BarChartProps {
  data: DataPoint[];
  dataKey: string;
  nameKey?: string;
  barColor?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  nameKey = "name",
  barColor = "#0EA5E9",
  height = 300,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
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
        <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
