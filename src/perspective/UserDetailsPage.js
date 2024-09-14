import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Home, Star, Droplet, Tractor, Cloud, Sun } from 'lucide-react';
import { createAcount, login } from '../service/DataService';

const UserDetailsSignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: initialEmail, password, role } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: initialEmail || '',
    homeAddress: '',
    expertise: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      emailAddress: formData.emailAddress,
      passwordHash: password,
      fullName: formData.fullName,
      homeAddress: formData.homeAddress,
      role,
      phoneNumber: formData.phoneNumber,
      expertise: role === 'SPRAYER' ? formData.expertise : null
    };
    console.log('User Data:', userData);
    try {
      const response = await createAcount(userData);
      if (response.status == '200') {
        const responseSignIn = await login({username: userData.emailAddress, password: userData.passwordHash});
        if (response.status == '200') {
            navigate('/');
        }
      }
    } catch (error) {
      console.log("Got error: " + error)
    }
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="homeAddress">
                  Home Address
                </label>
                <div className="relative">
                  <Home className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {role === "SPRAYER" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expertise">
                    Expertise Level
                  </label>
                  <div className="relative">
                    <Star className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Expertise</option>
                      <option value="APPRENTICE">Apprentice</option>
                      <option value="ADEPT">Adept</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                type="submit"
              >
                <Tractor className="inline-block w-5 h-5 mr-2" />
                Complete Registration
              </motion.button>
            </form>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Why Choose HoverSprite?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>Personalized crop management</span>
              </li>
              <li className="flex items-center">
                <Droplet className="w-5 h-5 mr-2" />
                <span>Precision spraying techniques</span>
              </li>
              <li className="flex items-center">
                <Tractor className="w-5 h-5 mr-2" />
                <span>Expert sprayers at your service</span>
              </li>
            </ul>
            <div className="mt-6 bg-white text-black p-4 rounded-md">
              <h4 className="text-lg font-semibold mb-2 text-green-600">Get Started Today</h4>
              <p className="text-sm text-gray-600">Complete your profile to access our full range of services and start optimizing your crop management.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsSignUpPage;