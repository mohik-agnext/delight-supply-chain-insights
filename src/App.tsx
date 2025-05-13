
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import Overview from "./pages/Overview";
import VendorPerformance from "./pages/VendorPerformance";
import RawMaterial from "./pages/RawMaterial";
import ProductionProcess from "./pages/ProductionProcess";
import FinishedProduct from "./pages/FinishedProduct";
import DisputeResolution from "./pages/DisputeResolution";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FilterProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/vendor-performance" element={<VendorPerformance />} />
          <Route path="/raw-material" element={<RawMaterial />} />
          <Route path="/production-process" element={<ProductionProcess />} />
          <Route path="/finished-product" element={<FinishedProduct />} />
          <Route path="/dispute-resolution" element={<DisputeResolution />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </FilterProvider>
  </QueryClientProvider>
);

export default App;
