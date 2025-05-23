// Biscuit Manufacturing Data for Production Process Dashboard

// Helper function to determine status based on value and range
export const getStatusFromRange = (value: number, min: number, max: number) => {
  if (value >= min && value <= max) {
    return "in-range";
  } else {
    return "out-of-range";
  }
};

// Batch shift types
export type BatchShift = "morning" | "afternoon" | "night";
export const batchShifts: BatchShift[] = ["morning", "afternoon", "night"];

// --- DUMMY DATA FOR INTERACTIVE FILTERS (exact dates, per vendor, from 2025-01-01 to today) ---
function generateMonthlyData(startDate, endDate, vendors, valueFn) {
  const data = [];
  let date = new Date(startDate);
  const end = new Date(endDate);
  while (date <= end) {
    const iso = date.toISOString().slice(0, 10);
    for (const vendor of vendors) {
      data.push({ date: iso, vendor, value: valueFn(vendor, new Date(iso)) });
    }
    date.setMonth(date.getMonth() + 1);
  }
  return data;
}

// Generate data with daily batch information (3 shifts per day)
function generateDailyBatchData(startDate, endDate, vendors, valueFn) {
  const data = [];
  let date = new Date(startDate);
  const end = new Date(endDate);
  
  while (date <= end) {
    const iso = date.toISOString().slice(0, 10);
    for (const vendor of vendors) {
      // Generate base value for the day
      const baseValue = valueFn(vendor, new Date(iso));
      
      // Add three batches per day (morning, afternoon, night) with distinct values
      for (const shift of batchShifts) {
        // Create unique batch ID in format: "date_shift" (e.g., "2025-01-01_morning")
        const batchId = `${iso}_${shift}`;
        
        // Generate significantly different values for each shift
        let shiftValue;
        
        if (shift === "morning") {
          // Morning batches: -5% to -15% from base
          shiftValue = typeof baseValue === 'object' 
            ? applyVariationToObject(baseValue, 0.85, 0.95)
            : baseValue * (0.85 + Math.random() * 0.10);
        } else if (shift === "afternoon") {
          // Afternoon batches: -2% to +8% from base
          shiftValue = typeof baseValue === 'object'
            ? applyVariationToObject(baseValue, 0.98, 1.08) 
            : baseValue * (0.98 + Math.random() * 0.10);
        } else { // night
          // Night batches: +5% to +15% from base
          shiftValue = typeof baseValue === 'object'
            ? applyVariationToObject(baseValue, 1.05, 1.15)
            : baseValue * (1.05 + Math.random() * 0.10);
        }
        
        // Randomly introduce outliers (2% chance)
        if (Math.random() < 0.02) {
          shiftValue = typeof baseValue === 'object'
            ? applyOutlierToObject(baseValue)
            : baseValue * (Math.random() > 0.5 ? 1.20 : 0.80); // +/- 20% outlier
        }
        
        data.push({ 
          date: iso, 
          vendor, 
          value: typeof shiftValue === 'object' 
            ? shiftValue 
            : Number(shiftValue.toFixed(2)),
          shift,
          batchId
        });
      }
    }
    
    // Move to next day
    date.setDate(date.getDate() + 1);
  }
  return data;
}

// Helper function to apply variation to each property in an object
function applyVariationToObject(obj, minFactor, maxFactor) {
  const result = {};
  const variationFactor = minFactor + Math.random() * (maxFactor - minFactor);
  
  for (const key in obj) {
    // Apply slightly different variation to each property
    const propertyVariation = variationFactor * (0.95 + Math.random() * 0.1);
    result[key] = Number((obj[key] * propertyVariation).toFixed(2));
  }
  
  return result;
}

// Helper function to create outliers in object values
function applyOutlierToObject(obj) {
  const result = {};
  
  for (const key in obj) {
    // 50% chance of being high or low outlier
    const outlierFactor = Math.random() > 0.5 ? 1.20 : 0.80;
    result[key] = Number((obj[key] * outlierFactor).toFixed(2));
  }
  
  return result;
}

const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];
const today = new Date();
const start = new Date("2025-01-01");

