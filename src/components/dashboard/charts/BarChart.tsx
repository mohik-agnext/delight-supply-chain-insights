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
  ReferenceLine,
  Cell,
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
  legendPosition?: "top" | "bottom" | "right";
  targetLine?: number;
  showBarValues?: boolean;
  barGap?: number;
  additionalBars?: { dataKey: string; color: string }[];
  customColors?: string[];
  customLabel?: string;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  nameKey = "name",
  barColor = "#0EA5E9",
  height = 300,
  xAxisLabel,
  yAxisLabel,
  legendPosition = "top",
  targetLine,
  showBarValues = false,
  barGap = 0.2,
  additionalBars = [],
  customColors,
  customLabel,
  stacked = false,
}) => {
  // Set legend position based on the prop
  const legendProps = {
    wrapperStyle: { 
      paddingTop: 10,
      paddingBottom: 20,
      marginBottom: 10,
      color: "#4B5563", // More visible text color
      fontSize: "12px",
      fontWeight: "500",
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    verticalAlign: legendPosition === "bottom" ? "bottom" : "top",
    align: "center",
    layout: legendPosition === "right" ? "vertical" : "horizontal",
    iconType: "circle",
    iconSize: 10
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data} 
        margin={{ top: 30, right: 30, left: 20, bottom: 30 }}
        barGap={barGap}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
          dataKey={nameKey} 
          tick={{ fontSize: 12, fontFamily: "'Inter', 'Segoe UI', sans-serif" }} 
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={false}
          label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -10, fontSize: 12 } : undefined}
        />
        <YAxis 
          axisLine={{ stroke: "#E2E8F0" }} 
          tickLine={false} 
          tick={{ fontSize: 12, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", fontSize: 12 } : undefined}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "12px"
          }}
          formatter={(value) => {
            return typeof value === 'number' ? value.toFixed(2) : value;
          }}
        />
        <Legend 
          {...legendProps}
          formatter={(value, entry, index) => {
            return customLabel || value;
          }}
        />
        
        {/* Target line if specified */}
        {targetLine !== undefined && (
          <ReferenceLine 
            y={targetLine} 
            stroke="#FF4500" 
            strokeDasharray="3 3" 
            label={{ value: "Target", position: "right", fontSize: 12 }} 
          />
        )}
        
        {/* Main bar */}
        {customColors ? (
          <Bar 
            dataKey={dataKey} 
            radius={[4, 4, 0, 0]} 
            name={customLabel || dataKey}
            stackId={stacked ? "stack" : undefined}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
            ))}
          </Bar>
        ) : (
          <Bar 
            dataKey={dataKey} 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
            name={customLabel || dataKey}
            stackId={stacked ? "stack" : undefined}
            label={
              showBarValues 
                ? {
                    position: "top",
                    formatter: (value: number) => `${value.toFixed(2)}`,
                    fontSize: 11,
                    fill: "#6B7280"
                  }
                : undefined
            }
          />
        )}
        
        {/* Additional bars */}
        {additionalBars.map((bar, index) => (
          <Bar 
            key={`bar-${index}`} 
            dataKey={bar.dataKey} 
            fill={bar.color} 
            radius={[4, 4, 0, 0]} 
            stackId={stacked ? "stack" : undefined}
            name={bar.dataKey}
            label={
              showBarValues 
                ? {
                    position: "top",
                    formatter: (value: number) => `${value.toFixed(2)}`,
                    fontSize: 11,
                    fill: "#6B7280"
                  }
                : undefined
            }
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
