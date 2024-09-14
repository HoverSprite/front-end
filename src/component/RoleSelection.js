import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = ({ onSelectRole }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    onSelectRole(role);
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">HoverSprite Role Selection</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Select your role:</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('FARMER')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Farmer (F1)
          </button>
          <button
            onClick={() => handleRoleSelect('RECEPTIONIST')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Receptionist (R1)
          </button>
          <button
            onClick={() => handleRoleSelect('SPRAYER')}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Sprayer (S1)
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;