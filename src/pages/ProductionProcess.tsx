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
  operationalHealthData,
  BatchShift
} from "@/data/biscuitManufacturingData";
import { ParametersTable } from "@/components/dashboard/ParametersTable";
import { HealthIndexGauge } from "@/components/dashboard/HealthIndexGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterContext, DateOptionType } from "@/contexts/FilterContext";
import { isAfter, isBefore, isEqual, parseISO, format, subMonths } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchMetricItem } from "@/components/dashboard/BatchMetricItem";

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
    customDateRange,
    selectedBatchShifts,
    selectedDate,
    setSelectedDate
  } = useFilterContext();

  // Helper: get selected vendors
  const allVendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];
  const vendors = useMemo(() => {
    // If "All Vendors" is selected, return all vendors
    if (selectedVendors.includes("All Vendors")) {
      return allVendors;
    }
    // Otherwise return the specifically selected vendors
    return selectedVendors;
  }, [selectedVendors]);

  // Helper function to determine if a date is within the selected range
  const isDateInSelectedRange = useMemo(() => {
    return (dateStr: string) => {
      // Parse ISO string to Date object
      const date = parseISO(dateStr);
      
      // If specific date is selected for drill-down, prioritize it
      if (selectedDate) {
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        return dateStr === selectedDateStr;
      }
      
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
  }, [selectedDateOption, customDateRange, selectedDate]);
  
  // Helper function to determine if an item is in the selected batch shifts
  const isInSelectedBatchShifts = (shift: BatchShift) => {
    return selectedBatchShifts.includes(shift);
  };
  
  // Helper to identify outlier batches (values outside normal range)
  const isOutlier = (value: number, avgValue: number): boolean => {
    // Consider values that deviate by more than 10% as outliers
    return Math.abs(value - avgValue) / avgValue > 0.10;
  };

  // Filter data based on selected vendors, date range, and batch shifts
  const filteredHealthIndex = useMemo(() => {
    return productionHealthIndexData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  // Calculate averages for all filtered data to detect outliers
  const avgAllHealthIndex = useMemo(() => {
    return filteredHealthIndex.reduce((sum, d) => sum + d.value, 0) /
      (filteredHealthIndex.length || 1);
  }, [filteredHealthIndex]);
  
  // Filter health indices by category
  const filteredRawMaterialsHealth = useMemo(() => {
    return rawMaterialsHealthData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredDoughPreparationHealth = useMemo(() => {
    return doughPreparationHealthData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredBakingHealth = useMemo(() => {
    return bakingHealthData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredOperationalHealth = useMemo(() => {
    return operationalHealthData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredFlourMoisture = useMemo(() => {
    return flourMoistureData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredDoughTemp = useMemo(() => {
    return doughTemperatureData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredOvenTemp = useMemo(() => {
    return ovenTemperatureData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredYield = useMemo(() => {
    return productionYieldData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);

  // Filter batch consistency and rejection rate data
  const filteredBatchConsistency = useMemo(() => {
    return batchConsistencyData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);
  
  const filteredRejectionRate = useMemo(() => {
    return rejectionRateData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);

  // Filter raw material parameters
  const filteredRawMaterialParams = useMemo(() => {
    return rawMaterialParamsData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);

  // Filter dough preparation parameters
  const filteredDoughPrepParams = useMemo(() => {
    return doughPrepParamsData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);

  // Filter baking parameters
  const filteredBakingParams = useMemo(() => {
    return bakingParamsData.filter(
      d => vendors.includes(d.vendor) && 
           isDateInSelectedRange(d.date) && 
           isInSelectedBatchShifts(d.shift as BatchShift)
    );
  }, [vendors, isDateInSelectedRange, selectedBatchShifts]);

  // Calculate averages for stat cards
  const avgHealthIndex = useMemo(() => {
    if (filteredHealthIndex.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times from different vendors
    const batchGroups = filteredHealthIndex.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      // Average the values within this batch group (across selected vendors)
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredHealthIndex]);
  
  const avgFlourMoisture = useMemo(() => {
    if (filteredFlourMoisture.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredFlourMoisture.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredFlourMoisture]);
  
  const avgDoughTemp = useMemo(() => {
    if (filteredDoughTemp.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredDoughTemp.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredDoughTemp]);
  
  const avgOvenTemp = useMemo(() => {
    if (filteredOvenTemp.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredOvenTemp.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredOvenTemp]);
  
  const avgYield = useMemo(() => {
    if (filteredYield.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredYield.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredYield]);

  const avgBatchConsistency = useMemo(() => {
    if (filteredBatchConsistency.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredBatchConsistency.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredBatchConsistency]);
  
  const avgRejectionRate = useMemo(() => {
    if (filteredRejectionRate.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times
    const batchGroups = filteredRejectionRate.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredRejectionRate]);

  // Group batches by date and shift for the batch detail view
  const batchesByDate = useMemo(() => {
    if (!selectedDate) return {};
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    // Get all batches for the selected date
    const batches = filteredHealthIndex.filter(d => d.date === dateString);
    
    // Group by shift
    return batches.reduce((acc, batch) => {
      const shift = batch.shift as string;
      if (!acc[shift]) {
        acc[shift] = [];
      }
      acc[shift].push(batch);
      return acc;
    }, {} as Record<string, any[]>);
  }, [selectedDate, filteredHealthIndex]);

  // Calculate averages for health indices by category
  const avgRawMaterialsHealth = useMemo(() => {
    if (filteredRawMaterialsHealth.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times from different vendors
    const batchGroups = filteredRawMaterialsHealth.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      // Average the values within this batch group (across selected vendors)
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredRawMaterialsHealth]);
  
  const avgDoughPreparationHealth = useMemo(() => {
    if (filteredDoughPreparationHealth.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times from different vendors
    const batchGroups = filteredDoughPreparationHealth.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      // Average the values within this batch group (across selected vendors)
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredDoughPreparationHealth]);
  
  const avgBakingHealth = useMemo(() => {
    if (filteredBakingHealth.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times from different vendors
    const batchGroups = filteredBakingHealth.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      // Average the values within this batch group (across selected vendors)
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredBakingHealth]);
  
  const avgOperationalHealth = useMemo(() => {
    if (filteredOperationalHealth.length === 0) return 0;
    
    // Group by date and shift to avoid counting the same batch multiple times from different vendors
    const batchGroups = filteredOperationalHealth.reduce((groups, item) => {
      const key = `${item.date}_${item.shift}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Calculate average for each batch group first
    let totalValue = 0;
    let count = 0;
    
    Object.values(batchGroups).forEach((group: any[]) => {
      // Average the values within this batch group (across selected vendors)
      const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
      totalValue += groupAvg;
      count++;
    });
    
    return count > 0 ? totalValue / count : 0;
  }, [filteredOperationalHealth]);

  // Group batch data for visualization
  const groupedBatchData = useMemo(() => {
    // Create chart data for batch details
    const results = [];
    
    const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    
    if (dateString) {
      // Format data for selected date by shift
      for (const shift of selectedBatchShifts) {
        // Get batch ID
        const batchId = `${dateString}_${shift}`;
        
        // Find data points for this batch
        const health = filteredHealthIndex.find(d => d.batchId === batchId)?.value || 0;
        const flourMoist = filteredFlourMoisture.find(d => d.batchId === batchId)?.value || 0;
        const doughTemp = filteredDoughTemp.find(d => d.batchId === batchId)?.value || 0;
        const ovenTemp = filteredOvenTemp.find(d => d.batchId === batchId)?.value || 0;
        const yieldValue = filteredYield.find(d => d.batchId === batchId)?.value || 0;
        const consistency = filteredBatchConsistency.find(d => d.batchId === batchId)?.value || 0;
        const rejection = filteredRejectionRate.find(d => d.batchId === batchId)?.value || 0;
        
        // Check for outliers
        const healthOutlier = isOutlier(health, avgHealthIndex);
        const flourOutlier = isOutlier(flourMoist, avgFlourMoisture);
        const doughTempOutlier = isOutlier(doughTemp, avgDoughTemp);
        const ovenTempOutlier = isOutlier(ovenTemp, avgOvenTemp);
        const yieldOutlier = isOutlier(yieldValue, avgYield);
        const consistencyOutlier = isOutlier(consistency, avgBatchConsistency);
        const rejectionOutlier = isOutlier(rejection, avgRejectionRate);
        
        // Create batch result with outlier indicators
        results.push({
          batchId,
          shift: shift.charAt(0).toUpperCase() + shift.slice(1),
          health: { value: health, isOutlier: healthOutlier },
          flourMoisture: { value: flourMoist, isOutlier: flourOutlier },
          doughTemperature: { value: doughTemp, isOutlier: doughTempOutlier },
          ovenTemperature: { value: ovenTemp, isOutlier: ovenTempOutlier },
          yield: { value: yieldValue, isOutlier: yieldOutlier },
          consistency: { value: consistency, isOutlier: consistencyOutlier },
          rejection: { value: rejection, isOutlier: rejectionOutlier },
        });
      }
    }
    
    return results;
  }, [
    selectedDate, 
    selectedBatchShifts, 
    filteredHealthIndex, 
    filteredFlourMoisture, 
    filteredDoughTemp, 
    filteredOvenTemp, 
    filteredYield, 
    filteredBatchConsistency, 
    filteredRejectionRate,
    avgHealthIndex,
    avgFlourMoisture,
    avgDoughTemp,
    avgOvenTemp,
    avgYield,
    avgBatchConsistency,
    avgRejectionRate
  ]);

  // Create dynamic health indices with variation within 88-98% range
  const dynamicHealthIndices = useMemo(() => {
    // Generate varied values within 88-98% range
    const getRandomValue = () => Math.floor(Math.random() * 11) + 88; // Random between 88-98
    
    // Use calculated values as a base, but ensure they stay within range
    const rawMaterialsValue = Math.min(Math.max(Math.round(avgRawMaterialsHealth), 88), 98);
    const doughPrepValue = Math.min(Math.max(Math.round(avgDoughPreparationHealth), 88), 98);
    const bakingValue = Math.min(Math.max(Math.round(avgBakingHealth), 88), 98);
    const operationalValue = Math.min(Math.max(Math.round(avgOperationalHealth), 88), 98);
    
    // If values are outside our target range, use random values instead
    return [
      { name: "Raw Materials", index: (rawMaterialsValue >= 88 && rawMaterialsValue <= 98) ? rawMaterialsValue : getRandomValue() },
      { name: "Dough Preparation", index: (doughPrepValue >= 88 && doughPrepValue <= 98) ? doughPrepValue : getRandomValue() },
      { name: "Baking", index: (bakingValue >= 88 && bakingValue <= 98) ? bakingValue : getRandomValue() },
      { name: "Operational", index: (operationalValue >= 88 && operationalValue <= 98) ? operationalValue : getRandomValue() }
    ];
  }, [avgRawMaterialsHealth, avgDoughPreparationHealth, avgBakingHealth, avgOperationalHealth]);

  // Transform filtered data for charts
  const transformDataForCharts = useMemo(() => {
    // For bar charts (vendor comparison)
    const yieldByVendor = vendors.map(vendor => {
      const vendorData = filteredYield.filter(d => d.vendor === vendor);
      
      // Group by date and shift to avoid counting the same batch multiple times
      const batchGroups = vendorData.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      // Calculate average for each batch group first
      let totalValue = 0;
      let count = 0;
      
      Object.values(batchGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        totalValue += groupAvg;
        count++;
      });
      
      const avgYield = count > 0 ? totalValue / count : 0;
      return { name: vendor, yield: avgYield };
    });

    const consistencyByVendor = vendors.map(vendor => {
      const vendorData = filteredBatchConsistency.filter(d => d.vendor === vendor);
      
      // Group by date and shift to avoid counting the same batch multiple times
      const batchGroups = vendorData.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      // Calculate average for each batch group first
      let totalValue = 0;
      let count = 0;
      
      Object.values(batchGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        totalValue += groupAvg;
        count++;
      });
      
      const avgScore = count > 0 ? totalValue / count : 0;
      return { name: vendor, score: avgScore };
    });

    const rejectionByVendor = vendors.map(vendor => {
      const vendorData = filteredRejectionRate.filter(d => d.vendor === vendor);
      
      // Group by date and shift to avoid counting the same batch multiple times
      const batchGroups = vendorData.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      // Calculate average for each batch group first
      let totalValue = 0;
      let count = 0;
      
      Object.values(batchGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        totalValue += groupAvg;
        count++;
      });
      
      const avgRate = count > 0 ? totalValue / count : 0;
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
          // Get data for this vendor in this week
          const vendorWeekData = filteredData.filter(d => 
            d.vendor === vendor && 
            isAfter(parseISO(d.date), subMonths(weekStart, 1)) &&
            isBefore(parseISO(d.date), weekStart)
          );
          
          // Group by date and shift to avoid counting the same batch multiple times
          const batchGroups = vendorWeekData.reduce((groups, item) => {
            const key = `${item.date}_${item.shift}`;
            if (!groups[key]) {
              groups[key] = [];
            }
            groups[key].push(item);
            return groups;
          }, {});
          
          // Calculate average for each batch group first
          let totalValue = 0;
          let count = 0;
          
          Object.values(batchGroups).forEach((group: any[]) => {
            const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
            totalValue += groupAvg;
            count++;
          });
          
          const avgValue = count > 0 ? totalValue / count : 0;
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
      
      // Group by date and shift to avoid counting the same batch multiple times
      const flourGroups = flourMoistureMonthly.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      let flourTotal = 0;
      let flourCount = 0;
      
      Object.values(flourGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        flourTotal += groupAvg;
        flourCount++;
      });
      
      // Group dough temperature data
      const doughGroups = doughTempMonthly.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      let doughTotal = 0;
      let doughCount = 0;
      
      Object.values(doughGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        doughTotal += groupAvg;
        doughCount++;
      });
      
      // Group oven temperature data
      const ovenGroups = ovenTempMonthly.reduce((groups, item) => {
        const key = `${item.date}_${item.shift}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
      
      let ovenTotal = 0;
      let ovenCount = 0;
      
      Object.values(ovenGroups).forEach((group: any[]) => {
        const groupAvg = group.reduce((sum, item) => sum + item.value, 0) / group.length;
        ovenTotal += groupAvg;
        ovenCount++;
      });
      
      monthData["Flour Moisture"] = flourCount > 0 ? flourTotal / flourCount : 0;
      doughData["Dough Temperature"] = doughCount > 0 ? doughTotal / doughCount : 0;
      bakingData["Oven Temperature"] = ovenCount > 0 ? ovenTotal / ovenCount : 0;
      
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
  }, [
    vendors, 
    filteredYield, 
    filteredBatchConsistency, 
    filteredRejectionRate,
    filteredFlourMoisture,
    filteredDoughTemp,
    filteredOvenTemp,
    isDateInSelectedRange
  ]);

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
  const displayRawMaterialParams = useMemo(() => {
    // Since all parameters are now applicable to all vendors, we just
    // need to show the complete parameter list when filtering
    return dynamicRawMaterialParameters;
  }, [dynamicRawMaterialParameters]);

  const filteredDoughPreparationParameters = useMemo(() => {
    return dynamicDoughPreparationParameters;
  }, [dynamicDoughPreparationParameters]);

  const displayBakingParams = useMemo(() => {
    return dynamicBakingParameters;
  }, [dynamicBakingParameters]);

  const filteredOperationalParams = useMemo(() => {
    return dynamicOperationalParameters;
  }, [dynamicOperationalParameters]);
  
  // Custom colors for better visualization
  const vendorColors = ["#0EA5E9", "#8B5CF6", "#F43F5E", "#10B981", "#F59E0B"];
  const consistencyColors = ["#10B981", "#22C55E", "#84CC16", "#EAB308", "#F59E0B"];
  const rejectionColors = ["#10B981", "#F97316", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <DashboardLayout>
      <FilterBar 
        onDateChange={(date) => setSelectedDate(date)}
      />
      
      {/* Display batch info when a specific date is selected */}
      {selectedDate && (
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Batch Details for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <Button 
              variant="outline" 
              onClick={() => setSelectedDate(null)}
              className="text-sm"
            >
              Back to Overview
            </Button>
          </div>
          
          {groupedBatchData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedBatchData.map(batch => (
                <div 
                  key={batch.batchId}
                  className={`border rounded-lg p-4 ${
                    // Highlight batches with outliers
                    Object.values(batch).some(v => v?.isOutlier) 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{batch.shift} Batch</h4>
                    <div>
                      {Object.values(batch).some(v => v?.isOutlier) && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
                          <AlertTriangle size={14} />
                          Outlier
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <BatchMetricItem 
                      label="Health Index" 
                      value={batch.health.value} 
                      isOutlier={batch.health.isOutlier}
                      unit="%"
                    />
                    <BatchMetricItem 
                      label="Flour Moisture" 
                      value={batch.flourMoisture.value} 
                      isOutlier={batch.flourMoisture.isOutlier}
                      unit="%"
                    />
                    <BatchMetricItem 
                      label="Dough Temperature" 
                      value={batch.doughTemperature.value} 
                      isOutlier={batch.doughTemperature.isOutlier}
                      unit="°C"
                    />
                    <BatchMetricItem 
                      label="Oven Temperature" 
                      value={batch.ovenTemperature.value} 
                      isOutlier={batch.ovenTemperature.isOutlier}
                      unit="°C"
                    />
                    <BatchMetricItem 
                      label="Production Yield" 
                      value={batch.yield.value} 
                      isOutlier={batch.yield.isOutlier}
                      unit="%"
                    />
                    <BatchMetricItem 
                      label="Batch Consistency" 
                      value={batch.consistency.value} 
                      isOutlier={batch.consistency.isOutlier}
                      unit="/100"
                    />
                    <BatchMetricItem 
                      label="Rejection Rate" 
                      value={batch.rejection.value} 
                      isOutlier={batch.rejection.isOutlier}
                      unit="%"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No batch data available for selected date and filters.
            </div>
          )}
        </div>
      )}

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
              <div className="grid grid-cols-2 gap-4 pt-8">
                {dynamicHealthIndices.map((category) => (
                  <div key={category.name} className="flex justify-center">
                    <HealthIndexGauge 
                      value={category.index} 
                      title={category.name} 
                      size={140}
                    />
                  </div>
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
            {/* Conditional rendering based on selectedDate */}
            {selectedDate ? (
              <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Raw Material Batch Details for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(null)}
                    className="text-sm"
                  >
                    Back to Overview
                  </Button>
                </div>
                
                {groupedBatchData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {groupedBatchData.map(batch => {
                        // Find raw material data for this batch
                        const batchId = batch.batchId;
                        const rawMatData = filteredRawMaterialParams.find(d => d.batchId === batchId);
                        
                        if (!rawMatData) return null;
                        
                        // Get values for each parameter
                        const flourMoisture = batch.flourMoisture.value;
                        const glutenStrength = rawMatData.value?.glutenStrength || 0;
                        const sugarContent = rawMatData.value?.sugarContent || 0;
                        const fatContent = rawMatData.value?.fatContent || 0;
                        const leaveningQuality = rawMatData.value?.leaveningQuality || 0;
                        const waterQuality = rawMatData.value?.waterQuality || 0;
                        
                        // Check for outliers
                        const flourMoistureOutlier = batch.flourMoisture.isOutlier;
                        const glutenStrengthOutlier = isOutlier(glutenStrength, 85);
                        const sugarContentOutlier = isOutlier(sugarContent, 15);
                        const fatContentOutlier = isOutlier(fatContent, 12);
                        const leaveningQualityOutlier = isOutlier(leaveningQuality, 95);
                        const waterQualityOutlier = isOutlier(waterQuality, 7);
                        
                        const hasOutlier = flourMoistureOutlier || glutenStrengthOutlier || 
                                          sugarContentOutlier || fatContentOutlier ||
                                          leaveningQualityOutlier || waterQualityOutlier;
                        
                        return (
                          <div 
                            key={batch.batchId}
                            className={`border rounded-lg p-4 ${
                              hasOutlier
                                ? 'border-orange-400 bg-orange-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{batch.shift} Batch</h4>
                              <div>
                                {hasOutlier && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    Outlier
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <BatchMetricItem 
                                label="Flour Moisture" 
                                value={flourMoisture} 
                                isOutlier={flourMoistureOutlier}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Gluten Strength" 
                                value={glutenStrength} 
                                isOutlier={glutenStrengthOutlier}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Sugar Content" 
                                value={sugarContent} 
                                isOutlier={sugarContentOutlier}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Fat Content" 
                                value={fatContent} 
                                isOutlier={fatContentOutlier}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Leavening Quality" 
                                value={leaveningQuality} 
                                isOutlier={leaveningQualityOutlier}
                                unit="/100"
                              />
                              <BatchMetricItem 
                                label="Water Quality" 
                                value={waterQuality} 
                                isOutlier={waterQualityOutlier}
                                unit="/100"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No batch data available for selected date and filters.
                  </div>
                )}
              </div>
            ) : (
              <>
            <DashboardCard title="Raw Material Parameters">
                  <ParametersTable parameters={displayRawMaterialParams} title="Current Raw Material Parameters" />
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
                        yAxisLabel="%"
                    legendPosition="top"
                    showToleranceBand={true}
                        toleranceMin={12}
                        toleranceMax={14}
                        customLabel="Flour Moisture (%)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={rawMaterialWeeklyTrends}
                    dataKey="Flour Moisture"
                    nameKey="week"
                    lineColor="#0EA5E9"
                    xAxisLabel="Week"
                        yAxisLabel="%"
                    legendPosition="top"
                    showToleranceBand={true}
                        toleranceMin={12}
                        toleranceMax={14}
                        customLabel="Flour Moisture (%)"
                  />
                }
                batchView={
                  <BarChart
                    data={rawMaterialBatchData}
                    dataKey="Flour Moisture"
                    nameKey="batch"
                    barColor="#0EA5E9"
                    xAxisLabel="Batch"
                        yAxisLabel="%"
                    legendPosition="top"
                    showBarValues={true}
                        customLabel="Flour Moisture (%)"
                  />
                }
              />
            </DashboardCard>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dough-preparation">
          <div className="grid grid-cols-1 gap-6">
            {/* Conditional rendering based on selectedDate */}
            {selectedDate ? (
              <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Dough Preparation Batch Details for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(null)}
                    className="text-sm"
                  >
                    Back to Overview
                  </Button>
                </div>
                
                {groupedBatchData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {groupedBatchData.map(batch => {
                        // Find dough preparation data for this batch
                        const batchId = batch.batchId;
                        const doughPrepData = filteredDoughPrepParams.find(d => d.batchId === batchId);
                        
                        if (!doughPrepData) return null;
                        
                        // Get values for each parameter
                        const doughTemperature = batch.doughTemperature.value;
                        const consistency = doughPrepData.value?.consistency || 450;
                        const mixingTime = doughPrepData.value?.mixingTime || 10;
                        const restingTime = doughPrepData.value?.restingTime || 18;
                        
                        // Check for outliers
                        const doughTempOutlier = batch.doughTemperature.isOutlier;
                        const consistencyOutlier = isOutlier(consistency, 500);
                        const mixingTimeOutlier = isOutlier(mixingTime, 12);
                        const restingTimeOutlier = isOutlier(restingTime, 20);
                        
                        const hasOutlier = doughTempOutlier || consistencyOutlier || 
                                          mixingTimeOutlier || restingTimeOutlier;
                        
                        return (
                          <div 
                            key={batch.batchId}
                            className={`border rounded-lg p-4 ${
                              hasOutlier
                                ? 'border-orange-400 bg-orange-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{batch.shift} Batch</h4>
                              <div>
                                {hasOutlier && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    Outlier
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <BatchMetricItem 
                                label="Dough Temperature" 
                                value={doughTemperature} 
                                isOutlier={doughTempOutlier}
                                unit="°C"
                              />
                              <BatchMetricItem 
                                label="Dough Consistency" 
                                value={consistency} 
                                isOutlier={consistencyOutlier}
                                unit="BU"
                              />
                              <BatchMetricItem 
                                label="Mixing Time" 
                                value={mixingTime} 
                                isOutlier={mixingTimeOutlier}
                                unit="min"
                              />
                              <BatchMetricItem 
                                label="Resting Time" 
                                value={restingTime} 
                                isOutlier={restingTimeOutlier}
                                unit="min"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No batch data available for selected date and filters.
                  </div>
                )}
              </div>
            ) : (
              <>
            <DashboardCard title="Dough Preparation Parameters">
                  <ParametersTable parameters={filteredDoughPreparationParameters} title="Current Dough Preparation Parameters" />
            </DashboardCard>
            
                <DashboardCard title="Dough Temperature Trend">
              <TrendViewSelector
                activeView={doughPrepView}
                onChange={setDoughPrepView}
                monthlyView={
                  <LineChart
                        data={transformDataForCharts.doughPrepTrendsFiltered}
                    dataKey="Temperature"
                    nameKey="month"
                    lineColor="#8B5CF6"
                    xAxisLabel="Month"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                    toleranceMin={22}
                    toleranceMax={30}
                    customLabel="Dough Temperature (°C)"
                  />
                }
                weeklyView={
                  <LineChart
                    data={doughPreparationWeeklyTrends}
                    dataKey="Temperature"
                    nameKey="week"
                        lineColor="#8B5CF6"
                    xAxisLabel="Week"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showToleranceBand={true}
                        toleranceMin={22}
                    toleranceMax={30}
                    customLabel="Dough Temperature (°C)"
                  />
                }
                batchView={
                  <BarChart
                    data={doughPreparationBatchData}
                    dataKey="Temperature"
                    nameKey="batch"
                        barColor="#8B5CF6"
                    xAxisLabel="Batch"
                    yAxisLabel="Temperature (°C)"
                    legendPosition="top"
                    showBarValues={true}
                    customLabel="Dough Temperature (°C)"
                  />
                }
              />
            </DashboardCard>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="baking">
          <div className="grid grid-cols-1 gap-6">
            {/* Conditional rendering based on selectedDate */}
            {selectedDate ? (
              <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Baking Batch Details for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(null)}
                    className="text-sm"
                  >
                    Back to Overview
                  </Button>
                </div>
                
                {groupedBatchData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {groupedBatchData.map(batch => {
                        // Find baking data for this batch
                        const batchId = batch.batchId;
                        const bakingData = filteredBakingParams.find(d => d.batchId === batchId);
                        
                        if (!bakingData) return null;
                        
                        // Get values for each parameter
                        const ovenTemperature = batch.ovenTemperature.value;
                        const bakingTime = bakingData.value?.bakingTime || 10.5;
                        const moistureLoss = bakingData.value?.moistureLoss || 12.5;
                        const humidity = bakingData.value?.humidity || 25.0;
                        
                        // Check for outliers
                        const ovenTempOutlier = batch.ovenTemperature.isOutlier;
                        const bakingTimeOutlier = isOutlier(bakingTime, 10);
                        const moistureLossOutlier = isOutlier(moistureLoss, 12);
                        const humidityOutlier = isOutlier(humidity, 10);
                        
                        const hasOutlier = ovenTempOutlier || bakingTimeOutlier || moistureLossOutlier || humidityOutlier;
                        
                        return (
                          <div 
                            key={batch.batchId}
                            className={`border rounded-lg p-4 ${
                              hasOutlier 
                                ? 'border-orange-400 bg-orange-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{batch.shift} Batch</h4>
                              <div>
                                {hasOutlier && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    Outlier
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <BatchMetricItem 
                                label="Oven Temperature" 
                                value={ovenTemperature} 
                                isOutlier={ovenTempOutlier}
                                unit="°C"
                              />
                              <BatchMetricItem 
                                label="Baking Time" 
                                value={bakingTime} 
                                isOutlier={bakingTimeOutlier}
                                unit="min"
                              />
                              <BatchMetricItem 
                                label="Moisture Loss" 
                                value={moistureLoss} 
                                isOutlier={moistureLossOutlier}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Oven Humidity" 
                                value={humidity} 
                                isOutlier={humidityOutlier}
                                unit="%"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No batch data available for selected date and filters.
                  </div>
                )}
              </div>
            ) : (
              <>
            <DashboardCard title="Baking Parameters">
                  <ParametersTable parameters={displayBakingParams} title="Current Baking Parameters" />
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
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="operational">
          <div className="grid grid-cols-1 gap-6">
            {/* Conditional rendering based on selectedDate */}
            {selectedDate ? (
              <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Operational Batch Details for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(null)}
                    className="text-sm"
                  >
                    Back to Overview
                  </Button>
                </div>
                
                {groupedBatchData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {groupedBatchData.map(batch => {
                        // Find operational data for this batch
                        const batchId = batch.batchId;
                        
                        // Get yield and rejection rate data for this batch
                        const yieldData = productionYieldData.find(d => d.batchId === batchId);
                        const rejectionData = rejectionRateData.find(d => d.batchId === batchId);
                        const consistencyData = batchConsistencyData.find(d => d.batchId === batchId);
                        
                        // Calculate cycle time based on batch consistency and shift
                        // Morning batches typically have shorter cycle times
                        // Night batches typically have longer cycle times
                        let cycleTime;
                        if (batch.shift === "Morning") {
                          cycleTime = consistencyData 
                            ? 3.2 + ((100 - consistencyData.value) / 25)
                            : 3.8;
                        } else if (batch.shift === "Afternoon") {
                          cycleTime = consistencyData 
                            ? 3.8 + ((100 - consistencyData.value) / 22)
                            : 4.2;
                        } else { // Night
                          cycleTime = consistencyData 
                            ? 4.2 + ((100 - consistencyData.value) / 20)
                            : 4.8;
                        }
                        
                        // Determine if any operational parameters are outliers
                        const yieldOutlier = yieldData?.value < 85; // Below 85% is an outlier
                        const rejectionOutlier = rejectionData?.value > 6; // Above 6% is an outlier
                        const consistencyOutlier = consistencyData?.value < 80; // Below 80 is an outlier
                        const cycleTimeOutlier = cycleTime > 5.0; // Above 5 hours is an outlier
                        
                        const hasOutlier = yieldOutlier || rejectionOutlier || consistencyOutlier || cycleTimeOutlier;
                        
                        return (
                          <div 
                            key={batch.batchId}
                            className={`border rounded-lg p-4 ${
                              hasOutlier
                                ? 'border-orange-400 bg-orange-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{batch.shift} Batch</h4>
                              <div>
                                {hasOutlier && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    Outlier
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <BatchMetricItem 
                                label="Cycle Time" 
                                value={Number(cycleTime.toFixed(1))} 
                                isOutlier={cycleTimeOutlier}
                                unit=" hrs"
                              />
                              <BatchMetricItem 
                                label="Production Yield" 
                                value={yieldData?.value || 0} 
                                isOutlier={yieldOutlier || false}
                                unit="%"
                              />
                              <BatchMetricItem 
                                label="Batch Consistency" 
                                value={consistencyData?.value || 0} 
                                isOutlier={consistencyOutlier || false}
                                unit="/100"
                              />
                              <BatchMetricItem 
                                label="Rejection Rate" 
                                value={rejectionData?.value || 0} 
                                isOutlier={rejectionOutlier || false}
                                unit="%"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No batch data available for selected date and filters.
                  </div>
                )}
              </div>
            ) : (
              <>
                <DashboardCard title="Operational Parameters">
                  <ParametersTable parameters={filteredOperationalParams} title="Current Operational Parameters" />
                </DashboardCard>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProductionProcess;
