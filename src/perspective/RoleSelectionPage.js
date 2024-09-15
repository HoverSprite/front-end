import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tractor, UserCircle, Droplets, ChevronRight } from 'lucide-react';

const RoleCard = ({ icon: Icon, color, title, description, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-lg p-6 flex flex-col items-center justify-between h-full cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`${color} p-4 rounded-full mb-6`}>
        <Icon className="w-16 h-16 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-sm text-gray-600 text-center mb-6 flex-grow">{description}</p>
      <button 
        className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 flex items-center justify-center ${
          isSelected 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
        {isSelected && <ChevronRight className="ml-1 w-4 h-4" />}
      </button>
    </motion.div>
  );

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if state exists and has necessary data
    if (location.state && location.state.email && location.state.password) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    } else {
      // If state is missing, set an error and prepare to redirect
      setError('Required information is missing. Redirecting to sign up page...');
      const timer = setTimeout(() => {
        navigate('/signup');
      }, 1000);  // Redirect after 3 seconds

      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  const roles = [
    {
      title: 'Farmer',
      code: 'FARMER',
      icon: Tractor,
      color: 'bg-green-500',
      description: 'Manage your farm, schedule spraying sessions, and track crop health.',
    },
    {
      title: 'Receptionist',
      code: 'RECEPTIONIST',
      icon: UserCircle,
      color: 'bg-blue-500',
      description: 'Handle bookings, manage customer inquiries, and coordinate spraying schedules.',
    },
    {
      title: 'Sprayer',
      code: 'SPRAYER',
      icon: Droplets,
      color: 'bg-teal-500',
      description: 'Perform spraying operations, maintain equipment, and update job statuses.',
    },
  ];

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const sprayerRole = roles.find(role => role.title === selectedRole);
      navigate('/user-details', { state: { email, password, role: sprayerRole.code } });
    } else {
      setError('Please select a role before continuing.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-6xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Select Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <RoleCard
              key={role.title}
              {...role}
              isSelected={selectedRole === role.title}
              onClick={() => handleRoleSelection(role.title)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 flex items-center justify-center ${
                selectedRole 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
          >
            Continue as {selectedRole || 'Selected Role'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;