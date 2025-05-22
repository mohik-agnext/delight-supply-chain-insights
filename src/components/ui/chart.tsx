import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  BarChart,
  PieChart,
  Line, 
  Bar, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ReferenceArea
} from "recharts";

// Predefined color palette for consistent styling
export const chartColors = [
  "#0EA5E9", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F43F5E", // Pink
  "#F59E0B", // Orange
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

// Chart config types
export type ChartType = "line" | "bar" | "pie";

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartDataSeries {
  name: string;
  dataKey: string;
  color?: string;
}

export interface ToleranceBand {
  min: number;
  max: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  description?: string;
  data: ChartDataPoint[];
  type?: ChartType;
  series?: ChartDataSeries[];
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom" | "right";
  height?: number;
  showGrid?: boolean;
  stacked?: boolean;
  tooltip?: React.ReactNode;
  toleranceBand?: ToleranceBand;
  targetLine?: number;
}

export function Chart({
  title,
  description,
  data,
  type = "line",
  series = [],
  xAxisKey = "name",
  xAxisLabel,
  yAxisLabel,
  showLegend = true,
  legendPosition = "top",
  height = 300,
  showGrid = true,
  stacked = false,
  tooltip,
  toleranceBand,
  targetLine,
}: ChartProps) {
  // Set legend position based on the prop
  const legendProps = {
    wrapperStyle: { paddingTop: legendPosition === "top" ? 10 : 0 },
    verticalAlign: legendPosition === "bottom" ? "bottom" : "top",
    align: legendPosition === "right" ? "right" : "center",
    layout: legendPosition === "right" ? "vertical" : "horizontal",
    iconType: "circle",
  };

  // Determine margin based on axes labels
  const margin = {
    top: 20,
    right: legendPosition === "right" ? 60 : 30,
    bottom: xAxisLabel ? 40 : 20,
    left: yAxisLabel ? 60 : 20,
  };

  // Auto-generate series if none provided
  if (series.length === 0 && data.length > 0) {
    const firstPoint = data[0];
    const keys = Object.keys(firstPoint).filter(k => k !== xAxisKey && typeof firstPoint[k] !== "object");
    series = keys.map((key, index) => ({
      name: key,
      dataKey: key,
      color: chartColors[index % chartColors.length],
    }));
  }

  // Calculate Y axis domain if tolerance bands are provided
  const calculateYDomain = () => {
    if (toleranceBand) {
      const allValues = series.flatMap(s => 
        data.map(d => Number(d[s.dataKey]))
      );
      const minValue = Math.min(...allValues, toleranceBand.min);
      const maxValue = Math.max(...allValues, toleranceBand.max);
      
      // Add some padding (5%)
      const padding = (maxValue - minValue) * 0.05;
      return [Math.floor(minValue - padding), Math.ceil(maxValue + padding)];
    }
    return undefined;
  };

  // Render appropriate chart type
  const renderChart = () => {
    const tooltipStyle = {
      backgroundColor: "white",
      borderRadius: "0.375rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "none",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSize: "12px"
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={margin}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              )}
              <XAxis 
                dataKey={xAxisKey} 
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
                contentStyle={tooltipStyle}
              />
              {showLegend && <Legend {...legendProps} />}
              
              {/* Tolerance band if required */}
              {toleranceBand && (
                <ReferenceArea
                  y1={toleranceBand.min}
                  y2={toleranceBand.max}
                  fill={toleranceBand.color || `${chartColors[0]}30`}
                  fillOpacity={0.2}
                />
              )}
              
              {/* Target line if specified */}
              {targetLine !== undefined && (
                <ReferenceLine 
                  y={targetLine} 
                  stroke="#FF4500" 
                  strokeDasharray="3 3" 
                  label={{ value: "Target", position: "right", fontSize: 12 }} 
                />
              )}
              
              {/* Data lines */}
              {series.map((s, index) => (
                <Line
                  key={`line-${index}`}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: s.color || chartColors[index % chartColors.length], strokeWidth: 1, stroke: "white" }}
                  activeDot={{ r: 6, fill: s.color || chartColors[index % chartColors.length], stroke: "white", strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={margin} barGap={0.2}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              )}
              <XAxis 
                dataKey={xAxisKey} 
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
                contentStyle={tooltipStyle}
              />
              {showLegend && <Legend {...legendProps} />}
              
              {/* Target line if specified */}
              {targetLine !== undefined && (
                <ReferenceLine 
                  y={targetLine} 
                  stroke="#FF4500" 
                  strokeDasharray="3 3" 
                  label={{ value: "Target", position: "right", fontSize: 12 }} 
                />
              )}
              
              {/* Data bars */}
              {series.map((s, index) => (
                <Bar 
                  key={`bar-${index}`}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color || chartColors[index % chartColors.length]}
                  stackId={stacked ? "stack" : undefined}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={margin}>
              <Pie
                data={data}
                nameKey={xAxisKey}
                dataKey={series[0]?.dataKey || "value"}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={series[index]?.color || chartColors[index % chartColors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                content={tooltip ? tooltip : undefined}
                contentStyle={tooltipStyle}
              />
              {showLegend && <Legend {...legendProps} />}
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {renderChart()}
    </div>
  );
}

// Card wrapped chart component
export function ChartCard({
  title,
  description,
  className = "",
  ...props
}: ChartProps & { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Chart {...props} title={undefined} description={undefined} />
      </CardContent>
    </Card>
  );
}
