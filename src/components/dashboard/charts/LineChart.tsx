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
  ReferenceLine,
  ReferenceArea,
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
  legendPosition?: "top" | "bottom" | "right";
  additionalLines?: { dataKey: string; color: string }[];
  showToleranceBand?: boolean;
  toleranceMin?: number;
  toleranceMax?: number;
  targetLine?: number;
  tooltip?: (props: any) => JSX.Element;
  customLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  nameKey = "name",
  lineColor = "#0EA5E9",
  height = 300,
  xAxisLabel,
  yAxisLabel,
  legendPosition = "top",
  additionalLines = [],
  showToleranceBand = false,
  toleranceMin,
  toleranceMax,
  targetLine,
  tooltip,
  customLabel,
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
      <RechartsLineChart 
        data={data} 
        margin={{ top: 30, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
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
          content={tooltip ? tooltip : undefined}
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
        
        {/* Tolerance band if requested */}
        {showToleranceBand && toleranceMin !== undefined && toleranceMax !== undefined && (
          <ReferenceArea y1={toleranceMin} y2={toleranceMax} fill="#E8F5E9" fillOpacity={0.3} />
        )}
        
        {/* Main line */}
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={lineColor} 
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          name={customLabel || dataKey}
        />
        
        {/* Additional lines */}
        {additionalLines.map((line, index) => (
          <Line 
            key={`line-${index}`}
            type="monotone" 
            dataKey={line.dataKey} 
            stroke={line.color} 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name={line.dataKey}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
