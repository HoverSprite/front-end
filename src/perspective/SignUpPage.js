// src/pages/SignUpPage.jsx

import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Calendar,
  Droplet,
  Tractor,
  Cloud,
  Sun,
} from 'lucide-react';
import axios from 'axios';
import { verifyEmail } from '../service/DataService';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Optional: Confirm Password Field
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Helper functions for validation
  const validateEmail = (email) => {
    // Simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Password must be at least 6 characters and contain a number
    const re = /^(?=.*[0-9]).{6,}$/;
    return re.test(password);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/signin');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    // Validate inputs
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 6 characters long and include a number.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with email verification
    try {
      const response = await verifyEmail(email);
      setMessage(response.data.message);

      setTimeout(() => {
        setMessage('');
        if (response.data.available) {
          navigate('/role-selection', { state: { email, password } });
        }
      }, 1500);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href =
      'http://localhost:8080/api/oauth2/authorization/google?authType=signup&provider=google';
  };

  const handleFacebookSignUp = () => {
    window.location.href =
      'http://localhost:8080/api/oauth2/authorization/facebook?authType=signup&provider=facebook';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <Cloud className="text-blue-100 w-64 h-64 absolute -top-16 -left-16 transform -rotate-12" />
        <Cloud className="text-blue-100 w-48 h-48 absolute top-1/4 right-1/4 transform rotate-6" />
        <Sun className="text-yellow-100 w-72 h-72 absolute -bottom-16 -right-16" />
        <Droplet className="text-green-100 w-40 h-40 absolute bottom-1/4 left-1/4 transform rotate-12" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl relative z-10"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HoverSprite</h1>
              <p className="text-sm text-gray-500">Efficient Crop Management</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Join HoverSprite to easily book and manage your crop spraying sessions.
            </p>
            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center py-2 px-4 rounded ${
                    message.includes('available')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${
                      errors.email ? 'border border-red-500' : ''
                    }`}
                    type="email"
                    id="email"
                    placeholder="your@farm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby="email-error"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${
                      errors.password ? 'border border-red-500' : ''
                    }`}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby="password-error"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${
                      errors.confirmPassword ? 'border border-red-500' : ''
                    }`}
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby="confirmPassword-error"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    className="mt-1 text-sm text-red-600"
                    id="confirmPassword-error"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center"
                type="submit"
              >
                <Tractor className="inline-block w-5 h-5 mr-2" />
                Sign up for HoverSprite
              </motion.button>

              {/* Google Sign Up */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center mt-4"
                type="button"
                onClick={handleGoogleSignUp}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign Up with Google
              </motion.button>

              {/* Facebook Sign Up */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center mt-4"
                type="button"
                onClick={handleFacebookSignUp}
              >
                <FaFacebook className="w-5 h-5 mr-2" />
                Sign Up with Facebook
              </motion.button>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={handleSignIn}
                className="text-green-600 hover:text-green-800 font-semibold cursor-pointer"
              >
                Log in
              </button>
            </p>
          </div>

          {/* Why Choose HoverSprite Sidebar */}
          <div className="bg-green-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Why Choose HoverSprite?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Easy scheduling of spraying sessions</span>
              </li>
              <li className="flex items-center">
                <Droplet className="w-5 h-5 mr-2" />
                <span>Precision crop management</span>
              </li>
              <li className="flex items-center">
                <Tractor className="w-5 h-5 mr-2" />
                <span>Access to expert sprayers</span>
              </li>
            </ul>
            <div className="mt-6 bg-white text-black p-4 rounded-md">
              <h4 className="text-lg font-semibold mb-2 text-green-600">
                Next Available Sessions
              </h4>
              <ul className="space-y-2">
                {[
                  { date: 'Sep 20', time: '09:00 AM', type: 'Pesticide' },
                  { date: 'Sep 22', time: '02:00 PM', type: 'Fertilizer' },
                ].map((session, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {session.date} at {session.time}
                    </span>
                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                      {session.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
