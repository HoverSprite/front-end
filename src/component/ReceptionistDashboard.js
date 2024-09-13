import React from 'react';
import { Link } from 'react-router-dom';

const ReceptionistDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Receptionist Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome to your receptionist dashboard. Here you can manage spray orders, view farmer information, and handle scheduling.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/sprayorder" 
          className="bg-blue-600 text-white py-4 px-6 rounded hover:bg-blue-700 text-center"
        >
          Create Spray Order
        </Link>
        
        
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
        <ul className="list-disc pl-5">
          <li>New spray order received from Farmer John Doe</li>
          <li>Schedule updated for tomorrow's spraying sessions</li>
          <li>Report generated for last week's activities</li>
        </ul>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;