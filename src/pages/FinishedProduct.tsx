import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  batchConsistency,
  rejectionRateTrend,
  traceabilityCoverage,
  consumerComplaintRate,
  customerSatisfactionIndex
} from "@/data/dashboardData";

const FinishedProduct = () => {
  // Calculate averages for stat cards
  const avgConsistency = Math.round(
    batchConsistency.reduce((acc, item) => acc + item.score, 0) / batchConsistency.length
  );

  // Calculate average rejection rate
  const lastMonthRejection = rejectionRateTrend[rejectionRateTrend.length - 1];
  const vendorRates = Object.entries(lastMonthRejection)
    .filter(([key]) => key !== "month")
    .map(([_, value]) => parseFloat(value as string));
  const avgRejectionRate = (vendorRates.reduce((sum, rate) => sum + rate, 0) / vendorRates.length).toFixed(1);

  // Calculate traceability percentage
  const traceabilityPercentage = traceabilityCoverage[0].value;

  // Calculate average consumer complaint rate
  const avgComplaintRate = (
    consumerComplaintRate.reduce((acc, item) => acc + parseFloat(item.rate as string), 0) / consumerComplaintRate.length
  ).toFixed(1);

  return (
    <DashboardLayout title="Finished Product">
      <ErrorBoundary 
        fallback={
          <div className="bg-white p-4 rounded-lg mb-6">
            <p className="text-red-600">Failed to load filters. Please refresh the page.</p>
          </div>
        }
      >
        <FilterBar />
      </ErrorBoundary>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Batch Consistency"
            value={`${avgConsistency}/100`}
            trend={1.7}
          />
          <StatCard
            title="Rejection Rate"
            value={`${avgRejectionRate}%`}
            trend={-0.3}
          />
          <StatCard
            title="Traceability Coverage"
            value={`${traceabilityPercentage}%`}
            trend={2.5}
          />
          <StatCard
            title="Complaint Rate"
            value={`${avgComplaintRate}/1000`}
            trend={-0.6}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Batch Consistency Scores">
          <div className="pt-4">
            <BarChart
              data={batchConsistency}
              dataKey="score"
              nameKey="name"
              barColor="#0EA5E9"
              xAxisLabel="Batch"
              yAxisLabel="Consistency Score"
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Traceability Coverage">
          <PieChart
            data={traceabilityCoverage}
            colors={["#10B981", "#F59E0B", "#EF4444"]}
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <DashboardCard title="Rejection Rate Trend">
          <LineChart
            data={rejectionRateTrend}
            dataKey="Vendor A"
            nameKey="month"
            lineColor="#EF4444"
            xAxisLabel="Month"
            yAxisLabel="Rejection Rate (%)"
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Consumer Complaint Rate">
          <div className="pt-4">
            <BarChart
              data={consumerComplaintRate}
              dataKey="rate"
              nameKey="name"
              barColor="#F59E0B"
              xAxisLabel="Vendor"
              yAxisLabel="Complaints per 1000 units"
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Customer Satisfaction Index">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction Index</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consistency Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSatisfactionIndex.map((item) => {
                  const statusColor = item.index >= 95 ? "bg-green-100 text-green-800" : 
                                     item.index >= 90 ? "bg-blue-100 text-blue-800" : 
                                     "bg-yellow-100 text-yellow-800";
                  
                  const statusText = item.index >= 95 ? "Excellent" : 
                                    item.index >= 90 ? "Good" : 
                                    "Average";
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.index}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.complaintComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.consistencyComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};

export default FinishedProduct;
