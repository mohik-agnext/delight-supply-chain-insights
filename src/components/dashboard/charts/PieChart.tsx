
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface PieChartProps {
  data: DataPoint[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey = "value",
  nameKey = "name",
  colors = ["#0EA5E9", "#14B8A6", "#6366F1", "#8B5CF6", "#F59E0B", "#EF4444"],
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}`, name]}
          contentStyle={{ 
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
