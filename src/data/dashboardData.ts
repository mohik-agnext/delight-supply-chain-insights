// Generate realistic data for supply chain dashboard

// Status indicator helper function
export const getStatusIndicator = (value: number) => {
  if (value >= 90) {
    return { color: 'bg-green-500', label: 'Excellent' };
  } else if (value >= 75) {
    return { color: 'bg-blue-500', label: 'Good' };
  } else if (value >= 60) {
    return { color: 'bg-yellow-500', label: 'Needs Attention' };
  } else {
    return { color: 'bg-red-500', label: 'Critical' };
  }
};

// === OVERVIEW DATA ===

// Supply Chain Health - 0-100 score
export const supplyChainHealth = 87;

// Critical Alerts - Number of high-priority alerts
export const criticalAlerts = 3;

// Top Performer - Vendor with highest overall score
export const topPerformer = "Vendor A";

// Total Vendors - Count of active vendors
export const totalVendors = 5;

// Quality Score by Vendor
export const qualityScoreByVendor = [
  { name: "Vendor A", score: 92, category: "Dairy" },
  { name: "Vendor B", score: 85, category: "Produce" },
  { name: "Vendor C", score: 78, category: "Meat" },
  { name: "Vendor D", score: 81, category: "Beverages" },
  { name: "Vendor E", score: 76, category: "Dairy" },
];

// Overall Quality Trend (6 Months)
export const overallQualityTrend = [
  { month: "Jan", score: 82, category: "All Categories" },
  { month: "Feb", score: 84, category: "All Categories" },
  { month: "Mar", score: 81, category: "All Categories" },
  { month: "Apr", score: 85, category: "All Categories" },
  { month: "May", score: 87, category: "All Categories" },
  { month: "Jun", score: 87, category: "All Categories" },
];

// Quality Trend by Category
export const qualityTrendByCategory = {
  "Dairy": [
    { month: "Jan", score: 84 },
    { month: "Feb", score: 86 },
    { month: "Mar", score: 85 },
    { month: "Apr", score: 88 },
    { month: "May", score: 90 },
    { month: "Jun", score: 92 },
  ],
  "Produce": [
    { month: "Jan", score: 80 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 79 },
    { month: "Apr", score: 83 },
    { month: "May", score: 85 },
    { month: "Jun", score: 85 },
  ],
  "Meat": [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 76 },
    { month: "Mar", score: 75 },
    { month: "Apr", score: 77 },
    { month: "May", score: 78 },
    { month: "Jun", score: 78 },
  ],
  "Beverages": [
    { month: "Jan", score: 81 },
    { month: "Feb", score: 83 },
    { month: "Mar", score: 80 },
    { month: "Apr", score: 82 },
    { month: "May", score: 83 },
    { month: "Jun", score: 81 },
  ]
};

// Vendor Benchmarking
export const vendorBenchmarking = [
  { 
    name: "Vendor A", 
    qualityScore: 92, 
    complianceScore: 95, 
    deliveryScore: 90, 
    overallScore: 92,
    category: "Dairy"
  },
  { 
    name: "Vendor B", 
    qualityScore: 85, 
    complianceScore: 82, 
    deliveryScore: 88, 
    overallScore: 85,
    category: "Produce"
  },
  { 
    name: "Vendor C", 
    qualityScore: 78, 
    complianceScore: 80, 
    deliveryScore: 75, 
    overallScore: 78,
    category: "Meat"
  },
  { 
    name: "Vendor D", 
    qualityScore: 81, 
    complianceScore: 85, 
    deliveryScore: 83, 
    overallScore: 83,
    category: "Beverages"
  },
  { 
    name: "Vendor E", 
    qualityScore: 76, 
    complianceScore: 79, 
    deliveryScore: 81, 
    overallScore: 79,
    category: "Dairy"
  },
];

// Critical Alerts List
export const criticalAlertsList = [
  {
    id: 1,
    title: "High Microbial Count",
    description: "Recent shipment from Vendor C shows elevated microbial levels",
    severity: "High",
    date: "Today, 10:23 AM",
    vendor: "Vendor C",
    category: "Meat"
  },
  {
    id: 2,
    title: "Delayed Shipment",
    description: "Critical dairy supplies delayed by 48 hours",
    severity: "Medium",
    date: "Yesterday, 3:15 PM",
    vendor: "Vendor E",
    category: "Dairy"
  },
  {
    id: 3,
    title: "Temperature Deviation",
    description: "Cold chain temperature exceeded threshold during transit",
    severity: "High",
    date: "Yesterday, 11:30 AM",
    vendor: "Vendor B",
    category: "Produce"
  },
  {
    id: 4,
    title: "Incomplete Documentation",
    description: "Missing quality certificates for recent beverage shipment",
    severity: "Low",
    date: "Jun 8, 2:45 PM",
    vendor: "Vendor D",
    category: "Beverages"
  },
];

