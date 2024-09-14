import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    onLogin(role);
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to HoverSprite</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Select your role:</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('FARMER')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Login as Farmer
          </button>
          <button
            onClick={() => handleLogin('RECEPTIONIST')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login as Receptionist
          </button>
          <button
            onClick={() => handleLogin('SPRAYER')}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Login as Sprayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;