import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BatchMetricItemProps {
  label: string;
  value: number;
  isOutlier: boolean;
  unit?: string;
}

export const BatchMetricItem: React.FC<BatchMetricItemProps> = ({
  label,
  value,
  isOutlier,
  unit = ''
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700">{label}:</span>
      <div className="flex items-center gap-1">
        <span className={`font-medium ${isOutlier ? 'text-orange-600' : ''}`}>
          {value.toFixed(2)}{unit}
        </span>
        {isOutlier && (
          <AlertCircle 
            size={14} 
            className="text-orange-600" 
            title="Outlier value detected" 
          />
        )}
      </div>
    </div>
  );
}; 