// === VENDOR PERFORMANCE DATA ===

// Compliance Rate
export const complianceRate = [
  { name: "Overall", value: 87 },
  { name: "Documentation", value: 92 },
  { name: "Quality Standards", value: 85 },
  { name: "Regulatory", value: 89 },
];

// On-Time Delivery Trend
export const onTimeDeliveryTrend = [
  { month: "Jan", "Vendor A": 94, "Vendor B": 91, "Vendor C": 87, "Vendor D": 90, "Vendor E": 89 },
  { month: "Feb", "Vendor A": 95, "Vendor B": 90, "Vendor C": 85, "Vendor D": 92, "Vendor E": 88 },
  { month: "Mar", "Vendor A": 93, "Vendor B": 89, "Vendor C": 86, "Vendor D": 91, "Vendor E": 87 },
  { month: "Apr", "Vendor A": 96, "Vendor B": 92, "Vendor C": 88, "Vendor D": 93, "Vendor E": 90 },
  { month: "May", "Vendor A": 97, "Vendor B": 93, "Vendor C": 89, "Vendor D": 94, "Vendor E": 91 },
  { month: "Jun", "Vendor A": 96, "Vendor B": 94, "Vendor C": 90, "Vendor D": 93, "Vendor E": 92 },
];

// Vendor Reliability Score
export const vendorReliabilityScore = [
  { name: "Vendor A", score: 94, category: "Dairy" },
  { name: "Vendor B", score: 88, category: "Produce" },
  { name: "Vendor C", score: 82, category: "Meat" },
  { name: "Vendor D", score: 86, category: "Beverages" },
  { name: "Vendor E", score: 85, category: "Dairy" },
];

// === RAW MATERIAL QUALITY DATA ===

// Fat and Protein Content (%)
export const fatProteinContent = [
  { name: "Vendor A", fat: "4.2", protein: "3.6", category: "Dairy" },
  { name: "Vendor B", fat: "4.0", protein: "3.4", category: "Produce" },
  { name: "Vendor C", fat: "3.9", protein: "3.5", category: "Meat" },
  { name: "Vendor D", fat: "4.1", protein: "3.5", category: "Beverages" },
  { name: "Vendor E", fat: "3.8", protein: "3.3", category: "Dairy" },
];

// Adulteration Index (0-1, lower is better)
export const adulterationIndex = [
  { name: "Vendor A", index: 0.02, category: "Dairy" },
  { name: "Vendor B", index: 0.03, category: "Produce" },
  { name: "Vendor C", index: 0.04, category: "Meat" },
  { name: "Vendor D", index: 0.02, category: "Beverages" },
  { name: "Vendor E", index: 0.05, category: "Dairy" },
];

// Microbial Load (CFU/mL)
export const microbialLoad = [
  { month: "Jan", "Vendor A": 2100, "Vendor B": 2400, "Vendor C": 3100, "Vendor D": 2200, "Vendor E": 2700 },
  { month: "Feb", "Vendor A": 2000, "Vendor B": 2500, "Vendor C": 3200, "Vendor D": 2100, "Vendor E": 2800 },
  { month: "Mar", "Vendor A": 1900, "Vendor B": 2300, "Vendor C": 3000, "Vendor D": 2000, "Vendor E": 2600 },
  { month: "Apr", "Vendor A": 1800, "Vendor B": 2200, "Vendor C": 2900, "Vendor D": 1900, "Vendor E": 2500 },
  { month: "May", "Vendor A": 1700, "Vendor B": 2100, "Vendor C": 2800, "Vendor D": 1800, "Vendor E": 2400 },
  { month: "Jun", "Vendor A": 1600, "Vendor B": 2000, "Vendor C": 2750, "Vendor D": 1750, "Vendor E": 2300 },
];

// Shelf Life Prediction (days)
export const shelfLifePrediction = [
  { name: "Vendor A", prediction: 14, category: "Dairy" },
  { name: "Vendor B", prediction: 12, category: "Produce" },
  { name: "Vendor C", prediction: 10, category: "Meat" },
  { name: "Vendor D", prediction: 13, category: "Beverages" },
  { name: "Vendor E", prediction: 11, category: "Dairy" },
];

