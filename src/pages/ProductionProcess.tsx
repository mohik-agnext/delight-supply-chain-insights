import React, { useState, useMemo } from "react";
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
  healthIndicesByCategory,
  productionHealthIndexData,
  flourMoistureData,
  doughTemperatureData,
  ovenTemperatureData,
  productionYieldData,
  batchConsistencyData,
  rejectionRateData,
  rawMaterialParamsData,
  doughPrepParamsData,
  bakingParamsData,
  rawMaterialsHealthData,
  doughPreparationHealthData,
  bakingHealthData,
  operationalHealthData
} from "@/data/biscuitManufacturingData";
import { ParametersTable } from "@/components/dashboard/ParametersTable";
import { HealthIndexGauge } from "@/components/dashboard/HealthIndexGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterContext, DateOptionType } from "@/contexts/FilterContext";
import { isAfter, isBefore, isEqual, parseISO, format, subMonths } from 'date-fns';

const ProductionProcess = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [rawMaterialView, setRawMaterialView] = useState<TrendViewType>("monthly");
  const [doughPrepView, setDoughPrepView] = useState<TrendViewType>("monthly");
  const [bakingView, setBakingView] = useState<TrendViewType>("monthly");
  const [yieldView, setYieldView] = useState<TrendViewType>("monthly");
  const [consistencyView, setConsistencyView] = useState<TrendViewType>("monthly");
  const [rejectionView, setRejectionView] = useState<TrendViewType>("monthly");

  const { 
    selectedVendors, 
    selectedTimePeriods,
    selectedDateOption,
    customDateRange
  } = useFilterContext();

  // Helper: get selected vendors
  const allVendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];
  const vendors =
    selectedVendors.includes("All Vendors") ? allVendors : selectedVendors;

  // Helper function to determine if a date is within the selected range
  const isDateInSelectedRange = useMemo(() => {
    return (dateStr: string) => {
      // Parse ISO string to Date object
      const date = parseISO(dateStr);
      
      if (selectedDateOption === "Custom Range" && customDateRange.startDate && customDateRange.endDate) {
        return (
          (isAfter(date, customDateRange.startDate) || isEqual(date, customDateRange.startDate)) && 
          (isBefore(date, customDateRange.endDate) || isEqual(date, customDateRange.endDate))
        );
      }
      
      // For preset options, calculate date range
      const today = new Date();
      let startDate = new Date();
      
      switch(selectedDateOption) {
        case "Last 6 Months":
          startDate.setMonth(today.getMonth() - 6);
          break;
        case "Last 3 Months":
          startDate.setMonth(today.getMonth() - 3);
          break;
        case "Last Month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          startDate.setMonth(today.getMonth() - 6); // Default to Last 6 Months
      }
      
      return (
        (isAfter(date, startDate) || isEqual(date, startDate)) && 
        (isBefore(date, today) || isEqual(date, today))
      );
    };
  }, [selectedDateOption, customDateRange]);

  // Filter data based on selected vendors and date range
  const filteredHealthIndex = useMemo(() => {
    return productionHealthIndexData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  // Filter health indices by category
  const filteredRawMaterialsHealth = useMemo(() => {
    return rawMaterialsHealthData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredDoughPreparationHealth = useMemo(() => {
    return doughPreparationHealthData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredBakingHealth = useMemo(() => {
    return bakingHealthData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredOperationalHealth = useMemo(() => {
    return operationalHealthData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredFlourMoisture = useMemo(() => {
    return flourMoistureData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredDoughTemp = useMemo(() => {
    return doughTemperatureData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredOvenTemp = useMemo(() => {
    return ovenTemperatureData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredYield = useMemo(() => {
    return productionYieldData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);

  // Filter batch consistency and rejection rate data
  const filteredBatchConsistency = useMemo(() => {
    return batchConsistencyData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);
  
  const filteredRejectionRate = useMemo(() => {
    return rejectionRateData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);

  // Filter raw material parameters
  const filteredRawMaterialParams = useMemo(() => {
    return rawMaterialParamsData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);

  // Filter dough preparation parameters
  const filteredDoughPrepParams = useMemo(() => {
    return doughPrepParamsData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);

  // Filter baking parameters
  const filteredBakingParams = useMemo(() => {
    return bakingParamsData.filter(
      d => vendors.includes(d.vendor) && isDateInSelectedRange(d.date)
    );
  }, [vendors, isDateInSelectedRange]);

  // Calculate averages for stat cards
  const avgHealthIndex = useMemo(() => {
    return filteredHealthIndex.reduce((sum, d) => sum + d.value, 0) /
      (filteredHealthIndex.length || 1);
  }, [filteredHealthIndex]);
  
  const avgFlourMoisture = useMemo(() => {
    return filteredFlourMoisture.reduce((sum, d) => sum + d.value, 0) /
      (filteredFlourMoisture.length || 1);
  }, [filteredFlourMoisture]);
  
  const avgDoughTemp = useMemo(() => {
    return filteredDoughTemp.reduce((sum, d) => sum + d.value, 0) /
      (filteredDoughTemp.length || 1);
  }, [filteredDoughTemp]);
  
  const avgOvenTemp = useMemo(() => {
    return filteredOvenTemp.reduce((sum, d) => sum + d.value, 0) /
      (filteredOvenTemp.length || 1);
  }, [filteredOvenTemp]);
  
  const avgYield = useMemo(() => {
    return filteredYield.reduce((sum, d) => sum + d.value, 0) /
      (filteredYield.length || 1);
  }, [filteredYield]);

  const avgBatchConsistency = useMemo(() => {
    return filteredBatchConsistency.reduce((sum, d) => sum + d.value, 0) /
      (filteredBatchConsistency.length || 1);
  }, [filteredBatchConsistency]);
  
  const avgRejectionRate = useMemo(() => {
    return filteredRejectionRate.reduce((sum, d) => sum + d.value, 0) /
      (filteredRejectionRate.length || 1);
  }, [filteredRejectionRate]);

  // Calculate averages for health indices by category
  const avgRawMaterialsHealth = useMemo(() => {
    return filteredRawMaterialsHealth.reduce((sum, d) => sum + d.value, 0) /
      (filteredRawMaterialsHealth.length || 1);
  }, [filteredRawMaterialsHealth]);
  
  const avgDoughPreparationHealth = useMemo(() => {
    return filteredDoughPreparationHealth.reduce((sum, d) => sum + d.value, 0) /
      (filteredDoughPreparationHealth.length || 1);
  }, [filteredDoughPreparationHealth]);
  
  const avgBakingHealth = useMemo(() => {
    return filteredBakingHealth.reduce((sum, d) => sum + d.value, 0) /
      (filteredBakingHealth.length || 1);
  }, [filteredBakingHealth]);
  
  const avgOperationalHealth = useMemo(() => {
    return filteredOperationalHealth.reduce((sum, d) => sum + d.value, 0) /
      (filteredOperationalHealth.length || 1);
  }, [filteredOperationalHealth]);

  // Create dynamic health indices
  const dynamicHealthIndices = useMemo(() => [
    { name: "Raw Materials", index: Math.round(avgRawMaterialsHealth) },
    { name: "Dough Preparation", index: Math.round(avgDoughPreparationHealth) },
    { name: "Baking", index: Math.round(avgBakingHealth) },
    { name: "Operational", index: Math.round(avgOperationalHealth) }
  ], [avgRawMaterialsHealth, avgDoughPreparationHealth, avgBakingHealth, avgOperationalHealth]);

  // Transform filtered data for charts
  const transformDataForCharts = useMemo(() => {
    // For bar charts (vendor comparison)
    const yieldByVendor = vendors.map(vendor => {
      const vendorData = filteredYield.filter(d => d.vendor === vendor);
      const avgYield = vendorData.reduce((sum, d) => sum + d.value, 0) / (vendorData.length || 1);
      return { name: vendor, yield: avgYield };
    });

    const consistencyByVendor = vendors.map(vendor => {
      const vendorData = filteredBatchConsistency.filter(d => d.vendor === vendor);
      const avgScore = vendorData.reduce((sum, d) => sum + d.value, 0) / (vendorData.length || 1);
      return { name: vendor, score: avgScore };
    });

    const rejectionByVendor = vendors.map(vendor => {
      const vendorData = filteredRejectionRate.filter(d => d.vendor === vendor);
      const avgRate = vendorData.reduce((sum, d) => sum + d.value, 0) / (vendorData.length || 1);
      return { name: vendor, rate: avgRate };
    });

    // For line charts (weekly trends)
    const getWeeklyData = (filteredData) => {
      const weeklyData = [];
      const today = new Date();
      
      // Last 6 weeks
      for (let i = 0; i < 6; i++) {
        const weekStart = subMonths(today, i);
        const weekLabel = `Week ${6-i}`;
        
        const weekData = { week: weekLabel };
        
        for (const vendor of vendors) {
          const vendorWeekData = filteredData.filter(d => 
            d.vendor === vendor && 
            isAfter(parseISO(d.date), subMonths(weekStart, 1)) &&
            isBefore(parseISO(d.date), weekStart)
          );
          
          const avgValue = vendorWeekData.length 
            ? vendorWeekData.reduce((sum, d) => sum + d.value, 0) / vendorWeekData.length
            : 0;
            
          weekData[vendor] = avgValue;
        }
        
        weeklyData.unshift(weekData); // Add to beginning to maintain chronological order
      }
      
      return weeklyData;
    };

    const yieldWeeklyTrends = getWeeklyData(filteredYield);
    const consistencyWeeklyTrends = getWeeklyData(filteredBatchConsistency);
    const rejectionWeeklyTrends = getWeeklyData(filteredRejectionRate);
    
    // For raw materials trends
    const rawMaterialTrendsFiltered = [];
    const doughPrepTrendsFiltered = [];
    const bakingTrendsFiltered = [];
    
    // Group by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const monthData = { month };
      const doughData = { month };
      const bakingData = { month };
      
      // Calculate average for each key metric by vendor
      const flourMoistureMonthly = filteredFlourMoisture.filter(d => 
        parseISO(d.date).getMonth() === i
      );
      
      const doughTempMonthly = filteredDoughTemp.filter(d => 
        parseISO(d.date).getMonth() === i
      );
      
      const ovenTempMonthly = filteredOvenTemp.filter(d => 
        parseISO(d.date).getMonth() === i
      );
      
      monthData["Flour Moisture"] = flourMoistureMonthly.length 
        ? flourMoistureMonthly.reduce((sum, d) => sum + d.value, 0) / flourMoistureMonthly.length
        : 0;
        
      doughData["Temperature"] = doughTempMonthly.length
        ? doughTempMonthly.reduce((sum, d) => sum + d.value, 0) / doughTempMonthly.length
        : 0;
        
      bakingData["Oven Temperature"] = ovenTempMonthly.length
        ? ovenTempMonthly.reduce((sum, d) => sum + d.value, 0) / ovenTempMonthly.length
        : 0;
      
      rawMaterialTrendsFiltered.push(monthData);
      doughPrepTrendsFiltered.push(doughData);
      bakingTrendsFiltered.push(bakingData);
    }
    
    return {
      yieldByVendor,
      consistencyByVendor,
      rejectionByVendor,
      yieldWeeklyTrends,
      consistencyWeeklyTrends,
      rejectionWeeklyTrends,
      rawMaterialTrendsFiltered,
      doughPrepTrendsFiltered,
      bakingTrendsFiltered
    };
  }, [filteredYield, filteredBatchConsistency, filteredRejectionRate, 
      filteredFlourMoisture, filteredDoughTemp, filteredOvenTemp, vendors]);

  // Calculate dynamic raw material parameters based on filtered data
  const dynamicRawMaterialParameters = useMemo(() => {
    // Calculate average values for each parameter
    const avgValues = filteredRawMaterialParams.reduce(
      (acc, item) => {
        // Extract the value object from each data point
        const value = item.value;
        
        // Sum up all values for each parameter
        acc.flourMoisture += value.flourMoisture || 0;
        acc.glutenStrength += value.glutenStrength || 0;
        acc.sugarContent += value.sugarContent || 0;
        acc.fatContent += value.fatContent || 0;
        acc.leaveningQuality += value.leaveningQuality || 0;
        acc.waterQuality += value.waterQuality || 0;
        
        return acc;
      },
      { 
        flourMoisture: 0, 
        glutenStrength: 0, 
        sugarContent: 0, 
        fatContent: 0,
        leaveningQuality: 0,
        waterQuality: 0
      }
    );
    
    // Calculate averages by dividing by the number of data points
    const count = filteredRawMaterialParams.length || 1;
    Object.keys(avgValues).forEach(key => {
      avgValues[key] = avgValues[key] / count;
    });
    
    // Update parameter values and status
    return rawMaterialParameters.map(param => {
      // Get the parameter key and corresponding average value
      const paramKey = param.paramKey;
      const avgValue = paramKey ? avgValues[paramKey] : param.value;
      
      // Determine if the value is in range
      const status = avgValue >= param.minRange && avgValue <= param.maxRange ? 
        "in-range" : "out-of-range";
        
      // Return updated parameter
      return {
        ...param,
        value: Number(avgValue.toFixed(2)),
        status
      };
    });
  }, [filteredRawMaterialParams]);

  // Calculate dynamic dough preparation parameters
  const dynamicDoughPreparationParameters = useMemo(() => {
    // Calculate average values for each parameter
    const avgValues = filteredDoughPrepParams.reduce(
      (acc, item) => {
        // Extract the value object from each data point
        const value = item.value;
        
        // Sum up all values for each parameter
        acc.temperature += value.temperature || 0;
        acc.consistency += value.consistency || 0;
        acc.mixingTime += value.mixingTime || 0;
        acc.restingTime += value.restingTime || 0;
        
        return acc;
      },
      { temperature: 0, consistency: 0, mixingTime: 0, restingTime: 0 }
    );
    
    // Calculate averages by dividing by the number of data points
    const count = filteredDoughPrepParams.length || 1;
    Object.keys(avgValues).forEach(key => {
      avgValues[key] = avgValues[key] / count;
    });
    
    // Map dough preparation parameters to include calculated values
    return doughPreparationParameters.map(param => {
      let avgValue = param.value;
      
      // Match parameter name to average value
      if (param.name === "Dough Temperature") avgValue = avgValues.temperature;
      else if (param.name === "Dough Consistency") avgValue = avgValues.consistency;
      else if (param.name === "Mixing Time") avgValue = avgValues.mixingTime;
      else if (param.name === "Dough Resting Time") avgValue = avgValues.restingTime;
      
      // Determine if the value is in range
      const status = avgValue >= param.minRange && avgValue <= param.maxRange ? 
        "in-range" : "out-of-range";
        
      // Return updated parameter
      return {
        ...param,
        value: Number(avgValue.toFixed(2)),
        status
      };
    });
  }, [filteredDoughPrepParams, doughPreparationParameters]);

  // Calculate dynamic baking parameters
  const dynamicBakingParameters = useMemo(() => {
    // Calculate average values for each parameter
    const avgValues = filteredBakingParams.reduce(
      (acc, item) => {
        // Extract the value object from each data point
        const value = item.value;
        
        // Sum up all values for each parameter
        acc.ovenTemp += value.ovenTemp || 0;
        acc.bakingTime += value.bakingTime || 0;
        acc.moistureLoss += value.moistureLoss || 0;
        acc.humidity += value.humidity || 0;
        
        return acc;
      },
      { ovenTemp: 0, bakingTime: 0, moistureLoss: 0, humidity: 0 }
    );
    
    // Calculate averages by dividing by the number of data points
    const count = filteredBakingParams.length || 1;
    Object.keys(avgValues).forEach(key => {
      avgValues[key] = avgValues[key] / count;
    });
    
    // Map baking parameters to include calculated values
    return bakingParameters.map(param => {
      let avgValue = param.value;
      
      // Match parameter name to average value
      if (param.name === "Oven Temperature") avgValue = avgValues.ovenTemp;
      else if (param.name === "Baking Time") avgValue = avgValues.bakingTime;
      else if (param.name === "Moisture Loss During Baking") avgValue = avgValues.moistureLoss;
      else if (param.name === "Oven Humidity") avgValue = avgValues.humidity;
      
      // Determine if the value is in range
      const status = avgValue >= param.minRange && avgValue <= param.maxRange ? 
        "in-range" : "out-of-range";
        
      // Return updated parameter
      return {
        ...param,
        value: Number(avgValue.toFixed(2)),
        status
      };
    });
  }, [filteredBakingParams, bakingParameters]);

  // For operational parameters, use static data for now
  const dynamicOperationalParameters = useMemo(() => {
    // Calculate average values for each parameter
    const avgValues = {
      cycleTime: filteredBatchConsistency.reduce((sum, d) => sum + (d.value / 20), 0) / (filteredBatchConsistency.length || 1), // Calculate cycle time based on batch consistency (scaled)
      productionYield: avgYield,
      batchConsistency: avgBatchConsistency,
      rejectionRate: avgRejectionRate
    };
    
    // Update parameter values and status
    return operationalParameters.map(param => {
      let avgValue = param.value;
      
      // Match parameter name to average value
      if (param.name === "Cycle Time") avgValue = avgValues.cycleTime;
      else if (param.name === "Production Yield") avgValue = avgValues.productionYield;
      else if (param.name === "Batch Consistency Score") avgValue = avgValues.batchConsistency;
      else if (param.name === "Rejection Rate") avgValue = avgValues.rejectionRate;
      
      // Determine if the value is in range
      const status = avgValue >= param.minRange && avgValue <= param.maxRange ? 
        "in-range" : "out-of-range";
        
      // Return updated parameter
      return {
        ...param,
        value: Number(avgValue.toFixed(2)),
        status
      };
    });
  }, [filteredBatchConsistency, avgYield, avgBatchConsistency, avgRejectionRate]);

  // Filter parameters tables based on vendors
  const filteredRawMaterialParameters = useMemo(() => {
    // Since all parameters are now applicable to all vendors, we just
    // need to show the complete parameter list when filtering
    return dynamicRawMaterialParameters;
  }, [dynamicRawMaterialParameters]);

  const filteredDoughPreparationParameters = useMemo(() => {
    return dynamicDoughPreparationParameters;
  }, [dynamicDoughPreparationParameters]);

  const filteredBakingParameters = useMemo(() => {
    return dynamicBakingParameters;
  }, [dynamicBakingParameters]);

  const filteredOperationalParameters = useMemo(() => {
    return dynamicOperationalParameters;
  }, [dynamicOperationalParameters]);

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
              value={Number(avgHealthIndex.toFixed(2))} 
              title="Production Health Index" 
              size={120}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Flour Moisture"
                value={`${avgFlourMoisture.toFixed(2)}%`}
                trend={0.2}
                className="h-full"
              />
              <StatCard
                title="Dough Temperature"
                value={`${avgDoughTemp.toFixed(2)}°C`}
                trend={-0.3}
                className="h-full"
              />
              <StatCard
                title="Oven Temperature"
                value={`${avgOvenTemp.toFixed(2)}°C`}
                trend={0.3}
                className="h-full"
              />
              <StatCard
                title="Production Yield"
                value={`${avgYield.toFixed(2)}%`}
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
                {dynamicHealthIndices.map((category) => (
                  <HealthIndexGauge 
                    key={category.name}
                    value={category.index} 
                    title={category.name} 
                    size={100}
                  />
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard title="Batch Consistency Score">
              <TrendViewSelector
                activeView={consistencyView}
                onChange={setConsistencyView}
                monthlyView={
                  <BarChart
                    data={transformDataForCharts.consistencyByVendor}
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
                    data={transformDataForCharts.consistencyWeeklyTrends}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Production Yield by Vendor">
              <TrendViewSelector
                activeView={yieldView}
                onChange={setYieldView}
                monthlyView={
                  <BarChart
                    data={transformDataForCharts.yieldByVendor}
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
                    data={transformDataForCharts.yieldWeeklyTrends}
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
                    data={transformDataForCharts.rejectionByVendor}
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
                    data={transformDataForCharts.rejectionWeeklyTrends}
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
              <ParametersTable parameters={filteredRawMaterialParameters} title="Current Raw Material Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Raw Material Trends">
              <TrendViewSelector
                activeView={rawMaterialView}
                onChange={setRawMaterialView}
                monthlyView={
                  <LineChart
                    data={transformDataForCharts.rawMaterialTrendsFiltered}
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
              <ParametersTable parameters={filteredDoughPreparationParameters} title="Current Dough Preparation Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Dough Preparation Trends">
              <TrendViewSelector
                activeView={doughPrepView}
                onChange={setDoughPrepView}
                monthlyView={
                  <LineChart
                    data={transformDataForCharts.doughPrepTrendsFiltered}
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
              <ParametersTable parameters={filteredBakingParameters} title="Current Baking Parameters" />
            </DashboardCard>
            
            <DashboardCard title="Baking Temperature Trend">
              <TrendViewSelector
                activeView={bakingView}
                onChange={setBakingView}
                monthlyView={
                  <LineChart
                    data={transformDataForCharts.bakingTrendsFiltered}
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
              <ParametersTable parameters={filteredOperationalParameters} title="Current Operational Parameters" />
            </DashboardCard>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard title="Production Yield by Vendor">
                <TrendViewSelector
                  activeView={yieldView}
                  onChange={setYieldView}
                  monthlyView={
                    <BarChart
                      data={transformDataForCharts.yieldByVendor}
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
                      data={transformDataForCharts.yieldWeeklyTrends}
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
                      data={transformDataForCharts.rejectionByVendor}
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
                      data={transformDataForCharts.rejectionWeeklyTrends}
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
