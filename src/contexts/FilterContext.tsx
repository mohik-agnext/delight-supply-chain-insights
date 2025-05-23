import * as React from "react";
import { batchShifts, BatchShift } from "@/data/biscuitManufacturingData";

// Define default values in a central place for consistency
const DEFAULT_VALUES = {
  vendors: ["All Vendors"],
  timePeriods: ["Last 6 Months"],
  dateOption: "Last 6 Months" as DateOptionType,
  selectedBatchShifts: ["morning", "afternoon", "night"] as BatchShift[],
  selectedDate: null as Date | null
};

// Date option types
export type DateOptionType = "Last 6 Months" | "Last 3 Months" | "Last Month" | "Custom Range";

// Date range interface
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

// Define the shape of our context
type FilterContextType = {
  // Explicitly define properties as non-undefined arrays
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  selectedTimePeriods: string[];
  setSelectedTimePeriods: (periods: string[]) => void;
  
  // Date filtering options
  selectedDateOption: DateOptionType;
  setSelectedDateOption: (option: DateOptionType) => void;
  customDateRange: DateRange;
  setCustomDateRange: (range: DateRange) => void;
  
  // Batch filtering options
  selectedBatchShifts: BatchShift[];
  setSelectedBatchShifts: (shifts: BatchShift[]) => void;
  
  // Selected specific date for batch drill-down
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  
  // Add a flag to indicate if context is fully initialized
  isReady: boolean;
};

// Create an initial state object with default values
const initialContextState: FilterContextType = {
  selectedVendors: DEFAULT_VALUES.vendors,
  setSelectedVendors: () => {},
  selectedTimePeriods: DEFAULT_VALUES.timePeriods,
  setSelectedTimePeriods: () => {},
  
  // Default date filtering
  selectedDateOption: DEFAULT_VALUES.dateOption,
  setSelectedDateOption: () => {},
  customDateRange: { startDate: null, endDate: null },
  setCustomDateRange: () => {},
  
  // Default batch filtering
  selectedBatchShifts: DEFAULT_VALUES.selectedBatchShifts,
  setSelectedBatchShifts: () => {},
  
  // Default selected date
  selectedDate: DEFAULT_VALUES.selectedDate,
  setSelectedDate: () => {},
  
  isReady: false
};

// Initialize context with the initial state to avoid undefined
const FilterContext = React.createContext<FilterContextType>(initialContextState);

export const useFilterContext = () => {
  const context = React.useContext(FilterContext);
  // We will still check in case someone tries to use this outside a provider
  if (!context) {
    console.error("useFilterContext must be used within a FilterProvider");
    // Return a safe default instead of throwing an error
    return initialContextState;
  }
  return context;
};

// Helper function to get date range based on option
export const getDateRangeFromOption = (option: DateOptionType): DateRange => {
  const today = new Date();
  const endDate = new Date();
  let startDate = new Date();
  
  switch (option) {
    case "Last 6 Months":
      startDate.setMonth(today.getMonth() - 6);
      break;
    case "Last 3 Months":
      startDate.setMonth(today.getMonth() - 3);
      break;
    case "Last Month":
      startDate.setMonth(today.getMonth() - 1);
      break;
    case "Custom Range":
      // Return null for custom range, as it should be set by user
      return { startDate: null, endDate: null };
  }
  
  return { startDate, endDate };
};

interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  // Initialize state with default arrays to prevent undefined values
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>(DEFAULT_VALUES.vendors);
  const [selectedTimePeriods, setSelectedTimePeriods] = React.useState<string[]>(DEFAULT_VALUES.timePeriods);
  const [isReady, setIsReady] = React.useState(false);
  
  // Initialize date filtering state
  const [selectedDateOption, setSelectedDateOption] = React.useState<DateOptionType>(DEFAULT_VALUES.dateOption);
  const [customDateRange, setCustomDateRange] = React.useState<DateRange>({ 
    startDate: null, 
    endDate: null 
  });
  
  // Initialize batch filtering state
  const [selectedBatchShifts, setSelectedBatchShifts] = React.useState<BatchShift[]>(DEFAULT_VALUES.selectedBatchShifts);
  
  // Initialize selected date for batch drill-down
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(DEFAULT_VALUES.selectedDate);
  
  // Ensure state is properly initialized
  React.useEffect(() => {
    // Mark context as ready on first render - adds an initialization checkpoint
    setIsReady(true);
  }, []);

  // Ensure the values are always arrays, even if they somehow become undefined
  const safeSetSelectedVendors = React.useCallback((vendors: string[]) => {
    setSelectedVendors(Array.isArray(vendors) ? vendors : DEFAULT_VALUES.vendors);
  }, []);
  
  const safeSetSelectedTimePeriods = React.useCallback((periods: string[]) => {
    setSelectedTimePeriods(Array.isArray(periods) ? periods : DEFAULT_VALUES.timePeriods);
  }, []);
  
  const safeSetSelectedDateOption = React.useCallback((option: DateOptionType) => {
    setSelectedDateOption(option);
    
    // If changing to a predefined option, update the date range automatically
    if (option !== "Custom Range") {
      setCustomDateRange(getDateRangeFromOption(option));
    }
  }, []);
  
  // Safe setter for batch shifts
  const safeSetSelectedBatchShifts = React.useCallback((shifts: BatchShift[]) => {
    setSelectedBatchShifts(Array.isArray(shifts) ? shifts : DEFAULT_VALUES.selectedBatchShifts);
  }, []);

  // Use memoized value for the context to ensure stable references
  const contextValue = React.useMemo(() => ({
    selectedVendors: Array.isArray(selectedVendors) ? selectedVendors : DEFAULT_VALUES.vendors,
    setSelectedVendors: safeSetSelectedVendors,
    selectedTimePeriods: Array.isArray(selectedTimePeriods) ? selectedTimePeriods : DEFAULT_VALUES.timePeriods,
    setSelectedTimePeriods: safeSetSelectedTimePeriods,
    
    // Date filtering
    selectedDateOption,
    setSelectedDateOption: safeSetSelectedDateOption,
    customDateRange,
    setCustomDateRange,
    
    // Batch filtering
    selectedBatchShifts: Array.isArray(selectedBatchShifts) ? selectedBatchShifts : DEFAULT_VALUES.selectedBatchShifts,
    setSelectedBatchShifts: safeSetSelectedBatchShifts,
    
    // Selected date
    selectedDate,
    setSelectedDate,
    
    isReady
  }), [
    selectedVendors, safeSetSelectedVendors,
    selectedTimePeriods, safeSetSelectedTimePeriods,
    selectedDateOption, safeSetSelectedDateOption,
    customDateRange,
    selectedBatchShifts, safeSetSelectedBatchShifts,
    selectedDate,
    isReady
  ]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
