
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import {
  supplyChainHealth,
  criticalAlerts,
  topPerformer,
  totalVendors,
  qualityScoreByVendor,
  overallQualityTrend,
  vendorBenchmarking,
  criticalAlertsList,
  getStatusIndicator
} from "@/data/dashboardData";

const Overview = () => {
  const healthIndicator = getStatusIndicator(supplyChainHealth);

  return (
    <DashboardLayout title="Overview">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Supply Chain Health"
            value={`${supplyChainHealth}/100`}
            trend={2.5}
            icon={
              <div className={`w-3 h-3 rounded-full ${healthIndicator.color}`}></div>
            }
          />
          <StatCard
            title="Critical Alerts"
            value={criticalAlerts}
            trend={-1.2}
          />
          <StatCard
            title="Top Performer"
            value={topPerformer}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Total Vendors"
            value={totalVendors}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <DashboardCard title="Vendor Quality Benchmarking">
            <BarChart
              data={vendorBenchmarking}
              dataKey="qualityScore"
              nameKey="name"
              barColor="#0EA5E9"
              xAxisLabel="Vendor"
              yAxisLabel="Score"
            />
          </DashboardCard>
        </div>
        
        <div>
          <DashboardCard title="Quality Trend (6 Months)">
            <LineChart
              data={overallQualityTrend}
              dataKey="score"
              nameKey="month"
              lineColor="#14B8A6"
              xAxisLabel="Month"
              yAxisLabel="Score"
            />
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Critical Alerts">
          <div className="space-y-4">
            {criticalAlertsList.map(alert => (
              <div key={alert.id} className="flex items-start p-3 border rounded-md bg-white">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${alert.severity === 'High' ? 'bg-red-500' : alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'} mr-3`}></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <span className="text-sm text-gray-500">{alert.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{alert.vendor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
        
        <DashboardCard title="Vendor Performance Comparison">
          <div className="space-y-4">
            {vendorBenchmarking.sort((a, b) => b.overallScore - a.overallScore).map((vendor, index) => (
              <div key={vendor.name} className="bg-white rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{index + 1}.</span>
                    <span className="font-medium text-gray-900">{vendor.name}</span>
                  </div>
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {vendor.overallScore}/100
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quality Score</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-dashboard-blue rounded-full" 
                          style={{ width: `${vendor.qualityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900">{vendor.qualityScore}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compliance Score</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-dashboard-teal rounded-full" 
                          style={{ width: `${vendor.complianceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900">{vendor.complianceScore}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Score</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-dashboard-purple rounded-full" 
                          style={{ width: `${vendor.deliveryScore}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900">{vendor.deliveryScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
