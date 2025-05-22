import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import ErrorBoundary from "@/components/ErrorBoundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <DashboardHeader title={title} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          <ErrorBoundary
            fallback={
              <div className="p-6 bg-red-50 border border-red-300 rounded-lg">
                <h3 className="text-red-800 text-lg font-medium mb-2">Dashboard Error</h3>
                <p className="text-red-600">There was an error loading this dashboard. Please try refreshing the page.</p>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
