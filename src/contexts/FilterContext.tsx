
import * as React from "react";

// Define default values in a central place for consistency
const DEFAULT_VALUES = {
  vendors: ["All Vendors"],
  timePeriods: ["Last 6 Months"],
  categories: ["All Categories"]
};

// Define the shape of our context
type FilterContextType = {
  // Explicitly define properties as non-undefined arrays
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  selectedTimePeriods: string[];
  setSelectedTimePeriods: (periods: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  // Add a flag to indicate if context is fully initialized
  isReady: boolean;
};

// Create an initial state object with default values
const initialContextState: FilterContextType = {
  selectedVendors: DEFAULT_VALUES.vendors,
  setSelectedVendors: () => {},
  selectedTimePeriods: DEFAULT_VALUES.timePeriods,
  setSelectedTimePeriods: () => {},
  selectedCategories: DEFAULT_VALUES.categories,
  setSelectedCategories: () => {},
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

interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  // Initialize state with default arrays to prevent undefined values
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>(DEFAULT_VALUES.vendors);
  const [selectedTimePeriods, setSelectedTimePeriods] = React.useState<string[]>(DEFAULT_VALUES.timePeriods);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(DEFAULT_VALUES.categories);
  const [isReady, setIsReady] = React.useState(false);
  
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
  
  const safeSetSelectedCategories = React.useCallback((categories: string[]) => {
    setSelectedCategories(Array.isArray(categories) ? categories : DEFAULT_VALUES.categories);
  }, []);

  // Use memoized value for the context to ensure stable references
  const contextValue = React.useMemo(() => ({
    selectedVendors: Array.isArray(selectedVendors) ? selectedVendors : DEFAULT_VALUES.vendors,
    setSelectedVendors: safeSetSelectedVendors,
    selectedTimePeriods: Array.isArray(selectedTimePeriods) ? selectedTimePeriods : DEFAULT_VALUES.timePeriods,
    setSelectedTimePeriods: safeSetSelectedTimePeriods,
    selectedCategories: Array.isArray(selectedCategories) ? selectedCategories : DEFAULT_VALUES.categories,
    setSelectedCategories: safeSetSelectedCategories,
    isReady
  }), [
    selectedVendors, safeSetSelectedVendors,
    selectedTimePeriods, safeSetSelectedTimePeriods,
    selectedCategories, safeSetSelectedCategories,
    isReady
  ]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
