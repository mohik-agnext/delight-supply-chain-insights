
import React from "react";
import { Select } from "@/components/ui/select";

interface DashboardHeaderProps {
  title: string;
  toggleSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  toggleSidebar,
}) => {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-gray-600">Country Delight</span>
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Premium
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="p-1 text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>

          <div>
            <div className="w-8 h-8 rounded-full bg-dashboard-teal flex items-center justify-center text-white font-medium">
              CD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
