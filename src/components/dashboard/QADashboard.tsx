import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrendViewSelector, TrendViewType } from "@/components/dashboard/TrendViewSelector";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { Chart, ChartCard, chartColors } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Generate realistic time-series data with natural fluctuations
const generateTimeSeries = (
  mean: number,
  variance: number,
  points: number,
  trend: "up" | "down" | "stable" = "stable",
  hasSpike = false
) => {
  const result = [];
  
  for (let i = 0; i < points; i++) {
    // Add some random variation
    const noise = (Math.random() - 0.5) * variance;
    
    // Add trend component
    let trendFactor = 0;
    if (trend === "up") trendFactor = (i / points) * variance;
    else if (trend === "down") trendFactor = -((i / points) * variance);
    
    // Add occasional spike
    let spike = 0;
    if (hasSpike && (i === Math.floor(points / 3) || i === Math.floor(points * 0.7))) {
      spike = (Math.random() > 0.5 ? 1 : -1) * variance * 2;
    }
    
    // Calculate final value
    let value = mean + noise + trendFactor + spike;
    
    // Ensure non-negative values for rates
    if (mean < 10) value = Math.max(0.5, value);
    
    result.push(Number(value.toFixed(1)));
  }
  
  return result;
};

// Generate more realistic dataset for the QA Dashboard
const generateQAData = () => {
  // Time periods
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  const batches = ["Batch 101", "Batch 102", "Batch 103", "Batch 104", "Batch 105", "Batch 106"];

  // Temperature trends with natural variations (230°C ± 15°C)
  const ovenTemperatureMonthly = generateTimeSeries(230, 15, 6, "stable", true);
  const ovenTemperatureWeekly = generateTimeSeries(230, 12, 6, "stable", true);
  const ovenTemperatureBatch = generateTimeSeries(230, 10, 6, "stable", false);

  // Rejection rate variations (2% to 8%)
  const rejectionRateMonthly = generateTimeSeries(5, 3, 6, "down", true);
  const rejectionRateWeekly = generateTimeSeries(4.5, 2.5, 6, "down", true);
  const rejectionRateBatch = generateTimeSeries(4, 2, 6, "down", false);

  // Batch consistency score (88 to 96)
  const batchConsistencyMonthly = generateTimeSeries(92, 4, 6, "up", true);
  const batchConsistencyWeekly = generateTimeSeries(91, 3, 6, "up", true);
  const batchConsistencyBatch = generateTimeSeries(90, 2, 6, "up", false);

  // Moisture content variations
  const moistureContentMonthly = generateTimeSeries(12.5, 1.5, 6, "stable", true);
  const moistureContentWeekly = generateTimeSeries(12.3, 1.2, 6, "stable", true);
  const moistureContentBatch = generateTimeSeries(12.4, 1, 6, "stable", false);

  // Build data objects
  return {
    // Monthly data
    ovenTemperatureMonthly: months.map((month, i) => ({
      month,
      temperature: ovenTemperatureMonthly[i]
    })),
    rejectionRateMonthly: months.map((month, i) => ({
      month,
      rate: rejectionRateMonthly[i]
    })),
    batchConsistencyMonthly: months.map((month, i) => ({
      month,
      score: batchConsistencyMonthly[i]
    })),
    moistureContentMonthly: months.map((month, i) => ({
      month,
      content: moistureContentMonthly[i]
    })),

    // Weekly data
    ovenTemperatureWeekly: weeks.map((week, i) => ({
      week,
      temperature: ovenTemperatureWeekly[i]
    })),
    rejectionRateWeekly: weeks.map((week, i) => ({
      week,
      rate: rejectionRateWeekly[i]
    })),
    batchConsistencyWeekly: weeks.map((week, i) => ({
      week,
      score: batchConsistencyWeekly[i]
    })),
    moistureContentWeekly: weeks.map((week, i) => ({
      week,
      content: moistureContentWeekly[i]
    })),

    // Batch data
    ovenTemperatureBatch: batches.map((batch, i) => ({
      batch,
      temperature: ovenTemperatureBatch[i]
    })),
    rejectionRateBatch: batches.map((batch, i) => ({
      batch,
      rate: rejectionRateBatch[i]
    })),
    batchConsistencyBatch: batches.map((batch, i) => ({
      batch,
      score: batchConsistencyBatch[i]
    })),
    moistureContentBatch: batches.map((batch, i) => ({
      batch,
      content: moistureContentBatch[i]
    })),
  };
};