// Raw Material Risk Index (0-100, lower is better)
export const rawMaterialRisk = [
  { name: "Vendor A", risk: 12, category: "Dairy" },
  { name: "Vendor B", risk: 18, category: "Produce" },
  { name: "Vendor C", risk: 24, category: "Meat" },
  { name: "Vendor D", risk: 15, category: "Beverages" },
  { name: "Vendor E", risk: 20, category: "Dairy" },
];

// === PRODUCTION PROCESS DATA ===

// Process Adherence by Vendor (%)
export const processAdherenceByVendor = [
  { name: "Vendor A", adherence: 95, category: "Dairy" },
  { name: "Vendor B", adherence: 88, category: "Produce" },
  { name: "Vendor C", adherence: 82, category: "Meat" },
  { name: "Vendor D", adherence: 90, category: "Beverages" },
  { name: "Vendor E", adherence: 85, category: "Dairy" },
];

// Defect Rate Types
export const defectRateTypes = [
  { name: "Packaging", value: 45, category: "All Categories" },
  { name: "Product Quality", value: 30, category: "All Categories" },
  { name: "Labeling", value: 15, category: "All Categories" },
  { name: "Other", value: 10, category: "All Categories" },
];

// Equipment Downtime (hours)
export const equipmentDowntime = [
  { month: "Jan", "Vendor A": 12, "Vendor B": 18, "Vendor C": 24, "Vendor D": 15, "Vendor E": 20 },
  { month: "Feb", "Vendor A": 10, "Vendor B": 16, "Vendor C": 22, "Vendor D": 14, "Vendor E": 19 },
  { month: "Mar", "Vendor A": 11, "Vendor B": 17, "Vendor C": 23, "Vendor D": 13, "Vendor E": 18 },
  { month: "Apr", "Vendor A": 9, "Vendor B": 15, "Vendor C": 21, "Vendor D": 12, "Vendor E": 17 },
  { month: "May", "Vendor A": 8, "Vendor B": 14, "Vendor C": 20, "Vendor D": 11, "Vendor E": 16 },
  { month: "Jun", "Vendor A": 7, "Vendor B": 13, "Vendor C": 19, "Vendor D": 10, "Vendor E": 15 },
];

// Energy Efficiency (kWh/unit)
export const energyEfficiency = [
  { name: "Vendor A", efficiency: "1.2", category: "Dairy" },
  { name: "Vendor B", efficiency: "1.4", category: "Produce" },
  { name: "Vendor C", efficiency: "1.6", category: "Meat" },
  { name: "Vendor D", efficiency: "1.3", category: "Beverages" },
  { name: "Vendor E", efficiency: "1.5", category: "Dairy" },
];

// Production Efficiency Index (0-100)
export const productionEfficiencyIndex = [
  { name: "Vendor A", efficiency: 90, category: "Dairy" },
  { name: "Vendor B", efficiency: 82, category: "Produce" },
  { name: "Vendor C", efficiency: 76, category: "Meat" },
  { name: "Vendor D", efficiency: 85, category: "Beverages" },
  { name: "Vendor E", efficiency: 80, category: "Dairy" },
];

// === FINISHED PRODUCT DATA ===

// Batch Consistency Scores
export const batchConsistency = [
  { name: "Batch 001", score: 92, vendor: "Vendor A", category: "Dairy" },
  { name: "Batch 002", score: 88, vendor: "Vendor B", category: "Produce" },
  { name: "Batch 003", score: 86, vendor: "Vendor C", category: "Meat" },
  { name: "Batch 004", score: 90, vendor: "Vendor D", category: "Beverages" },
  { name: "Batch 005", score: 89, vendor: "Vendor E", category: "Dairy" },
  { name: "Batch 006", score: 91, vendor: "Vendor A", category: "Dairy" },
];

// Rejection Rate Trend
export const rejectionRateTrend = [
  { month: "Jan", "Vendor A": "1.2", "Vendor B": "1.8", "Vendor C": "2.4", "Vendor D": "1.5", "Vendor E": "2.0" },
  { month: "Feb", "Vendor A": "1.1", "Vendor B": "1.7", "Vendor C": "2.3", "Vendor D": "1.4", "Vendor E": "1.9" },
  { month: "Mar", "Vendor A": "1.0", "Vendor B": "1.6", "Vendor C": "2.2", "Vendor D": "1.3", "Vendor E": "1.8" },
  { month: "Apr", "Vendor A": "0.9", "Vendor B": "1.5", "Vendor C": "2.1", "Vendor D": "1.2", "Vendor E": "1.7" },
  { month: "May", "Vendor A": "0.8", "Vendor B": "1.4", "Vendor C": "2.0", "Vendor D": "1.1", "Vendor E": "1.6" },
  { month: "Jun", "Vendor A": "0.7", "Vendor B": "1.3", "Vendor C": "1.9", "Vendor D": "1.0", "Vendor E": "1.5" },
];

