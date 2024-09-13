import React from 'react';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Farmer Dashboard</h1>
      <p className="text-lg mb-6">Welcome to your farmer dashboard. Here you can manage your spray orders and view your field information.</p>
      <Link to="/sprayorder" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
        Create Spray Order
      </Link>
    </div>
  );
};

export default FarmerDashboard;