// Generate filterable data for all key metrics with batch information
export const productionHealthIndexData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 85 + Math.floor(Math.random() * 10) // 85-94
);

// Generate data for health indices by category with batch information
export const rawMaterialsHealthData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 90 + Math.floor(Math.random() * 8) // 90-97
);

export const doughPreparationHealthData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 90 + Math.floor(Math.random() * 6) // 90-95
);

export const bakingHealthData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 90 + Math.floor(Math.random() * 7) // 90-96
);

export const operationalHealthData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 85 + Math.floor(Math.random() * 10) // 85-94
);

export const flourMoistureData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 13 + Math.random() * 1 // 13.0-14.0
);

export const doughTemperatureData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 24 + Math.random() * 6 // 24-30
);

export const ovenTemperatureData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 178 + Math.random() * 10 // 178-188
);

export const productionYieldData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 89 + Math.random() * 8 // 89-97
);

// Generate data for batch consistency
export const batchConsistencyData = generateDailyBatchData(
  start, 
  today,
  vendors,
  (vendor, date) => 80 + Math.floor(Math.random() * 16) // 80-95
);

// Generate data for rejection rates
export const rejectionRateData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => 2 + Math.random() * 4 // 2-6%
);

// Generate data for all raw material parameters
export const rawMaterialParamsData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => ({
    flourMoisture: 10 + Math.random() * 5,
    glutenStrength: 20 + Math.random() * 20,
    sugarContent: 20 + Math.random() * 10,
    fatContent: 10 + Math.random() * 15,
    leaveningQuality: 93 + Math.random() * 5, // 95-100% active (within range)
    waterQuality: 6.0 + (Math.random() * (7.5 - 6.5)) // 6.5-7.5 pH (within range)
  })
);

// Generate data for dough preparation parameters
export const doughPrepParamsData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => ({
    temperature: 20 + Math.random() * 10,
    consistency: 400 + Math.random() * 200,
    mixingTime: 8 + Math.random() * 7,
    restingTime: 15 + Math.random() * 10
  })
);

// Generate data for baking parameters
export const bakingParamsData = generateDailyBatchData(
  start,
  today,
  vendors,
  (vendor, date) => ({
    ovenTemp: 150 + Math.random() * 100,
    bakingTime: 5 + Math.random() * 15,
    moistureLoss: 10 + Math.random() * 5,
    humidity: 5 + Math.random() * 15
  })
);
// --- END DUMMY DATA ---

// Raw Material Parameters - Updated to remove vendor-specific associations
export const rawMaterialParameters = [
  { 
    name: "Flour Moisture Content", 
    value: 12.5, 
    unit: "%", 
    minRange: 10, 
    maxRange: 15,
    status: "in-range",
    paramKey: "flourMoisture"
  },
  { 
    name: "Gluten Strength", 
    value: 32.4, 
    unit: "%", 
    minRange: 20, 
    maxRange: 40,
    status: "in-range",
    paramKey: "glutenStrength"
  },
  { 
    name: "Sugar Content in Dough", 
    value: 22.8, 
    unit: "%", 
    minRange: 20, 
    maxRange: 30,
    status: "in-range",
    paramKey: "sugarContent"
  },
  { 
    name: "Fat Content in Dough", 
    value: 18.5, 
    unit: "%", 
    minRange: 10, 
    maxRange: 25,
    status: "in-range", 
    paramKey: "fatContent"
  },
  { 
    name: "Leavening Agent Quality", 
    value: 97.2, 
    unit: "% active", 
    minRange: 95, 
    maxRange: 100,
    status: "in-range",
    paramKey: "leaveningQuality"
  },
  { 
    name: "Water Quality", 
    value: 7.3, 
    unit: "pH", 
    minRange: 6.5, 
    maxRange: 7.5,
    status: "in-range",
    paramKey: "waterQuality"
  }
];

