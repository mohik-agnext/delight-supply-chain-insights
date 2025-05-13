
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  className,
}) => {
  const trendClass = trend 
    ? trend > 0 
      ? "text-green-500" 
      : "text-red-500"
    : "";

  const trendIcon = trend 
    ? trend > 0 
      ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ) 
      : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      )
    : null;

  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <div className="stat-label">{title}</div>
          <div className="stat-value">{value}</div>
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center mt-2">
          <span className={`flex items-center ${trendClass}`}>
            {trendIcon}
            <span className="ml-1 text-sm">{Math.abs(trend)}% vs last month</span>
          </span>
        </div>
      )}
    </div>
  );
};