// Multi-vendor data for comparison charts
const generateVendorComparisonData = () => {
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  
  // Generate weekly data for each vendor
  const weeklyData = weeks.map((week) => {
    const result: Record<string, any> = { week };
    
    vendors.forEach((vendor, i) => {
      // Different means and variations for different vendors
      result[`${vendor} Rejection`] = generateTimeSeries(3 + i, 1 + i * 0.5, 1)[0];
      result[`${vendor} Consistency`] = generateTimeSeries(95 - i * 2, 3, 1)[0];
    });
    
    return result;
  });
  
  return { weeklyData, vendors };
};

const qaData = generateQAData();
const vendorData = generateVendorComparisonData();

export const QADashboard: React.FC = () => {
  const [ovenTempView, setOvenTempView] = useState<TrendViewType>("monthly");
  const [rejectionRateView, setRejectionRateView] = useState<TrendViewType>("monthly");
  const [consistencyView, setConsistencyView] = useState<TrendViewType>("monthly");
  const [moistureView, setMoistureView] = useState<TrendViewType>("monthly");
  
  return (
    <div className="w-full" id="qa-dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">QA Dashboard – Realistic Trends & Visual Enhancements</h1>
        <p className="text-gray-500">
          Enhanced dashboard with realistic trend variations and improved visualization
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Avg. Batch Consistency"
          value="91.5"
          trend={2.3}
          trendLabel="vs. last month"
          className="h-full"
        />
        <StatCard
          title="Avg. Baking Temperature"
          value="230°C"
          trend={-0.8}
          trendLabel="vs. target"
          className="h-full"
        />
        <StatCard
          title="Rejection Rate"
          value="4.2%"
          trend={-1.1}
          trendLabel="vs. last month"
          isUpPositive={false}
          className="h-full"
        />
        <StatCard
          title="Moisture Content"
          value="12.5%"
          trend={0.3}
          trendLabel="vs. target"
          className="h-full"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Baking Temperature Trend">
          <TrendViewSelector
            activeView={ovenTempView}
            onChange={setOvenTempView}
            monthlyView={
              <LineChart
                data={qaData.ovenTemperatureMonthly}
                dataKey="temperature"
                nameKey="month"
                lineColor="#F59E0B"
                xAxisLabel="Month"
                yAxisLabel="Temperature (°C)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={215}
                toleranceMax={245}
                customLabel="Oven Temperature (°C)"
              />
            }
            weeklyView={
              <LineChart
                data={qaData.ovenTemperatureWeekly}
                dataKey="temperature"
                nameKey="week"
                lineColor="#F59E0B"
                xAxisLabel="Week"
                yAxisLabel="Temperature (°C)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={215}
                toleranceMax={245}
                customLabel="Oven Temperature (°C)"
              />
            }
            batchView={
              <BarChart
                data={qaData.ovenTemperatureBatch}
                dataKey="temperature"
                nameKey="batch"
                barColor="#F59E0B"
                xAxisLabel="Batch"
                yAxisLabel="Temperature (°C)"
                legendPosition="top"
                showBarValues={true}
                customLabel="Oven Temperature (°C)"
              />
            }
          />
        </DashboardCard>
        
        <DashboardCard title="Rejection Rate Trend">
          <TrendViewSelector
            activeView={rejectionRateView}
            onChange={setRejectionRateView}
            monthlyView={
              <LineChart
                data={qaData.rejectionRateMonthly}
                dataKey="rate"
                nameKey="month"
                lineColor="#EF4444"
                xAxisLabel="Month"
                yAxisLabel="Rate (%)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={2}
                toleranceMax={5}
                customLabel="Rejection Rate (%)"
              />
            }
            weeklyView={
              <LineChart
                data={qaData.rejectionRateWeekly}
                dataKey="rate"
                nameKey="week"
                lineColor="#EF4444"
                xAxisLabel="Week"
                yAxisLabel="Rate (%)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={2}
                toleranceMax={5}
                customLabel="Rejection Rate (%)"
              />
            }
            batchView={
              <BarChart
                data={qaData.rejectionRateBatch}
                dataKey="rate"
                nameKey="batch"
                barColor="#EF4444"
                xAxisLabel="Batch"
                yAxisLabel="Rate (%)"
                legendPosition="top"
                showBarValues={true}
                customLabel="Rejection Rate (%)"
              />
            }
          />
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Batch Consistency Score">
          <TrendViewSelector
            activeView={consistencyView}
            onChange={setConsistencyView}
            monthlyView={
              <LineChart
                data={qaData.batchConsistencyMonthly}
                dataKey="score"
                nameKey="month"
                lineColor="#10B981"
                xAxisLabel="Month"
                yAxisLabel="Score (0-100)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={88}
                toleranceMax={96}
                customLabel="Batch Consistency (Score out of 100)"
              />
            }
            weeklyView={
              <LineChart
                data={qaData.batchConsistencyWeekly}
                dataKey="score"
                nameKey="week"
                lineColor="#10B981"
                xAxisLabel="Week"
                yAxisLabel="Score (0-100)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={88}
                toleranceMax={96}
                customLabel="Batch Consistency (Score out of 100)"
              />
            }
            batchView={
              <BarChart
                data={qaData.batchConsistencyBatch}
                dataKey="score"
                nameKey="batch"
                barColor="#10B981"
                xAxisLabel="Batch"
                yAxisLabel="Score (0-100)"
                legendPosition="top"
                showBarValues={true}
                customLabel="Batch Consistency (Score out of 100)"
              />
            }
          />
        </DashboardCard>
        
        <DashboardCard title="Moisture Content Trend">
          <TrendViewSelector
            activeView={moistureView}
            onChange={setMoistureView}
            monthlyView={
              <LineChart
                data={qaData.moistureContentMonthly}
                dataKey="content"
                nameKey="month"
                lineColor="#0EA5E9"
                xAxisLabel="Month"
                yAxisLabel="Content (%)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={11}
                toleranceMax={14}
                customLabel="Moisture Content (%)"
              />
            }
            weeklyView={
              <LineChart
                data={qaData.moistureContentWeekly}
                dataKey="content"
                nameKey="week"
                lineColor="#0EA5E9"
                xAxisLabel="Week"
                yAxisLabel="Content (%)"
                legendPosition="top"
                showToleranceBand={true}
                toleranceMin={11}
                toleranceMax={14}
                customLabel="Moisture Content (%)"
              />
            }
            batchView={
              <BarChart
                data={qaData.moistureContentBatch}
                dataKey="content"
                nameKey="batch"
                barColor="#0EA5E9"
                xAxisLabel="Batch"
                yAxisLabel="Content (%)"
                legendPosition="top"
                showBarValues={true}
                customLabel="Moisture Content (%)"
              />
            }
          />
        </DashboardCard>
      </div>
      
      <div className="mb-6">
        <DashboardCard title="Vendor Performance Comparison">
          <div className="pt-4">
            <Chart
              data={vendorData.weeklyData}
              type="line"
              xAxisKey="week"
              xAxisLabel="Week"
              yAxisLabel="Rate (%)"
              series={[
                { name: "Vendor A Rejection", dataKey: "Vendor A Rejection", color: chartColors[0] },
                { name: "Vendor B Rejection", dataKey: "Vendor B Rejection", color: chartColors[1] },
                { name: "Vendor C Rejection", dataKey: "Vendor C Rejection", color: chartColors[2] },
                { name: "Vendor D Rejection", dataKey: "Vendor D Rejection", color: chartColors[3] },
                { name: "Vendor E Rejection", dataKey: "Vendor E Rejection", color: chartColors[4] },
              ]}
              legendPosition="right"
              height={350}
              toleranceBand={{ min: 2, max: 6 }}
            />
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Trend in Oven Temperature"
          description="With tolerance bands showing target range"
          data={qaData.ovenTemperatureWeekly}
          type="line"
          series={[{ name: "Oven Temperature (°C)", dataKey: "temperature", color: "#F59E0B" }]}
          xAxisKey="week"
          xAxisLabel="Week"
          yAxisLabel="Temperature (°C)"
          toleranceBand={{ min: 215, max: 245, color: "#F59E0B30" }}
          height={250}
        />
        
        <ChartCard
          title="Batch-wise Consistency Score"
          description="Score out of 100 showing small variance"
          data={qaData.batchConsistencyBatch}
          type="bar"
          series={[{ name: "Consistency Score", dataKey: "score", color: "#10B981" }]}
          xAxisKey="batch"
          xAxisLabel="Batch"
          yAxisLabel="Score (0-100)"
          targetLine={90}
          height={250}
        />
      </div>
    </div>
  );
};

export default QADashboard; 