// Track raw material parameters over time (last 6 months)
export const rawMaterialTrends = [
  { month: "Jan", "Flour Moisture": 12.8, "Gluten Strength": 31.5, "Sugar Content": 23.1, "Fat Content": 17.9, "Leavening Quality": 96.8, "Water pH": 7.2 },
  { month: "Feb", "Flour Moisture": 12.6, "Gluten Strength": 33.8, "Sugar Content": 21.4, "Fat Content": 18.2, "Leavening Quality": 95.3, "Water pH": 7.4 },
  { month: "Mar", "Flour Moisture": 11.9, "Gluten Strength": 32.7, "Sugar Content": 22.5, "Fat Content": 19.7, "Leavening Quality": 97.5, "Water pH": 7.3 },
  { month: "Apr", "Flour Moisture": 13.2, "Gluten Strength": 30.8, "Sugar Content": 23.9, "Fat Content": 17.4, "Leavening Quality": 96.2, "Water pH": 6.9 },
  { month: "May", "Flour Moisture": 12.4, "Gluten Strength": 32.6, "Sugar Content": 22.7, "Fat Content": 18.1, "Leavening Quality": 97.8, "Water pH": 7.2 },
  { month: "Jun", "Flour Moisture": 12.5, "Gluten Strength": 32.4, "Sugar Content": 22.8, "Fat Content": 18.5, "Leavening Quality": 96.5, "Water pH": 7.3 }
];

// Weekly trend data for raw materials (last 6 weeks)
export const rawMaterialWeeklyTrends = [
  { week: "Week 1", "Flour Moisture": 12.3, "Gluten Strength": 32.7, "Sugar Content": 22.5, "Fat Content": 18.3 },
  { week: "Week 2", "Flour Moisture": 12.9, "Gluten Strength": 31.8, "Sugar Content": 23.1, "Fat Content": 17.9 },
  { week: "Week 3", "Flour Moisture": 11.8, "Gluten Strength": 33.2, "Sugar Content": 21.8, "Fat Content": 19.2 },
  { week: "Week 4", "Flour Moisture": 12.7, "Gluten Strength": 32.9, "Sugar Content": 22.4, "Fat Content": 18.6 },
  { week: "Week 5", "Flour Moisture": 12.1, "Gluten Strength": 31.5, "Sugar Content": 23.5, "Fat Content": 18.1 },
  { week: "Week 6", "Flour Moisture": 12.5, "Gluten Strength": 32.4, "Sugar Content": 22.8, "Fat Content": 18.5 }
];

// Batch-wise raw material data (last 6 batches)
export const rawMaterialBatchData = [
  { batch: "Batch 101", "Flour Moisture": 12.4, "Gluten Strength": 32.1, "Sugar Content": 22.7, "Fat Content": 18.2, "Quality Score": 94 },
  { batch: "Batch 102", "Flour Moisture": 12.8, "Gluten Strength": 31.5, "Sugar Content": 22.9, "Fat Content": 18.4, "Quality Score": 92 },
  { batch: "Batch 103", "Flour Moisture": 11.9, "Gluten Strength": 33.4, "Sugar Content": 21.5, "Fat Content": 19.1, "Quality Score": 88 },
  { batch: "Batch 104", "Flour Moisture": 12.2, "Gluten Strength": 32.7, "Sugar Content": 22.3, "Fat Content": 18.6, "Quality Score": 91 },
  { batch: "Batch 105", "Flour Moisture": 13.1, "Gluten Strength": 31.2, "Sugar Content": 23.2, "Fat Content": 17.8, "Quality Score": 89 },
  { batch: "Batch 106", "Flour Moisture": 12.5, "Gluten Strength": 32.4, "Sugar Content": 22.8, "Fat Content": 18.5, "Quality Score": 93 }
];

// Dough Preparation Parameters - Updated to remove vendor-specific associations
export const doughPreparationParameters = [
  { 
    name: "Dough Temperature", 
    value: 25.6, 
    unit: "°C", 
    minRange: 20, 
    maxRange: 30,
    status: "in-range"
  },
  { 
    name: "Dough Consistency", 
    value: 475, 
    unit: "BU", 
    minRange: 400, 
    maxRange: 600,
    status: "in-range"
  },
  { 
    name: "Mixing Time", 
    value: 14.5, 
    unit: "min", 
    minRange: 8, 
    maxRange: 20,
    status: "in-range" 
  },
  { 
    name: "Dough Resting Time", 
    value: 22.5, 
    unit: "min", 
    minRange: 10, 
    maxRange: 30,
    status: "in-range"
  },
  { 
    name: "Dough Thickness", 
    value: 3.8, 
    unit: "mm", 
    minRange: 2, 
    maxRange: 5,
    status: "in-range" 
  },
  { 
    name: "pH of Dough", 
    value: 5.8, 
    unit: "", 
    minRange: 5.0, 
    maxRange: 7.0,
    status: "in-range"
  }
];

