// src/components/ErrorBoundary.js

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error Boundary Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-4 text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
