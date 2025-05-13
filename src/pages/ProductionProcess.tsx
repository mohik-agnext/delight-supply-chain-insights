import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { TrendViewSelector, TrendViewType } from "@/components/dashboard/TrendViewSelector";
import { 
  rawMaterialParameters,
  doughPreparationParameters,
  bakingParameters,
  operationalParameters,
  rawMaterialTrends,
  rawMaterialWeeklyTrends,
  rawMaterialBatchData,
  doughPreparationTrends,
  doughPreparationWeeklyTrends,
  doughPreparationBatchData,
  bakingTrends,
  bakingWeeklyTrends,
  bakingBatchData,
  productionYieldByVendor,
  productionYieldWeeklyTrends,
  batchConsistencyByVendor,
  batchConsistencyWeeklyTrends,
  batchConsistencyBatchData,
  rejectionRateByVendor,
  rejectionRateWeeklyTrends,
  rejectionRateBatchData,
  productionHealthIndex,
  healthIndicesByCategory
} from "@/data/biscuitManufacturingData";
import { ParametersTable } from "@/components/dashboard/ParametersTable";
import { HealthIndexGauge } from "@/components/dashboard/HealthIndexGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductionProcess = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [rawMaterialView, setRawMaterialView] = useState<TrendViewType>("monthly");
  const [doughPrepView, setDoughPrepView] = useState<TrendViewType>("monthly");
  const [bakingView, setBakingView] = useState<TrendViewType>("monthly");
  const [yieldView, setYieldView] = useState<TrendViewType>("monthly");
  const [consistencyView, setConsistencyView] = useState<TrendViewType>("monthly");
  const [rejectionView, setRejectionView] = useState<TrendViewType>("monthly");

  // Calculate average values for stat cards
  const avgFlourMoisture = rawMaterialParameters.find(param => param.name === "Flour Moisture Content")?.value || 0;
  const avgDoughTemp = doughPreparationParameters.find(param => param.name === "Dough Temperature")?.value || 0;
  const avgOvenTemp = bakingParameters.find(param => param.name === "Oven Temperature")?.value || 0;
  const avgYield = operationalParameters.find(param => param.name === "Production Yield")?.value || 0;
  
  // Custom colors for better visualization
  const vendorColors = ["#0EA5E9", "#8B5CF6", "#F43F5E", "#10B981", "#F59E0B"];
  const consistencyColors = ["#10B981", "#22C55E", "#84CC16", "#EAB308", "#F59E0B"];
  const rejectionColors = ["#10B981", "#F97316", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <DashboardLayout title="Production Process">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 lg:col-span-1 bg-white rounded-lg border p-4 shadow-sm">
            <HealthIndexGauge 
              value={productionHealthIndex} 
              title="Production Health Index" 
              size={120}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Flour Moisture"
                value={`${avgFlourMoisture}%`}
                trend={0.2}
                className="h-full"
              />
              <StatCard
                title="Dough Temperature"
                value={`${avgDoughTemp}°C`}
                trend={-0.3}
                className="h-full"
              />
              <StatCard
                title="Oven Temperature"
                value={`${avgOvenTemp}°C`}
                trend={0.3}
                className="h-full"
              />
              <StatCard
                title="Production Yield"
                value={`${avgYield}%`}
                trend={1.5}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
          <TabsTrigger value="dough-preparation">Dough Preparation</TabsTrigger>
          <TabsTrigger value="baking">Baking</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Health Index by Category">
              <div className="flex flex-wrap justify-around items-center pt-4">
                {healthIndicesByCategory.map((category) => (
                  <HealthIndexGauge 
                    key={category.name}
                    value={category.index} 
                    title={category.name} 
                    size={100}
                  />
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard title="Production Yield by Vendor">
              <TrendViewSelector
                activeView={yieldView}
                onChange={setYieldView}
                monthlyView={
                  <BarChart
                    data={productionYieldByVendor}
                    dataKey="yield"
                    nameKey="name"
                    barColor="#0EA5E9"
                    xAxisLabel="Vendor"
                    yAxisLabel="Yield (%)"
                    legendPosition="top"
                    customColors={vendorColors}
                    showBarValues={true}
                    targetLine={90}
                    customLabel="Production Yield (%)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={productionYieldWeeklyTrends}
                    dataKey="Vendor A"
                    nameKey="week"
                    lineColor="#0EA5E9"
                    xAxisLabel="Week"
                    yAxisLabel="Yield (%)"
                    legendPosition="top"
                    additionalLines={[
                      { dataKey: "Vendor B", color: "#8B5CF6" },
                      { dataKey: "Vendor C", color: "#F43F5E" },
                      { dataKey: "Vendor D", color: "#10B981" },
                      { dataKey: "Vendor E", color: "#F59E0B" },
                    ]}
                    showToleranceBand={true}
                    toleranceMin={85}
                    toleranceMax={95}
                  />
                }
                batchView={
                  <BarChart
                    data={productionYieldWeeklyTrends}
                    dataKey="Vendor A"
                    nameKey="week"
                    barColor="#0EA5E9"
                    xAxisLabel="Week"
                    yAxisLabel="Yield (%)"
                    legendPosition="top"
                    additionalBars={[
                      { dataKey: "Vendor B", color: "#8B5CF6" },
                      { dataKey: "Vendor C", color: "#F43F5E" },
                      { dataKey: "Vendor D", color: "#10B981" },
                      { dataKey: "Vendor E", color: "#F59E0B" },
                    ]}
                    showBarValues={true}
                    barGap={0.1}
                  />
                }
              />
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Batch Consistency Score">
              <TrendViewSelector
                activeView={consistencyView}
                onChange={setConsistencyView}
                monthlyView={
                  <BarChart
                    data={batchConsistencyByVendor}
                    dataKey="score"
                    nameKey="name"
                    barColor="#8B5CF6"
                    xAxisLabel="Vendor"
                    yAxisLabel="Score (0-100)"
                    legendPosition="top"
                    customColors={consistencyColors}
                    showBarValues={true}
                    customLabel="Batch Consistency (Score out of 100)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={batchConsistencyWeeklyTrends}
                    dataKey="Vendor A"
                    nameKey="week"
                    lineColor="#10B981"
                    xAxisLabel="Week"
                    yAxisLabel="Score (0-100)"
                    legendPosition="top"
                    additionalLines={[
                      { dataKey: "Vendor B", color: "#8B5CF6" },
                      { dataKey: "Vendor C", color: "#F43F5E" },
                      { dataKey: "Vendor D", color: "#0EA5E9" },
                      { dataKey: "Vendor E", color: "#F59E0B" },
                    ]}
                    showToleranceBand={true}
                    toleranceMin={80}
                    toleranceMax={95}
                  />
                }
                batchView={
                  <BarChart
                    data={batchConsistencyBatchData}
                    dataKey="Vendor A"
                    nameKey="batch"
                    barColor="#10B981"
                    xAxisLabel="Batch"
                    yAxisLabel="Score (0-100)"
                    legendPosition="top"
                    additionalBars={[
                      { dataKey: "Vendor B", color: "#8B5CF6" },
                      { dataKey: "Vendor C", color: "#F43F5E" },
                      { dataKey: "Vendor D", color: "#0EA5E9" },
                      { dataKey: "Vendor E", color: "#F59E0B" },
                    ]}
                    showBarValues={true}
                    barGap={0.1}
                  />
                }
              />
            </DashboardCard>
            
            <DashboardCard title="Rejection Rate by Vendor">
              <TrendViewSelector
                activeView={rejectionView}
                onChange={setRejectionView}
                monthlyView={
                  <BarChart
                    data={rejectionRateByVendor}
                    dataKey="rate"
                    nameKey="name"
                    barColor="#EF4444"
                    xAxisLabel="Vendor"
                    yAxisLabel="Rate (%)"
                    legendPosition="top"
                    customColors={rejectionColors}
                    showBarValues={true}
                    customLabel="Rejection Rate (%)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={rejectionRateWeeklyTrends}
                    dataKey="Vendor A"
                    nameKey="week"
                    lineColor="#10B981"
                    xAxisLabel="Week"
                    yAxisLabel="Rate (%)"
                    legendPosition="top"
                    additionalLines={[
                      { dataKey: "Vendor B", color: "#F97316" },
                      { dataKey: "Vendor C", color: "#EF4444" },
                      { dataKey: "Vendor D", color: "#8B5CF6" },
                      { dataKey: "Vendor E", color: "#EC4899" },
                    ]}
                    showToleranceBand={true}
                    toleranceMin={2}
                    toleranceMax={5}
                  />
                }
                batchView={
                  <BarChart
                    data={rejectionRateBatchData}
                    dataKey="Vendor A"
                    nameKey="batch"
                    barColor="#10B981"
                    xAxisLabel="Batch"
                    yAxisLabel="Rate (%)"
                    legendPosition="top"
                    additionalBars={[
                      { dataKey: "Vendor B", color: "#F97316" },
                      { dataKey: "Vendor C", color: "#EF4444" },
                      { dataKey: "Vendor D", color: "#8B5CF6" },
                      { dataKey: "Vendor E", color: "#EC4899" },
                    ]}
                    showBarValues={true}
                    barGap={0.1}
                  />
                }
              />
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="raw-materials">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Raw Material Parameters">
              <ParametersTable parameters={rawMaterialParameters} title="Current Raw Material Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Raw Material Trends">
              <TrendViewSelector
                activeView={rawMaterialView}
                onChange={setRawMaterialView}
                monthlyView={
                  <LineChart
                    data={rawMaterialTrends}
                    dataKey="Flour Moisture"
                    nameKey="month"
                    lineColor="#0EA5E9"
                    xAxisLabel="Month"
                    yAxisLabel="Value"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={10}
                    toleranceMax={15}
                    customLabel="Flour Moisture Content (%)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={rawMaterialWeeklyTrends}
                    dataKey="Flour Moisture"
                    nameKey="week"
                    lineColor="#0EA5E9"
                    xAxisLabel="Week"
                    yAxisLabel="Value"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={10}
                    toleranceMax={15}
                    customLabel="Flour Moisture Content (%)"
                  />
                }
                batchView={
                  <BarChart
                    data={rawMaterialBatchData}
                    dataKey="Flour Moisture"
                    nameKey="batch"
                    barColor="#0EA5E9"
                    xAxisLabel="Batch"
                    yAxisLabel="Value"
                    legendPosition="top"
                    showBarValues={true}
                    customLabel="Flour Moisture Content (%)"
                  />
                }
              />
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="dough-preparation">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Dough Preparation Parameters">
              <ParametersTable parameters={doughPreparationParameters} title="Current Dough Preparation Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Dough Preparation Trends">
              <TrendViewSelector
                activeView={doughPrepView}
                onChange={setDoughPrepView}
                monthlyView={
                  <LineChart
                    data={doughPreparationTrends}
                    dataKey="Temperature"
                    nameKey="month"
                    lineColor="#10B981"
                    xAxisLabel="Month"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={20}
                    toleranceMax={30}
                    customLabel="Dough Temperature (°C)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={doughPreparationWeeklyTrends}
                    dataKey="Temperature"
                    nameKey="week"
                    lineColor="#10B981"
                    xAxisLabel="Week"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={20}
                    toleranceMax={30}
                    customLabel="Dough Temperature (°C)"
                  />
                }
                batchView={
                  <BarChart
                    data={doughPreparationBatchData}
                    dataKey="Temperature"
                    nameKey="batch"
                    barColor="#10B981"
                    xAxisLabel="Batch"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showBarValues={true}
                    customLabel="Dough Temperature (°C)"
                  />
                }
              />
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="baking">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Baking Parameters">
              <ParametersTable parameters={bakingParameters} title="Current Baking Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Baking Temperature Trend">
              <TrendViewSelector
                activeView={bakingView}
                onChange={setBakingView}
                monthlyView={
                  <LineChart
                    data={bakingTrends}
                    dataKey="Oven Temperature"
                    nameKey="month"
                    lineColor="#F59E0B"
                    xAxisLabel="Month"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={165}
                    toleranceMax={195}
                    customLabel="Oven Temperature (°C)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={bakingWeeklyTrends}
                    dataKey="Oven Temperature"
                    nameKey="week"
                    lineColor="#F59E0B"
                    xAxisLabel="Week"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={165}
                    toleranceMax={195}
                    customLabel="Oven Temperature (°C)"
                  />
                }
                batchView={
                  <BarChart
                    data={bakingBatchData}
                    dataKey="Oven Temperature"
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
          </div>
        </TabsContent>

        <TabsContent value="operational">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Operational Parameters">
              <ParametersTable parameters={operationalParameters} title="Current Operational Parameters" />
            </DashboardCard>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard title="Production Yield by Vendor">
                <TrendViewSelector
                  activeView={yieldView}
                  onChange={setYieldView}
                  monthlyView={
                    <BarChart
                      data={productionYieldByVendor}
                      dataKey="yield"
                      nameKey="name"
                      barColor="#0EA5E9"
                      xAxisLabel="Vendor"
                      yAxisLabel="Yield (%)"
                      legendPosition="top"
                      customColors={vendorColors}
                      showBarValues={true}
                      targetLine={90}
                      customLabel="Production Yield (%)"
                    />
                  }
                  weeklyView={
                    <LineChart
                      data={productionYieldWeeklyTrends}
                      dataKey="Vendor A"
                      nameKey="week"
                      lineColor="#0EA5E9"
                      xAxisLabel="Week"
                      yAxisLabel="Yield (%)"
                      legendPosition="top"
                      additionalLines={[
                        { dataKey: "Vendor B", color: "#8B5CF6" },
                        { dataKey: "Vendor C", color: "#F43F5E" },
                        { dataKey: "Vendor D", color: "#10B981" },
                        { dataKey: "Vendor E", color: "#F59E0B" },
                      ]}
                      showToleranceBand={true}
                      toleranceMin={85}
                      toleranceMax={95}
                    />
                  }
                  batchView={
                    <BarChart
                      data={productionYieldWeeklyTrends}
                      dataKey="Vendor A"
                      nameKey="week"
                      barColor="#0EA5E9"
                      xAxisLabel="Week"
                      yAxisLabel="Yield (%)"
                      legendPosition="top"
                      additionalBars={[
                        { dataKey: "Vendor B", color: "#8B5CF6" },
                        { dataKey: "Vendor C", color: "#F43F5E" },
                        { dataKey: "Vendor D", color: "#10B981" },
                        { dataKey: "Vendor E", color: "#F59E0B" },
                      ]}
                      showBarValues={true}
                      barGap={0.1}
                    />
                  }
                />
              </DashboardCard>
              
              <DashboardCard title="Rejection Rate by Vendor">
                <TrendViewSelector
                  activeView={rejectionView}
                  onChange={setRejectionView}
                  monthlyView={
                    <BarChart
                      data={rejectionRateByVendor}
                      dataKey="rate"
                      nameKey="name"
                      barColor="#EF4444"
                      xAxisLabel="Vendor"
                      yAxisLabel="Rate (%)"
                      legendPosition="top"
                      customColors={rejectionColors}
                      showBarValues={true}
                      customLabel="Rejection Rate (%)"
                    />
                  }
                  weeklyView={
                    <LineChart
                      data={rejectionRateWeeklyTrends}
                      dataKey="Vendor A"
                      nameKey="week"
                      lineColor="#10B981"
                      xAxisLabel="Week"
                      yAxisLabel="Rate (%)"
                      legendPosition="top"
                      additionalLines={[
                        { dataKey: "Vendor B", color: "#F97316" },
                        { dataKey: "Vendor C", color: "#EF4444" },
                        { dataKey: "Vendor D", color: "#8B5CF6" },
                        { dataKey: "Vendor E", color: "#EC4899" },
                      ]}
                      showToleranceBand={true}
                      toleranceMin={2}
                      toleranceMax={5}
                    />
                  }
                  batchView={
                    <BarChart
                      data={rejectionRateBatchData}
                      dataKey="Vendor A"
                      nameKey="batch"
                      barColor="#10B981"
                      xAxisLabel="Batch"
                      yAxisLabel="Rate (%)"
                      legendPosition="top"
                      additionalBars={[
                        { dataKey: "Vendor B", color: "#F97316" },
                        { dataKey: "Vendor C", color: "#EF4444" },
                        { dataKey: "Vendor D", color: "#8B5CF6" },
                        { dataKey: "Vendor E", color: "#EC4899" },
                      ]}
                      showBarValues={true}
                      barGap={0.1}
                    />
                  }
                />
              </DashboardCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProductionProcess;