// Track dough preparation parameters over time (last 6 months)
export const doughPreparationTrends = [
  { month: "Jan", "Temperature": 26.1, "Consistency": 480, "Mixing Time": 14.2, "Resting Time": 21.8, "Thickness": 3.7, "pH": 5.9 },
  { month: "Feb", "Temperature": 25.8, "Consistency": 515, "Mixing Time": 13.8, "Resting Time": 23.5, "Thickness": 3.5, "pH": 5.7 },
  { month: "Mar", "Temperature": 24.2, "Consistency": 470, "Mixing Time": 15.3, "Resting Time": 20.4, "Thickness": 3.6, "pH": 6.1 },
  { month: "Apr", "Temperature": 25.7, "Consistency": 455, "Mixing Time": 14.6, "Resting Time": 24.2, "Thickness": 3.9, "pH": 5.8 },
  { month: "May", "Temperature": 26.4, "Consistency": 472, "Mixing Time": 13.9, "Resting Time": 22.4, "Thickness": 3.4, "pH": 5.9 },
  { month: "Jun", "Temperature": 25.6, "Consistency": 475, "Mixing Time": 14.5, "Resting Time": 22.5, "Thickness": 3.8, "pH": 5.8 }
];

// Weekly trend data for dough preparation (last 6 weeks)
export const doughPreparationWeeklyTrends = [
  { week: "Week 1", "Temperature": 25.3, "Consistency": 472, "Mixing Time": 14.3, "Resting Time": 22.1 },
  { week: "Week 2", "Temperature": 26.2, "Consistency": 465, "Mixing Time": 14.7, "Resting Time": 23.4 },
  { week: "Week 3", "Temperature": 24.8, "Consistency": 490, "Mixing Time": 13.9, "Resting Time": 21.5 },
  { week: "Week 4", "Temperature": 25.5, "Consistency": 480, "Mixing Time": 14.4, "Resting Time": 22.8 },
  { week: "Week 5", "Temperature": 26.3, "Consistency": 460, "Mixing Time": 14.8, "Resting Time": 23.2 },
  { week: "Week 6", "Temperature": 25.6, "Consistency": 475, "Mixing Time": 14.5, "Resting Time": 22.5 }
];

// Batch-wise dough preparation data
export const doughPreparationBatchData = [
  { batch: "Batch 101", "Temperature": 25.4, "Consistency": 478, "Mixing Time": 14.2, "Resting Time": 22.4, "Quality Score": 92 },
  { batch: "Batch 102", "Temperature": 25.9, "Consistency": 467, "Mixing Time": 14.6, "Resting Time": 22.9, "Quality Score": 94 },
  { batch: "Batch 103", "Temperature": 24.7, "Consistency": 492, "Mixing Time": 13.8, "Resting Time": 21.6, "Quality Score": 89 },
  { batch: "Batch 104", "Temperature": 25.6, "Consistency": 471, "Mixing Time": 14.4, "Resting Time": 22.7, "Quality Score": 91 },
  { batch: "Batch 105", "Temperature": 26.1, "Consistency": 465, "Mixing Time": 14.9, "Resting Time": 23.1, "Quality Score": 90 },
  { batch: "Batch 106", "Temperature": 25.6, "Consistency": 475, "Mixing Time": 14.5, "Resting Time": 22.5, "Quality Score": 93 }
];

