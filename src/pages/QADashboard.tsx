import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { QADashboard } from "@/components/dashboard/QADashboard";

const QADashboardPage = () => {
  return (
    <DashboardLayout title="QA Dashboard">
      <QADashboard />
    </DashboardLayout>
  );
};

export default QADashboardPage; 