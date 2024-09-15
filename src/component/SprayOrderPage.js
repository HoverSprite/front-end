import React from 'react';
import SprayOrderForm from './SprayOrderForm';
import { Navigate } from 'react-router-dom';

const SprayOrderPage = ({ user }) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Spray Order</h1>
      <SprayOrderForm userRole={'FARMER'} userId={1} />
    </div>
  );
};

export default SprayOrderPage;