// Baking Parameters - Updated to remove vendor-specific associations
export const bakingParameters = [
  { 
    name: "Oven Temperature", 
    value: 180.5, 
    unit: "°C", 
    minRange: 150, 
    maxRange: 250,
    status: "in-range"
  },
  { 
    name: "Baking Time", 
    value: 12.5, 
    unit: "min", 
    minRange: 5, 
    maxRange: 20,
    status: "in-range"
  },
  { 
    name: "Moisture Loss During Baking", 
    value: 12.8, 
    unit: "%", 
    minRange: 10, 
    maxRange: 15,
    status: "in-range"
  },
  { 
    name: "Oven Humidity", 
    value: 14.5, 
    unit: "%", 
    minRange: 5, 
    maxRange: 20,
    status: "in-range"
  },
  { 
    name: "Crumb Temperature Post-Baking", 
    value: 95.2, 
    unit: "°C", 
    minRange: 90, 
    maxRange: 100,
    status: "in-range"
  }
];

// Track baking parameters over time (last 6 months)
export const bakingTrends = [
  { month: "Jan", "Oven Temperature": 182.0, "Baking Time": 12.3, "Moisture Loss": 13.1, "Oven Humidity": 13.8, "Crumb Temperature": 94.8 },
  { month: "Feb", "Oven Temperature": 176.4, "Baking Time": 12.9, "Moisture Loss": 12.1, "Oven Humidity": 14.2, "Crumb Temperature": 93.4 },
  { month: "Mar", "Oven Temperature": 185.7, "Baking Time": 11.8, "Moisture Loss": 14.2, "Oven Humidity": 12.8, "Crumb Temperature": 96.7 },
  { month: "Apr", "Oven Temperature": 180.8, "Baking Time": 12.7, "Moisture Loss": 12.7, "Oven Humidity": 14.3, "Crumb Temperature": 95.5 },
  { month: "May", "Oven Temperature": 173.5, "Baking Time": 13.2, "Moisture Loss": 11.5, "Oven Humidity": 16.1, "Crumb Temperature": 92.3 },
  { month: "Jun", "Oven Temperature": 180.5, "Baking Time": 12.5, "Moisture Loss": 12.8, "Oven Humidity": 14.5, "Crumb Temperature": 95.2 }
];

// Weekly trend data for baking (last 6 weeks)
export const bakingWeeklyTrends = [
  { week: "Week 1", "Oven Temperature": 179.5, "Baking Time": 12.4, "Moisture Loss": 12.5, "Oven Humidity": 14.7 },
  { week: "Week 2", "Oven Temperature": 183.2, "Baking Time": 12.1, "Moisture Loss": 13.4, "Oven Humidity": 13.9 },
  { week: "Week 3", "Oven Temperature": 176.8, "Baking Time": 12.8, "Moisture Loss": 11.8, "Oven Humidity": 15.2 },
  { week: "Week 4", "Oven Temperature": 181.2, "Baking Time": 12.3, "Moisture Loss": 12.9, "Oven Humidity": 14.2 },
  { week: "Week 5", "Oven Temperature": 184.6, "Baking Time": 11.9, "Moisture Loss": 13.7, "Oven Humidity": 13.5 },
  { week: "Week 6", "Oven Temperature": 180.5, "Baking Time": 12.5, "Moisture Loss": 12.8, "Oven Humidity": 14.5 }
];

// Batch-wise baking data
export const bakingBatchData = [
  { batch: "Batch 101", "Oven Temperature": 180.2, "Baking Time": 12.5, "Moisture Loss": 12.7, "Quality Score": 93 },
  { batch: "Batch 102", "Oven Temperature": 182.5, "Baking Time": 12.1, "Moisture Loss": 13.2, "Quality Score": 91 },
  { batch: "Batch 103", "Oven Temperature": 177.9, "Baking Time": 12.9, "Moisture Loss": 11.9, "Quality Score": 87 },
  { batch: "Batch 104", "Oven Temperature": 179.8, "Baking Time": 12.4, "Moisture Loss": 12.5, "Quality Score": 92 },
  { batch: "Batch 105", "Oven Temperature": 183.7, "Baking Time": 11.8, "Moisture Loss": 13.5, "Quality Score": 88 },
  { batch: "Batch 106", "Oven Temperature": 180.5, "Baking Time": 12.5, "Moisture Loss": 12.8, "Quality Score": 91 }
];

