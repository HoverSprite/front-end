import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tractor, UserCircle, Droplets, ChevronRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const RoleCard = ({ icon: Icon, color, title, description, isSelected, onClick, isBlocked }) => (
  <motion.div
    whileHover={{ scale: isBlocked ? 1 : 1.02 }}
    whileTap={{ scale: isBlocked ? 1 : 0.98 }}
    className={`relative bg-white rounded-lg p-6 flex flex-col items-center justify-between h-full ${
      isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'
    } transition-all duration-300 ${
      isSelected ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}
    onClick={isBlocked ? null : onClick}
  >
    {isBlocked && (
      <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 rounded-t-lg">
        Features Unavailable
      </div>
    )}
    <div className={`${isBlocked ? 'bg-gray-400' : color} p-4 rounded-full mb-6`}>
      <Icon className={`w-16 h-16 ${isBlocked ? 'text-gray-600' : 'text-white'}`} />
    </div>
    <h3 className={`text-xl font-bold ${isBlocked ? 'text-gray-500' : 'text-gray-800'} mb-4`}>{title}</h3>
    <p className={`text-sm ${isBlocked ? 'text-gray-400' : 'text-gray-600'} text-center mb-6 flex-grow`}>{description}</p>
    <button 
      className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 flex items-center justify-center ${
        isBlocked
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isSelected 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      disabled={isBlocked}
    >
      {isBlocked ? 'Unavailable' : isSelected ? 'Selected' : 'Select'}
      {isSelected && !isBlocked && <ChevronRight className="ml-1 w-4 h-4" />}
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
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setEmail(decodedToken.email);
        setProvider(decodedToken.provider)
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token. Redirecting to sign up page...');
        const timer = setTimeout(() => {
          navigate('/signup');
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      if (location.state && location.state.email && location.state.password) {
        setEmail(location.state.email);
        setPassword(location.state.password);
      } else {
        setError('Required information is missing. Redirecting to sign up page...');
        const timer = setTimeout(() => {
          navigate('/signup');
        }, 1000);
  
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, navigate]);

  const roles = [
    {
      title: 'Farmer',
      code: 'FARMER',
      icon: Tractor,
      color: 'bg-green-500',
      description: 'Manage your farm, schedule spraying sessions, and track crop health.',
      isBlocked: false,
    },
    {
      title: 'Receptionist',
      code: 'RECEPTIONIST',
      icon: UserCircle,
      color: 'bg-blue-500',
      description: 'Handle bookings, manage customer inquiries, and coordinate spraying schedules.',
      isBlocked: false,
    },
    {
      title: 'Sprayer',
      code: 'SPRAYER',
      icon: Droplets,
      color: 'bg-teal-500',
      description: 'Perform spraying operations, maintain equipment, and update job statuses.',
      isBlocked: false,
    },
  ];

  const handleRoleSelection = (role) => {
    if (!role.isBlocked) {
      setSelectedRole(role.title);
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      const sprayerRole = roles.find(role => role.title === selectedRole);
      navigate('/user-details', { state: { email, password, role: sprayerRole.code, provider: provider } });
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
              onClick={() => handleRoleSelection(role)}
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