
import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Label
} from "recharts";

interface HealthIndexGaugeProps {
  value: number;
  title: string;
  size?: number;
}

export const HealthIndexGauge: React.FC<HealthIndexGaugeProps> = ({ 
  value, 
  title,
  size = 120
}) => {
  // Calculate remaining percentage
  const remaining = 100 - value;

  // Determine color based on value
  let color = "#10B981"; // Green for good
  if (value < 70) {
    color = "#EF4444"; // Red for bad
  } else if (value < 90) {
    color = "#F59E0B"; // Amber for warning
  }

  // Data for the gauge
  const data = [
    { name: "Value", value },
    { name: "Remaining", value: remaining }
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.6 / 2}
              outerRadius={size * 0.8 / 2}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#e2e8f0" />
              <Label
                value={`${value}%`}
                position="center"
                className="text-lg font-bold"
                style={{
                  fontSize: size * 0.2,
                  fill: color,
                  fontWeight: "bold"
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