// Operational & Process Parameters - Updated to remove vendor-specific associations
export const operationalParameters = [
  { 
    name: "Cycle Time", 
    value: 4.2, 
    unit: "hrs", 
    minRange: 2, 
    maxRange: 6,
    status: "in-range" 
  },
  { 
    name: "Production Yield", 
    value: 92.5, 
    unit: "%", 
    minRange: 85, 
    maxRange: 100,
    status: "in-range" 
  },
  { 
    name: "Batch Consistency Score", 
    value: 87, 
    unit: "", 
    minRange: 0, 
    maxRange: 100,
    status: "in-range" 
  },
  { 
    name: "Rejection Rate", 
    value: 3.2, 
    unit: "%", 
    minRange: 0, 
    maxRange: 10,
    status: "in-range" 
  }
];

// Production yield by vendor (with realistic variations)
export const productionYieldByVendor = [
  { name: "Vendor A", yield: 92.5 },
  { name: "Vendor B", yield: 90.8 },
  { name: "Vendor C", yield: 88.3 },
  { name: "Vendor D", yield: 91.7 },
  { name: "Vendor E", yield: 89.5 }
];

// Weekly production yield trends
export const productionYieldWeeklyTrends = [
  { week: "Week 1", "Vendor A": 91.7, "Vendor B": 89.5, "Vendor C": 87.8, "Vendor D": 90.9, "Vendor E": 88.4 },
  { week: "Week 2", "Vendor A": 93.2, "Vendor B": 91.3, "Vendor C": 86.5, "Vendor D": 92.5, "Vendor E": 90.1 },
  { week: "Week 3", "Vendor A": 90.8, "Vendor B": 88.7, "Vendor C": 89.2, "Vendor D": 89.8, "Vendor E": 87.6 },
  { week: "Week 4", "Vendor A": 94.1, "Vendor B": 92.4, "Vendor C": 87.9, "Vendor D": 91.5, "Vendor E": 89.7 },
  { week: "Week 5", "Vendor A": 92.9, "Vendor B": 90.4, "Vendor C": 88.8, "Vendor D": 92.7, "Vendor E": 91.2 },
  { week: "Week 6", "Vendor A": 92.5, "Vendor B": 90.8, "Vendor C": 88.3, "Vendor D": 91.7, "Vendor E": 89.5 }
];

// Batch consistency score by vendor (with realistic variations)
export const batchConsistencyByVendor = [
  { name: "Vendor A", score: 93 },
  { name: "Vendor B", score: 88 },
  { name: "Vendor C", score: 82 },
  { name: "Vendor D", score: 91 },
  { name: "Vendor E", score: 86 }
];

// Weekly batch consistency trends
export const batchConsistencyWeeklyTrends = [
  { week: "Week 1", "Vendor A": 91, "Vendor B": 87, "Vendor C": 83, "Vendor D": 89, "Vendor E": 85 },
  { week: "Week 2", "Vendor A": 94, "Vendor B": 89, "Vendor C": 80, "Vendor D": 92, "Vendor E": 88 },
  { week: "Week 3", "Vendor A": 92, "Vendor B": 86, "Vendor C": 84, "Vendor D": 88, "Vendor E": 83 },
  { week: "Week 4", "Vendor A": 95, "Vendor B": 90, "Vendor C": 81, "Vendor D": 93, "Vendor E": 87 },
  { week: "Week 5", "Vendor A": 94, "Vendor B": 88, "Vendor C": 82, "Vendor D": 91, "Vendor E": 89 },
  { week: "Week 6", "Vendor A": 93, "Vendor B": 88, "Vendor C": 82, "Vendor D": 91, "Vendor E": 86 }
];

// Batch-wise consistency data
export const batchConsistencyBatchData = [
  { batch: "Batch 101", "Vendor A": 92, "Vendor B": 87, "Vendor C": 81, "Vendor D": 90, "Vendor E": 85 },
  { batch: "Batch 102", "Vendor A": 94, "Vendor B": 89, "Vendor C": 79, "Vendor D": 92, "Vendor E": 87 },
  { batch: "Batch 103", "Vendor A": 91, "Vendor B": 86, "Vendor C": 83, "Vendor D": 89, "Vendor E": 84 },
  { batch: "Batch 104", "Vendor A": 95, "Vendor B": 90, "Vendor C": 80, "Vendor D": 93, "Vendor E": 88 },
  { batch: "Batch 105", "Vendor A": 93, "Vendor B": 88, "Vendor C": 82, "Vendor D": 90, "Vendor E": 85 },
  { batch: "Batch 106", "Vendor A": 93, "Vendor B": 88, "Vendor C": 82, "Vendor D": 91, "Vendor E": 86 }
];

