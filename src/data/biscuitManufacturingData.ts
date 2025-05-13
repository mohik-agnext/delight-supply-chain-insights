
// Biscuit Manufacturing Data for Production Process Dashboard

// Helper function to determine status based on value and range
export const getStatusFromRange = (value: number, min: number, max: number) => {
  if (value >= min && value <= max) {
    return "in-range";
  } else {
    return "out-of-range";
  }
};

// Raw Material Parameters
export const rawMaterialParameters = [
  { 
    name: "Flour Moisture Content", 
    value: 12.5, 
    unit: "%", 
    minRange: 10, 
    maxRange: 15,
    status: "in-range",
    vendor: "Vendor A"
  },
  { 
    name: "Gluten Strength", 
    value: 32.4, 
    unit: "%", 
    minRange: 20, 
    maxRange: 40,
    status: "in-range", 
    vendor: "Vendor A"
  },
  { 
    name: "Sugar Content in Dough", 
    value: 22.8, 
    unit: "%", 
    minRange: 20, 
    maxRange: 30,
    status: "in-range",
    vendor: "Vendor B"
  },
  { 
    name: "Fat Content in Dough", 
    value: 18.5, 
    unit: "%", 
    minRange: 10, 
    maxRange: 25,
    status: "in-range",
    vendor: "Vendor C" 
  },
  { 
    name: "Leavening Agent Quality", 
    value: 97.2, 
    unit: "% active", 
    minRange: 95, 
    maxRange: 100,
    status: "in-range", 
    vendor: "Vendor D"
  },
  { 
    name: "Water Quality", 
    value: 7.3, 
    unit: "pH", 
    minRange: 6.5, 
    maxRange: 7.5,
    status: "in-range",
    vendor: "Vendor A" 
  }
];

// Track raw material parameters over time (last 6 months)
export const rawMaterialTrends = [
  { month: "Jan", "Flour Moisture": 12.8, "Gluten Strength": 31.5, "Sugar Content": 23.1, "Fat Content": 17.9, "Leavening Quality": 96.8, "Water pH": 7.2 },
  { month: "Feb", "Flour Moisture": 12.6, "Gluten Strength": 32.0, "Sugar Content": 22.9, "Fat Content": 18.2, "Leavening Quality": 97.0, "Water pH": 7.4 },
  { month: "Mar", "Flour Moisture": 12.3, "Gluten Strength": 32.7, "Sugar Content": 22.5, "Fat Content": 18.7, "Leavening Quality": 97.5, "Water pH": 7.3 },
  { month: "Apr", "Flour Moisture": 12.7, "Gluten Strength": 33.1, "Sugar Content": 22.6, "Fat Content": 18.4, "Leavening Quality": 96.9, "Water pH": 7.1 },
  { month: "May", "Flour Moisture": 12.4, "Gluten Strength": 32.6, "Sugar Content": 22.7, "Fat Content": 18.5, "Leavening Quality": 97.3, "Water pH": 7.2 },
  { month: "Jun", "Flour Moisture": 12.5, "Gluten Strength": 32.4, "Sugar Content": 22.8, "Fat Content": 18.5, "Leavening Quality": 97.2, "Water pH": 7.3 }
];

// Dough Preparation Parameters
export const doughPreparationParameters = [
  { 
    name: "Dough Temperature", 
    value: 25.6, 
    unit: "°C", 
    minRange: 20, 
    maxRange: 30,
    status: "in-range",
    vendor: "Vendor A" 
  },
  { 
    name: "Dough Consistency", 
    value: 475, 
    unit: "BU", 
    minRange: 400, 
    maxRange: 600,
    status: "in-range",
    vendor: "Vendor B" 
  },
  { 
    name: "Mixing Time", 
    value: 14.5, 
    unit: "min", 
    minRange: 8, 
    maxRange: 20,
    status: "in-range",
    vendor: "Vendor C" 
  },
  { 
    name: "Dough Resting Time", 
    value: 22.5, 
    unit: "min", 
    minRange: 10, 
    maxRange: 30,
    status: "in-range",
    vendor: "Vendor A" 
  },
  { 
    name: "Dough Thickness", 
    value: 3.8, 
    unit: "mm", 
    minRange: 2, 
    maxRange: 5,
    status: "in-range",
    vendor: "Vendor D" 
  },
  { 
    name: "pH of Dough", 
    value: 5.8, 
    unit: "", 
    minRange: 5.0, 
    maxRange: 7.0,
    status: "in-range",
    vendor: "Vendor A" 
  }
];

// Track dough preparation parameters over time (last 6 months)
export const doughPreparationTrends = [
  { month: "Jan", "Temperature": 26.1, "Consistency": 480, "Mixing Time": 14.2, "Resting Time": 21.8, "Thickness": 3.7, "pH": 5.9 },
  { month: "Feb", "Temperature": 25.8, "Consistency": 485, "Mixing Time": 14.5, "Resting Time": 22.3, "Thickness": 3.5, "pH": 5.7 },
  { month: "Mar", "Temperature": 25.5, "Consistency": 470, "Mixing Time": 14.8, "Resting Time": 22.0, "Thickness": 3.6, "pH": 5.6 },
  { month: "Apr", "Temperature": 25.7, "Consistency": 465, "Mixing Time": 14.6, "Resting Time": 22.7, "Thickness": 3.9, "pH": 5.8 },
  { month: "May", "Temperature": 25.9, "Consistency": 472, "Mixing Time": 14.3, "Resting Time": 22.4, "Thickness": 3.7, "pH": 5.9 },
  { month: "Jun", "Temperature": 25.6, "Consistency": 475, "Mixing Time": 14.5, "Resting Time": 22.5, "Thickness": 3.8, "pH": 5.8 }
];

