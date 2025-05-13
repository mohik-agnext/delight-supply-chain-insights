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
  showToleranceBand?: boolean;
  toleranceMin?: number;
  toleranceMax?: number;
  additionalLines?: { dataKey: string; color: string }[];
  tooltip?: React.ReactNode;
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
  showToleranceBand = false,
  toleranceMin,
  toleranceMax,
  additionalLines = [],
  tooltip,
  customLabel,
}) => {
  // Set legend position based on the prop
  const legendProps = {
    wrapperStyle: { paddingTop: 10 },
    verticalAlign: legendPosition === "bottom" ? "bottom" : "top",
    align: legendPosition === "right" ? "right" : "center",
    layout: legendPosition === "right" ? "vertical" : "horizontal",
    iconType: "circle",
  };

  // Calculate domain for Y axis if tolerance bands are provided
  const calculateYDomain = () => {
    if (showToleranceBand && toleranceMin !== undefined && toleranceMax !== undefined) {
      const minValue = Math.min(
        ...data.map((d) => Number(d[dataKey])),
        toleranceMin
      );
      const maxValue = Math.max(
        ...data.map((d) => Number(d[dataKey])),
        toleranceMax
      );
      // Add some padding
      return [Math.floor(minValue * 0.95), Math.ceil(maxValue * 1.05)];
    }
    return undefined;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
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
          domain={calculateYDomain()}
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
        />
        <Legend 
          {...legendProps}
          formatter={(value, entry, index) => {
            return customLabel || value;
          }}
        />
        
        {/* Tolerance band if required */}
        {showToleranceBand && toleranceMin !== undefined && toleranceMax !== undefined && (
          <ReferenceArea
            y1={toleranceMin}
            y2={toleranceMax}
            fill={`${lineColor}30`}
            fillOpacity={0.2}
          />
        )}
        
        {/* Main data line */}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 4, fill: lineColor, strokeWidth: 1, stroke: "white" }}
          activeDot={{ r: 6, fill: lineColor, stroke: "white", strokeWidth: 2 }}
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
            dot={{ r: 4, fill: line.color, strokeWidth: 1, stroke: "white" }}
            activeDot={{ r: 6, fill: line.color, stroke: "white", strokeWidth: 2 }}
            name={line.dataKey}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
