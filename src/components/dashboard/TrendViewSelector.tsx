import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TrendViewType = "monthly" | "weekly" | "batch";

interface TrendViewSelectorProps {
  activeView: TrendViewType;
  onChange: (view: TrendViewType) => void;
  monthlyView?: React.ReactNode;
  weeklyView?: React.ReactNode;
  batchView?: React.ReactNode;
  showMonthly?: boolean;
  showWeekly?: boolean;
  showBatch?: boolean;
  className?: string;
}

export const TrendViewSelector: React.FC<TrendViewSelectorProps> = ({
  activeView,
  onChange,
  monthlyView,
  weeklyView,
  batchView,
  showMonthly = true,
  showWeekly = true,
  showBatch = true,
  className = "",
}) => {
  const handleViewChange = (value: string) => {
    onChange(value as TrendViewType);
  };

  return (
    <div className={className}>
      <Tabs 
        defaultValue={activeView} 
        value={activeView} 
        onValueChange={handleViewChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-4">
          {showMonthly && <TabsTrigger value="monthly">Monthly</TabsTrigger>}
          {showWeekly && <TabsTrigger value="weekly">Weekly</TabsTrigger>}
          {showBatch && <TabsTrigger value="batch">Batch-wise</TabsTrigger>}
        </TabsList>
        
        {showMonthly && (
          <TabsContent value="monthly" className="mt-2">
            {monthlyView}
          </TabsContent>
        )}
        
        {showWeekly && (
          <TabsContent value="weekly" className="mt-2">
            {weeklyView}
          </TabsContent>
        )}
        
        {showBatch && (
          <TabsContent value="batch" className="mt-2">
            {batchView}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}; 