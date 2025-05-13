
import React, { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { useFilterContext } from "@/contexts/FilterContext";
import {
  fatProteinContent,
  adulterationIndex,
  microbialLoad,
  shelfLifePrediction,
  rawMaterialRisk
} from "@/data/dashboardData";

const RawMaterial = () => {
  const { selectedVendors, selectedCategories } = useFilterContext();

  // Filter data based on selected vendors and categories
  const filteredData = useMemo(() => {
    let vendorFilter = selectedVendors;
    let categoryFilter = selectedCategories;
    
    // If "All Vendors" is selected, include all vendors
    if (vendorFilter.includes("All Vendors")) {
      vendorFilter = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];
    }
    
    // If "All Categories" is selected, include all categories
    if (categoryFilter.includes("All Categories")) {
      categoryFilter = ["Dairy", "Produce", "Meat", "Beverages"];
    }
    
    // Filter fat protein content data
    const filteredFatProtein = fatProteinContent.filter(
      (item) => vendorFilter.includes(item.name)
    );
    
    // Filter adulteration index data
    const filteredAdulteration = adulterationIndex.filter(
      (item) => vendorFilter.includes(item.name)
    );
    
    // Filter microbial load data (assumes vendor data is in columns)
    const filteredMicrobial = microbialLoad;
    
    // Filter shelf life prediction data
    const filteredShelfLife = shelfLifePrediction.filter(
      (item) => vendorFilter.includes(item.name)
    );
    
    // Filter raw material risk data
    const filteredRisk = rawMaterialRisk.filter(
      (item) => vendorFilter.includes(item.name)
    );
    
    return {
      fatProteinContent: filteredFatProtein,
      adulterationIndex: filteredAdulteration,
      microbialLoad: filteredMicrobial,
      shelfLifePrediction: filteredShelfLife,
      rawMaterialRisk: filteredRisk,
    };
  }, [selectedVendors, selectedCategories]);

  // Calculate averages for stat cards based on filtered data
  const avgFatContent = useMemo(() => {
    return (
      filteredData.fatProteinContent.reduce(
        (acc, item) => acc + parseFloat(item.fat as string), 
        0
      ) / (filteredData.fatProteinContent.length || 1)
    ).toFixed(1);
  }, [filteredData.fatProteinContent]);

  const avgProteinContent = useMemo(() => {
    return (
      filteredData.fatProteinContent.reduce(
        (acc, item) => acc + parseFloat(item.protein as string), 
        0
      ) / (filteredData.fatProteinContent.length || 1)
    ).toFixed(1);
  }, [filteredData.fatProteinContent]);

  const avgAdulterationIndex = useMemo(() => {
    return (
      filteredData.adulterationIndex.reduce(
        (acc, item) => acc + parseFloat(item.index as string), 
        0
      ) / (filteredData.adulterationIndex.length || 1)
    ).toFixed(2);
  }, [filteredData.adulterationIndex]);

  const avgShelfLife = useMemo(() => {
    return Math.round(
      filteredData.shelfLifePrediction.reduce(
        (acc, item) => acc + item.days, 
        0
      ) / (filteredData.shelfLifePrediction.length || 1)
    );
  }, [filteredData.shelfLifePrediction]);

  return (
    <DashboardLayout title="Raw Material Quality">
      <FilterBar />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Average Fat Content"
            value={`${avgFatContent}%`}
            trend={0.2}
          />
          <StatCard
            title="Average Protein Content"
            value={`${avgProteinContent}%`}
            trend={-0.1}
          />
          <StatCard
            title="Adulteration Index"
            value={avgAdulterationIndex}
            trend={-0.05}
          />
          <StatCard
            title="Average Shelf Life"
            value={`${avgShelfLife} days`}
            trend={0.5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Fat & Protein Content by Vendor">
          <div className="pt-4">
            <BarChart
              data={filteredData.fatProteinContent.map(item => ({
                name: item.name,
                Fat: item.fat,
                Protein: item.protein
              }))}
              dataKey="Fat"
              nameKey="name"
              barColor="#0EA5E9"
              xAxisLabel="Vendor"
              yAxisLabel="Percentage (%)"
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Adulteration Index by Vendor">
          <div className="pt-4">
            <BarChart
              data={filteredData.adulterationIndex}
              dataKey="index"
              nameKey="name"
              barColor="#EF4444"
              xAxisLabel="Vendor"
              yAxisLabel="Index (lower is better)"
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <DashboardCard title="Microbial Load Trend">
          <LineChart
            data={filteredData.microbialLoad}
            dataKey="Vendor A"
            nameKey="month"
            lineColor="#6366F1"
            xAxisLabel="Month"
            yAxisLabel="CFU/mL"
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Shelf-Life Prediction">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Shelf Life</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.shelfLifePrediction.map((item) => {
                  const statusColor = item.days >= 7 ? "bg-green-100 text-green-800" : 
                                      item.days >= 6 ? "bg-yellow-100 text-yellow-800" : 
                                      "bg-red-100 text-red-800";
                  
                  const statusText = item.days >= 7 ? "Optimal" : 
                                    item.days >= 6 ? "Acceptable" : 
                                    "Below Standard";
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.days} days</td>
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
        
        <DashboardCard title="Raw Material Risk Index">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Microbiological Factor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adulteration Factor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.rawMaterialRisk.map((item) => {
                  const risk = parseFloat(item.risk as string);
                  const statusColor = risk < 20 ? "bg-green-100 text-green-800" : 
                                     risk < 30 ? "bg-yellow-100 text-yellow-800" : 
                                     "bg-red-100 text-red-800";
                  
                  const riskLevel = risk < 20 ? "Low" : risk < 30 ? "Medium" : "High";
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.risk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.microbiologicalFactor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.adulterationFactor}</td>
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

export default RawMaterial;
