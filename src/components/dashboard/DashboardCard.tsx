
import React, { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  action,
  className = "",
}) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="dashboard-card-content">{children}</div>
    </div>
  );
};