// Traceability Coverage
export const traceabilityCoverage = [
  { name: "Complete", value: 82, category: "All Categories" },
  { name: "Partial", value: 15, category: "All Categories" },
  { name: "Incomplete", value: 3, category: "All Categories" },
];

// Consumer Complaint Rate (per 1,000 units)
export const consumerComplaintRate = [
  { name: "Vendor A", rate: "0.8", category: "Dairy" },
  { name: "Vendor B", rate: "1.2", category: "Produce" },
  { name: "Vendor C", rate: "1.8", category: "Meat" },
  { name: "Vendor D", rate: "1.0", category: "Beverages" },
  { name: "Vendor E", rate: "1.4", category: "Dairy" },
];

// Customer Satisfaction Index
export const customerSatisfactionIndex = [
  {
    name: "Vendor A",
    index: 96,
    complaintComponent: 95,
    consistencyComponent: 97,
    category: "Dairy"
  },
  {
    name: "Vendor B",
    index: 91,
    complaintComponent: 90,
    consistencyComponent: 92,
    category: "Produce"
  },
  {
    name: "Vendor C",
    index: 88,
    complaintComponent: 86,
    consistencyComponent: 90,
    category: "Meat"
  },
  {
    name: "Vendor D",
    index: 92,
    complaintComponent: 92,
    consistencyComponent: 93,
    category: "Beverages"
  },
  {
    name: "Vendor E",
    index: 90,
    complaintComponent: 89,
    consistencyComponent: 91,
    category: "Dairy"
  },
];

// === DISPUTE RESOLUTION DATA ===

// Dispute Resolution Time (hours)
export const disputeResolutionTime = [
  { type: "Quality", hours: 24, category: "All Categories" },
  { type: "Delivery", hours: 12, category: "All Categories" },
  { type: "Documentation", hours: 36, category: "All Categories" },
  { type: "Payment", hours: 48, category: "All Categories" },
];

// Dispute Frequency
export const disputeFrequency = [
  { month: "Jan", count: 8, category: "All Categories" },
  { month: "Feb", count: 7, category: "All Categories" },
  { month: "Mar", count: 9, category: "All Categories" },
  { month: "Apr", count: 6, category: "All Categories" },
  { month: "May", count: 5, category: "All Categories" },
  { month: "Jun", count: 4, category: "All Categories" },
];

// Evidence Accuracy
export const evidenceAccuracy = [
  { name: "Accurate", value: 75, category: "All Categories" },
  { name: "Partially Accurate", value: 20, category: "All Categories" },
  { name: "Inaccurate", value: 5, category: "All Categories" },
];

// Dispute Resolution Efficiency
export const disputeResolutionEfficiency = [
  { name: "Vendor A", efficiency: 92, category: "Dairy" },
  { name: "Vendor B", efficiency: 85, category: "Produce" },
  { name: "Vendor C", efficiency: 78, category: "Meat" },
  { name: "Vendor D", efficiency: 88, category: "Beverages" },
  { name: "Vendor E", efficiency: 82, category: "Dairy" },
];

// === COMPLIANCE & AUDIT DATA ===

// Audit Pass Rate (%)
export const auditPassRate = [
  { name: "Vendor A", rate: 98, category: "Dairy" },
  { name: "Vendor B", rate: 92, category: "Produce" },
  { name: "Vendor C", rate: 85, category: "Meat" },
  { name: "Vendor D", rate: 94, category: "Beverages" },
  { name: "Vendor E", rate: 90, category: "Dairy" },
];

// Non-Compliance Incidents
export const nonComplianceIncidents = [
  { type: "Documentation", count: 5, category: "All Categories" },
  { type: "Quality Standards", count: 3, category: "All Categories" },
  { type: "Safety", count: 1, category: "All Categories" },
  { type: "Regulatory", count: 2, category: "All Categories" },
];

// Documentation Completeness
export const documentationCompleteness = [
  { name: "Complete", value: 85, category: "All Categories" },
  { name: "Partially Complete", value: 12, category: "All Categories" },
  { name: "Incomplete", value: 3, category: "All Categories" },
];

// Compliance Risk Score (0-100, lower is better)
export const complianceRiskScore = [
  { name: "Vendor A", score: 15, category: "Dairy" },
  { name: "Vendor B", score: 22, category: "Produce" },
  { name: "Vendor C", score: 35, category: "Meat" },
  { name: "Vendor D", score: 18, category: "Beverages" },
  { name: "Vendor E", score: 25, category: "Dairy" },
];
