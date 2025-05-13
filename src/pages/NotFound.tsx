
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page not found</p>
        <p className="text-gray-500 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
