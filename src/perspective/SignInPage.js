import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Droplet, Tractor, Cloud, Sun, TreePalmIcon, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const signinResponse = await login(email, password);
      if (signinResponse) {
        // Redirect to the dashboard or home page
        navigate('/');
      }
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:8080/api/oauth2/authorization/google?authType=signin&provider=google';
  };

  const handleFacebookSignIn = () => {
    window.location.href = 'http://localhost:8080/api/oauth2/authorization/facebook?authType=signin&provider=facebook';
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Sign in to manage your spraying sessions and optimize your crop yield.</p>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="email"
                    id="email"
                    placeholder="your@farm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500">Forgot password?</a>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center"
                type="submit"
              >
                <Tractor className="w-5 h-5 mr-2" />
                Sign in to HoverSprite
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center mt-4"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center mt-4"
                onClick={handleFacebookSignIn}
              >
                <FaFacebook className="w-5 h-5 mr-2" />
                Sign in with Facebook
              </motion.button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <a onClick={handleSignUp} className="text-green-600 hover:text-green-800 font-semibold cursor-pointer">Sign up</a>
            </p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Farm Insights</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border-b border-green-500 pb-4">
                <div className="flex items-center">
                  <TreePalmIcon className="w-6 h-6 text-green-300 mr-3" />
                  <div>
                    <p className="font-semibold">Crop Health</p>
                    <p className="text-green-200">Excellent</p>
                  </div>
                </div>
                <span className="bg-green-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                  98%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-green-500 pb-4">
                <div className="flex items-center">
                  <Droplet className="w-6 h-6 text-blue-300 mr-3" />
                  <div>
                    <p className="font-semibold">Next Spraying</p>
                    <p className="text-green-200">Sep 20, 09:00 AM</p>
                  </div>
                </div>
                <span className="bg-blue-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                  Scheduled
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white text-green-600 py-2 rounded-md text-sm font-medium hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Farm Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;