// Baking Parameters
export const bakingParameters = [
  { 
    name: "Oven Temperature", 
    value: 180.5, 
    unit: "°C", 
    minRange: 150, 
    maxRange: 250,
    status: "in-range",
    vendor: "Vendor A" 
  },
  { 
    name: "Baking Time", 
    value: 12.5, 
    unit: "min", 
    minRange: 5, 
    maxRange: 20,
    status: "in-range",
    vendor: "Vendor B" 
  },
  { 
    name: "Moisture Loss During Baking", 
    value: 12.8, 
    unit: "%", 
    minRange: 10, 
    maxRange: 15,
    status: "in-range",
    vendor: "Vendor C" 
  },
  { 
    name: "Oven Humidity", 
    value: 14.5, 
    unit: "%", 
    minRange: 5, 
    maxRange: 20,
    status: "in-range",
    vendor: "Vendor A" 
  },
  { 
    name: "Crumb Temperature Post-Baking", 
    value: 95.2, 
    unit: "°C", 
    minRange: 90, 
    maxRange: 100,
    status: "in-range",
    vendor: "Vendor D" 
  }
];

// Track baking parameters over time (last 6 months)
export const bakingTrends = [
  { month: "Jan", "Oven Temperature": 182.0, "Baking Time": 12.3, "Moisture Loss": 13.1, "Oven Humidity": 13.8, "Crumb Temperature": 94.8 },
  { month: "Feb", "Oven Temperature": 181.5, "Baking Time": 12.4, "Moisture Loss": 13.0, "Oven Humidity": 14.2, "Crumb Temperature": 95.0 },
  { month: "Mar", "Oven Temperature": 180.2, "Baking Time": 12.6, "Moisture Loss": 12.5, "Oven Humidity": 14.0, "Crumb Temperature": 94.5 },
  { month: "Apr", "Oven Temperature": 180.8, "Baking Time": 12.7, "Moisture Loss": 12.7, "Oven Humidity": 14.3, "Crumb Temperature": 95.5 },
  { month: "May", "Oven Temperature": 181.0, "Baking Time": 12.4, "Moisture Loss": 12.9, "Oven Humidity": 14.7, "Crumb Temperature": 95.0 },
  { month: "Jun", "Oven Temperature": 180.5, "Baking Time": 12.5, "Moisture Loss": 12.8, "Oven Humidity": 14.5, "Crumb Temperature": 95.2 }
];

// Operational & Process Parameters
export const operationalParameters = [
  { 
    name: "Cycle Time", 
    value: 4.2, 
    unit: "hrs", 
    minRange: 2, 
    maxRange: 6,
    status: "in-range",
    vendor: "Vendor A" 
  },
  { 
    name: "Production Yield", 
    value: 92.5, 
    unit: "%", 
    minRange: 85, 
    maxRange: 100,
    status: "in-range",
    vendor: "Vendor B" 
  },
  { 
    name: "Batch Consistency Score", 
    value: 87, 
    unit: "", 
    minRange: 0, 
    maxRange: 100,
    status: "in-range",
    vendor: "Vendor C" 
  },
  { 
    name: "Rejection Rate", 
    value: 3.2, 
    unit: "%", 
    minRange: 0, 
    maxRange: 10,
    status: "in-range",
    vendor: "Vendor A" 
  }
];

// Production yield by vendor
export const productionYieldByVendor = [
  { name: "Vendor A", yield: 92.5 },
  { name: "Vendor B", yield: 90.8 },
  { name: "Vendor C", yield: 88.3 },
  { name: "Vendor D", yield: 91.7 },
  { name: "Vendor E", yield: 89.5 }
];

// Batch consistency score by vendor
export const batchConsistencyByVendor = [
  { name: "Vendor A", score: 87 },
  { name: "Vendor B", score: 82 },
  { name: "Vendor C", score: 79 },
  { name: "Vendor D", score: 85 },
  { name: "Vendor E", score: 81 }
];

// Rejection rates by vendor
export const rejectionRateByVendor = [
  { name: "Vendor A", rate: 3.2 },
  { name: "Vendor B", rate: 4.5 },
  { name: "Vendor C", rate: 5.8 },
  { name: "Vendor D", rate: 2.9 },
  { name: "Vendor E", rate: 4.1 }
];

// Overall health calculations
export const calculateProductionHealthIndex = () => {
  const allParameters = [
    ...rawMaterialParameters,
    ...doughPreparationParameters,
    ...bakingParameters,
    ...operationalParameters
  ];
  
  const inRangeCount = allParameters.filter(param => 
    param.value >= param.minRange && param.value <= param.maxRange
  ).length;
  
  return Math.round((inRangeCount / allParameters.length) * 100);
};

export const productionHealthIndex = calculateProductionHealthIndex();

// Health indices by category
export const healthIndicesByCategory = [
  { 
    name: "Raw Materials", 
    index: Math.round((rawMaterialParameters.filter(p => p.status === "in-range").length / rawMaterialParameters.length) * 100) 
  },
  { 
    name: "Dough Preparation", 
    index: Math.round((doughPreparationParameters.filter(p => p.status === "in-range").length / doughPreparationParameters.length) * 100)
  },
  { 
    name: "Baking", 
    index: Math.round((bakingParameters.filter(p => p.status === "in-range").length / bakingParameters.length) * 100)
  },
  { 
    name: "Operational", 
    index: Math.round((operationalParameters.filter(p => p.status === "in-range").length / operationalParameters.length) * 100)
  }
];
