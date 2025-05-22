
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import {
  disputeResolutionTime,
  disputeFrequency,
  evidenceAccuracy,
  disputeResolutionEfficiency
} from "@/data/dashboardData";

const DisputeResolution = () => {
  // Calculate averages for stat cards
  const avgResolutionTime = Math.round(
    disputeResolutionTime.reduce((acc, item) => acc + item.hours, 0) / disputeResolutionTime.length
  );

  const totalDisputes = disputeFrequency.reduce((acc, item) => acc + item.count, 0);

  const accurateEvidencePercentage = evidenceAccuracy[0].value;
  
  const avgEfficiency = Math.round(
    disputeResolutionEfficiency.reduce((acc, item) => acc + item.efficiency, 0) / disputeResolutionEfficiency.length
  );

  return (
    <DashboardLayout title="Dispute Resolution">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Avg. Resolution Time"
            value={`${avgResolutionTime} hrs`}
            trend={-2.5}
          />
          <StatCard
            title="Total Disputes (6m)"
            value={totalDisputes}
            trend={-1.2}
          />
          <StatCard
            title="Evidence Accuracy"
            value={`${accurateEvidencePercentage}%`}
            trend={1.8}
          />
          <StatCard
            title="Resolution Efficiency"
            value={`${avgEfficiency}/100`}
            trend={1.5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Resolution Time by Dispute Type">
          <div className="pt-4">
            <BarChart
              data={disputeResolutionTime}
              dataKey="hours"
              nameKey="name"
              barColor="#6366F1"
              xAxisLabel="Dispute Type"
              yAxisLabel="Hours"
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Evidence Accuracy">
          <PieChart
            data={evidenceAccuracy}
            colors={["#10B981", "#F59E0B", "#EF4444"]}
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <DashboardCard title="Dispute Frequency Trend">
          <div className="pt-4">
            <LineChart
              data={disputeFrequency}
              dataKey="count"
              nameKey="month"
              lineColor="#8B5CF6"
              xAxisLabel="Month"
              yAxisLabel="Number of Disputes"
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1">
        <DashboardCard title="Dispute Resolution Efficiency">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Efficiency</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disputeResolutionEfficiency.map((item) => {
                  const statusColor = item.efficiency >= 90 ? "bg-green-100 text-green-800" : 
                                     item.efficiency >= 85 ? "bg-blue-100 text-blue-800" : 
                                     "bg-yellow-100 text-yellow-800";
                  
                  const statusText = item.efficiency >= 90 ? "Excellent" : 
                                    item.efficiency >= 85 ? "Good" : 
                                    "Average";
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.efficiency}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timeComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accuracyComponent}/100</td>
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

export default DisputeResolution;
