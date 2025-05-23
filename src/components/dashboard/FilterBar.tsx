import React, { useState, useEffect } from "react";
import { BasicDropdown } from "./BasicDropdown";
import { DatePickerDropdown } from "./DatePickerDropdown";
import { useFilterContext, DateOptionType, DateRange } from "@/contexts/FilterContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { BatchShift, batchShifts } from "@/data/biscuitManufacturingData";
import { format, parseISO } from "date-fns";
// Import CalendarIcon from Radix UI icons
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  onVendorChange?: (values: string[]) => void;
  onPeriodChange?: (values: string[]) => void;
  onDateOptionChange?: (option: DateOptionType) => void;
  onDateRangeChange?: (range: DateRange) => void;
  onBatchShiftChange?: (shifts: BatchShift[]) => void;
  onDateChange?: (date: Date | null) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onVendorChange,
  onPeriodChange,
  onDateOptionChange,
  onDateRangeChange,
  onBatchShiftChange,
  onDateChange,
}) => {
  // Local state as fallback for context
  const [localState, setLocalState] = useState({
    vendors: ["All Vendors", "Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    timePeriods: ["Last 6 Months", "Last 3 Months", "Last Month", "Last Week", "Custom Range"],
    batchOptions: ["morning", "afternoon", "night"],
    selectedVendors: ["All Vendors"],
    selectedTimePeriods: ["Last 6 Months"],
    selectedBatchShifts: ["morning", "afternoon", "night"],
    selectedDateOption: "Last 6 Months" as DateOptionType,
    customDateRange: { startDate: null, endDate: null } as DateRange,
    selectedDate: null as Date | null,
  });

  // Try to use context, but fallback to local state if there's an error
  const contextValues = (() => {
    try {
      return useFilterContext();
    } catch (error) {
      console.error("Error using FilterContext:", error);
      return {
        selectedVendors: localState.selectedVendors,
        setSelectedVendors: (v: string[]) => setLocalState(prev => ({ ...prev, selectedVendors: v })),
        selectedTimePeriods: localState.selectedTimePeriods,
        setSelectedTimePeriods: (p: string[]) => setLocalState(prev => ({ ...prev, selectedTimePeriods: p })),
        selectedDateOption: localState.selectedDateOption,
        setSelectedDateOption: (o: DateOptionType) => setLocalState(prev => ({ ...prev, selectedDateOption: o })),
        customDateRange: localState.customDateRange,
        setCustomDateRange: (r: DateRange) => setLocalState(prev => ({ ...prev, customDateRange: r })),
        selectedBatchShifts: localState.selectedBatchShifts,
        setSelectedBatchShifts: (s: BatchShift[]) => setLocalState(prev => ({ ...prev, selectedBatchShifts: s })),
        selectedDate: localState.selectedDate,
        setSelectedDate: (d: Date | null) => setLocalState(prev => ({ ...prev, selectedDate: d })),
        isReady: true
      };
    }
  })();

  const {
    selectedVendors, 
    setSelectedVendors,
    selectedTimePeriods, 
    setSelectedTimePeriods,
    selectedDateOption,
    setSelectedDateOption,
    customDateRange,
    setCustomDateRange,
    selectedBatchShifts,
    setSelectedBatchShifts,
    selectedDate,
    setSelectedDate,
    isReady
  } = contextValues;

  // Ensure safe values
  const safeSelectedVendors = Array.isArray(selectedVendors) ? selectedVendors : ["All Vendors"];
  const safeSelectedTimePeriods = Array.isArray(selectedTimePeriods) ? selectedTimePeriods : ["Last 6 Months"];
  const safeSelectedBatchShifts = Array.isArray(selectedBatchShifts) ? selectedBatchShifts : ["morning", "afternoon", "night"];

  // Format batch option labels for display
  const formatBatchLabel = (shift: string): string => {
    return shift.charAt(0).toUpperCase() + shift.slice(1);
  };

  // Safe handler functions with try-catch blocks
  const handleVendorChange = (values: string[]) => {
    if (!Array.isArray(values)) return;
    
    try {
      setSelectedVendors(values);
      if (onVendorChange) onVendorChange(values);
    } catch (error) {
      console.error("Error in vendor change:", error);
      setLocalState(prev => ({ ...prev, selectedVendors: values }));
    }
  };

  const handlePeriodChange = (values: string[]) => {
    if (!Array.isArray(values)) return;
    
    try {
      setSelectedTimePeriods(values);
      if (onPeriodChange) onPeriodChange(values);
    } catch (error) {
      console.error("Error in period change:", error);
      setLocalState(prev => ({ ...prev, selectedTimePeriods: values }));
    }
  };

  // Handle date option change
  const handleDateOptionChange = (option: DateOptionType) => {
    try {
      setSelectedDateOption(option);
      if (onDateOptionChange) onDateOptionChange(option);
    } catch (error) {
      console.error("Error in date option change:", error);
      setLocalState(prev => ({ ...prev, selectedDateOption: option }));
    }
  };

  // Handle custom date range change
  const handleDateRangeChange = (range: DateRange) => {
    try {
      setCustomDateRange(range);
      if (onDateRangeChange) onDateRangeChange(range);
    } catch (error) {
      console.error("Error in date range change:", error);
      setLocalState(prev => ({ ...prev, customDateRange: range }));
    }
  };

  // Handle batch shift change
  const handleBatchShiftChange = (shifts: string[]) => {
    if (!Array.isArray(shifts)) return;
    
    try {
      setSelectedBatchShifts(shifts as BatchShift[]);
      if (onBatchShiftChange) onBatchShiftChange(shifts as BatchShift[]);
    } catch (error) {
      console.error("Error in batch shift change:", error);
      setLocalState(prev => ({ ...prev, selectedBatchShifts: shifts as BatchShift[] }));
    }
  };

  // Handle selected date change for batch drill-down
  const handleDateChange = (date: Date | null) => {
    try {
      setSelectedDate(date);
      if (onDateChange) onDateChange(date);
    } catch (error) {
      console.error("Error in date change:", error);
      setLocalState(prev => ({ ...prev, selectedDate: date }));
    }
  };

  // Loading state
  if (!isReady) {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="w-full text-center text-gray-500">
          Loading filters...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <BasicDropdown
            label="Vendor"
            options={localState.vendors}
            selectedValues={safeSelectedVendors}
            onChange={handleVendorChange}
            multiSelect
          />
        </ErrorBoundary>
      </div>

      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <DatePickerDropdown
            label="Time Period"
            selectedOption={selectedDateOption}
            customDateRange={customDateRange}
            onOptionChange={handleDateOptionChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </ErrorBoundary>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <BasicDropdown
            label="Batch Shifts"
            options={batchShifts}
            selectedValues={safeSelectedBatchShifts}
            onChange={handleBatchShiftChange}
            formatOptionLabel={formatBatchLabel}
            multiSelect
          />
        </ErrorBoundary>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <div className="w-full flex flex-col space-y-1.5">
            <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};
