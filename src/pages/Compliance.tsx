
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import {
  auditPassRate,
  nonComplianceIncidents,
  documentationCompleteness,
  complianceRiskScore
} from "@/data/dashboardData";

const Compliance = () => {
  // Calculate averages for stat cards
  const avgPassRate = Math.round(
    auditPassRate.reduce((acc, item) => acc + item.rate, 0) / auditPassRate.length
  );

  const totalIncidents = nonComplianceIncidents.reduce((acc, item) => acc + item.count, 0);

  const completeDocsPercentage = documentationCompleteness[0].value;

  const avgRiskScore = Math.round(
    complianceRiskScore.reduce((acc, item) => acc + item.score, 0) / complianceRiskScore.length
  );

  return (
    <DashboardLayout title="Compliance & Audit">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Avg. Audit Pass Rate"
            value={`${avgPassRate}%`}
            trend={1.2}
          />
          <StatCard
            title="Non-Compliance Incidents"
            value={totalIncidents}
            trend={-2.0}
          />
          <StatCard
            title="Documentation Completeness"
            value={`${completeDocsPercentage}%`}
            trend={0.8}
          />
          <StatCard
            title="Avg. Risk Score"
            value={avgRiskScore}
            trend={-1.5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Audit Pass Rate by Vendor">
          <div className="pt-4">
            <BarChart
              data={auditPassRate}
              dataKey="rate"
              nameKey="name"
              barColor="#10B981"
              xAxisLabel="Vendor"
              yAxisLabel="Pass Rate (%)"
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Documentation Completeness">
          <PieChart
            data={documentationCompleteness}
            colors={["#10B981", "#F59E0B", "#EF4444"]}
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <DashboardCard title="Non-Compliance Incidents Trend">
          <div className="pt-4">
            <LineChart
              data={nonComplianceIncidents}
              dataKey="count"
              nameKey="month"
              lineColor="#EF4444"
              xAxisLabel="Month"
              yAxisLabel="Number of Incidents"
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1">
        <DashboardCard title="Compliance Risk Assessment">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documentation Component</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complianceRiskScore.map((item) => {
                  const statusColor = item.score <= 10 ? "bg-green-100 text-green-800" : 
                                     item.score <= 15 ? "bg-blue-100 text-blue-800" : 
                                     item.score <= 20 ? "bg-yellow-100 text-yellow-800" : 
                                     "bg-red-100 text-red-800";
                  
                  const riskLevel = item.score <= 10 ? "Low" : 
                                   item.score <= 15 ? "Moderate" : 
                                   item.score <= 20 ? "High" : 
                                   "Critical";
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.auditComponent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.incidentComponent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.documentationComponent}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                          {riskLevel}
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

export default Compliance;
