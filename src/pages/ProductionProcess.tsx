
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { 
  rawMaterialParameters,
  doughPreparationParameters,
  bakingParameters,
  operationalParameters,
  rawMaterialTrends,
  doughPreparationTrends,
  bakingTrends,
  productionYieldByVendor,
  batchConsistencyByVendor,
  rejectionRateByVendor,
  productionHealthIndex,
  healthIndicesByCategory
} from "@/data/biscuitManufacturingData";
import { ParametersTable } from "@/components/dashboard/ParametersTable";
import { HealthIndexGauge } from "@/components/dashboard/HealthIndexGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductionProcess = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Calculate average values for stat cards
  const avgFlourMoisture = rawMaterialParameters.find(param => param.name === "Flour Moisture Content")?.value || 0;
  const avgDoughTemp = doughPreparationParameters.find(param => param.name === "Dough Temperature")?.value || 0;
  const avgOvenTemp = bakingParameters.find(param => param.name === "Oven Temperature")?.value || 0;
  const avgYield = operationalParameters.find(param => param.name === "Production Yield")?.value || 0;

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
              <div className="pt-4">
                <BarChart
                  data={productionYieldByVendor}
                  dataKey="yield"
                  nameKey="name"
                  barColor="#0EA5E9"
                  xAxisLabel="Vendor"
                  yAxisLabel="Yield (%)"
                />
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Batch Consistency Score">
              <div className="pt-4">
                <BarChart
                  data={batchConsistencyByVendor}
                  dataKey="score"
                  nameKey="name"
                  barColor="#8B5CF6"
                  xAxisLabel="Vendor"
                  yAxisLabel="Score (0-100)"
                />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Rejection Rate by Vendor">
              <div className="pt-4">
                <BarChart
                  data={rejectionRateByVendor}
                  dataKey="rate"
                  nameKey="name"
                  barColor="#EF4444"
                  xAxisLabel="Vendor"
                  yAxisLabel="Rate (%)"
                />
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="raw-materials">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Raw Material Parameters">
              <ParametersTable parameters={rawMaterialParameters} title="Current Raw Material Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Raw Material Trends">
              <div className="pt-4">
                <LineChart
                  data={rawMaterialTrends}
                  dataKey="Flour Moisture"
                  nameKey="month"
                  lineColor="#0EA5E9"
                  xAxisLabel="Month"
                  yAxisLabel="Value"
                />
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="dough-preparation">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Dough Preparation Parameters">
              <ParametersTable parameters={doughPreparationParameters} title="Current Dough Preparation Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Dough Preparation Trends">
              <div className="pt-4">
                <LineChart
                  data={doughPreparationTrends}
                  dataKey="Temperature"
                  nameKey="month"
                  lineColor="#10B981"
                  xAxisLabel="Month"
                  yAxisLabel="Temperature (°C)"
                />
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="baking">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Baking Parameters">
              <ParametersTable parameters={bakingParameters} title="Current Baking Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Baking Temperature Trend">
              <div className="pt-4">
                <LineChart
                  data={bakingTrends}
                  dataKey="Oven Temperature"
                  nameKey="month"
                  lineColor="#F59E0B"
                  xAxisLabel="Month"
                  yAxisLabel="Temperature (°C)"
                />
              </div>
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
                <div className="pt-4">
                  <BarChart
                    data={productionYieldByVendor}
                    dataKey="yield"
                    nameKey="name"
                    barColor="#0EA5E9"
                    xAxisLabel="Vendor"
                    yAxisLabel="Yield (%)"
                  />
                </div>
              </DashboardCard>
              
              <DashboardCard title="Rejection Rate by Vendor">
                <div className="pt-4">
                  <BarChart
                    data={rejectionRateByVendor}
                    dataKey="rate"
                    nameKey="name"
                    barColor="#EF4444"
                    xAxisLabel="Vendor"
                    yAxisLabel="Rate (%)"
                  />
                </div>
              </DashboardCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProductionProcess;
