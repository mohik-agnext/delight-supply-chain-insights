
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import {
  qualityScoreByVendor,
  complianceRate,
  onTimeDeliveryTrend,
  vendorReliabilityScore
} from "@/data/dashboardData";

const VendorPerformance = () => {
  return (
    <DashboardLayout title="Vendor Performance">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Average Quality Score"
            value={`${Math.round(qualityScoreByVendor.reduce((acc, vendor) => acc + vendor.score, 0) / qualityScoreByVendor.length)}/100`}
            trend={1.8}
          />
          <StatCard
            title="Compliance Rate"
            value={`${complianceRate[0].value}%`}
            trend={0.5}
          />
          <StatCard
            title="On-Time Delivery"
            value="92%"
            trend={-0.8}
          />
          <StatCard
            title="Vendor Reliability"
            value="88/100"
            trend={2.1}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Quality Score by Vendor">
          <BarChart
            data={qualityScoreByVendor}
            dataKey="score"
            nameKey="name"
            barColor="#0EA5E9"
            xAxisLabel="Vendor"
            yAxisLabel="Score"
          />
        </DashboardCard>
        
        <DashboardCard title="Compliance Rate">
          <PieChart
            data={complianceRate}
            colors={["#10B981", "#EF4444"]}
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <DashboardCard title="On-Time Delivery Trend">
          <LineChart
            data={onTimeDeliveryTrend}
            dataKey="Vendor A"
            nameKey="month"
            lineColor="#6366F1"
            xAxisLabel="Month"
            yAxisLabel="Rate (%)"
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1">
        <DashboardCard title="Vendor Reliability Score Analysis">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorReliabilityScore.map((vendor) => {
                  const status = vendor.score >= 90 ? "Excellent" : vendor.score >= 80 ? "Good" : vendor.score >= 70 ? "Average" : "Poor";
                  const statusColor = vendor.score >= 90 ? "bg-green-100 text-green-800" : vendor.score >= 80 ? "bg-blue-100 text-blue-800" : vendor.score >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
                  
                  return (
                    <tr key={vendor.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.score}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.qualityComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.deliveryComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.complianceComponent}/100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                          {status}
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

export default VendorPerformance;
