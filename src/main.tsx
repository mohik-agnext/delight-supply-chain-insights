import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

try {
  const root = createRoot(rootElement);
  
  root.render(
    <ErrorBoundary 
      fallback={
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong with the application
          </h2>
          <p className="mb-4">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      }
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  );
} catch (error) {
  console.error('Error rendering application:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2 style="color: #e53e3e; margin-bottom: 16px; font-size: 24px;">
        Application Failed to Load
      </h2>
      <p style="margin-bottom: 16px;">
        There was an error initializing the application. Please try again later.
      </p>
      <button 
        onclick="window.location.reload()"
        style="padding: 8px 16px; background-color: #3182ce; color: white; border-radius: 4px; cursor: pointer;"
      >
        Reload Application
      </button>
    </div>
  `;
}
