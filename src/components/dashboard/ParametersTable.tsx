
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface Parameter {
  name: string;
  value: number;
  unit: string;
  minRange: number;
  maxRange: number;
  status: string;
  vendor: string;
}

interface ParametersTableProps {
  parameters: Parameter[];
  title: string;
}

export const ParametersTable: React.FC<ParametersTableProps> = ({ parameters, title }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Target Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param, index) => (
            <TableRow key={`${param.name}-${index}`}>
              <TableCell className="font-medium flex items-center">
                {param.name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-2 inline-flex">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Target range: {param.minRange} - {param.maxRange} {param.unit}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{param.value} {param.unit}</TableCell>
              <TableCell>{param.minRange} - {param.maxRange} {param.unit}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  param.status === "in-range" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {param.status === "in-range" ? "In Range" : "Out of Range"}
                </div>
              </TableCell>
              <TableCell>{param.vendor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