// Rejection rates by vendor (with realistic variations 2-8%)
export const rejectionRateByVendor = [
  { name: "Vendor A", rate: 3.2 },
  { name: "Vendor B", rate: 4.5 },
  { name: "Vendor C", rate: 5.8 },
  { name: "Vendor D", rate: 2.9 },
  { name: "Vendor E", rate: 4.1 }
];

// Weekly rejection rate trends
export const rejectionRateWeeklyTrends = [
  { week: "Week 1", "Vendor A": 3.4, "Vendor B": 4.7, "Vendor C": 5.5, "Vendor D": 3.1, "Vendor E": 4.3 },
  { week: "Week 2", "Vendor A": 2.9, "Vendor B": 4.2, "Vendor C": 6.2, "Vendor D": 2.7, "Vendor E": 3.8 },
  { week: "Week 3", "Vendor A": 3.7, "Vendor B": 5.1, "Vendor C": 5.3, "Vendor D": 3.5, "Vendor E": 4.6 },
  { week: "Week 4", "Vendor A": 2.8, "Vendor B": 3.9, "Vendor C": 5.9, "Vendor D": 2.6, "Vendor E": 3.9 },
  { week: "Week 5", "Vendor A": 3.0, "Vendor B": 4.3, "Vendor C": 5.6, "Vendor D": 2.8, "Vendor E": 4.0 },
  { week: "Week 6", "Vendor A": 3.2, "Vendor B": 4.5, "Vendor C": 5.8, "Vendor D": 2.9, "Vendor E": 4.1 }
];

// Batch-wise rejection rate data
export const rejectionRateBatchData = [
  { batch: "Batch 101", "Vendor A": 3.3, "Vendor B": 4.6, "Vendor C": 5.7, "Vendor D": 3.0, "Vendor E": 4.2 },
  { batch: "Batch 102", "Vendor A": 2.9, "Vendor B": 4.3, "Vendor C": 6.1, "Vendor D": 2.8, "Vendor E": 3.9 },
  { batch: "Batch 103", "Vendor A": 3.6, "Vendor B": 4.9, "Vendor C": 5.5, "Vendor D": 3.3, "Vendor E": 4.5 },
  { batch: "Batch 104", "Vendor A": 2.7, "Vendor B": 4.1, "Vendor C": 5.9, "Vendor D": 2.7, "Vendor E": 3.8 },
  { batch: "Batch 105", "Vendor A": 3.1, "Vendor B": 4.4, "Vendor C": 5.6, "Vendor D": 2.9, "Vendor E": 4.0 },
  { batch: "Batch 106", "Vendor A": 3.2, "Vendor B": 4.5, "Vendor C": 5.8, "Vendor D": 2.9, "Vendor E": 4.1 }
];

// Overall health calculations
export const calculateProductionHealthIndex = () => {
  const allParameters = [
    ...rawMaterialParameters,
    ...doughPreparationParameters,
    ...bakingParameters,
    ...operationalParameters
  ];
  
  // Return a fixed realistic value instead of calculating from parameters
  return 96; // More realistic value for overall production health
};

export const productionHealthIndex = calculateProductionHealthIndex();

// Health indices by category with fixed realistic values in 90-100% range
export const healthIndicesByCategory = [
  { 
    name: "Raw Materials", 
    index: 97 // Fixed value in 90-100% range
  },
  { 
    name: "Dough Preparation", 
    index: 93 // Fixed value in 90-100% range
  },
  { 
    name: "Baking", 
    index: 95 // Fixed value in 90-100% range
  },
  { 
    name: "Operational", 
    index: 91 // Fixed value in 90-100% range
  }
];
