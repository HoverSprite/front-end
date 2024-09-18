// src/perspective/HomePage.js

import React from 'react';
import { Calendar, MapPin, Droplet, ArrowRight, Leaf, Shield, Crop, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookSession = () => {
    navigate('/create');
  };

  const handleOrderManage = () => {
    navigate('/order-manage');
  };

  const features = [
    { icon: <Calendar size={24} />, title: 'Flexible Scheduling', description: 'Book spraying sessions that fit your farm\'s needs' },
    { icon: <MapPin size={24} />, title: 'Precision Targeting', description: 'GPS-guided drones ensure accurate and efficient spraying' },
    { icon: <Droplet size={24} />, title: 'Customized Solutions', description: 'Tailored spraying plans for different crop types' },
    { icon: <Leaf size={24} />, title: 'Eco-Friendly Approach', description: 'Minimize environmental impact with optimized chemical usage' },
    { icon: <Shield size={24} />, title: 'Crop Protection', description: 'Enhance crop health and increase yield with our services' },
    { icon: <ArrowRight size={24} />, title: 'Streamlined Process', description: 'Easy booking and management of spraying sessions' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Remove or adjust the existing header/nav to avoid duplication */}
      {/* Header */}
      {/* You can keep the header if it serves a different purpose, but ensure it doesn't duplicate the Navbar */}
      {/* <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-3">
                <Crop className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HoverSprite</h1>
                <p className="text-sm text-gray-600">Efficient Crop Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={20} />
              </button>
              <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section */}
          <section className="px-6 py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to HoverSprite</h2>
            <p className="text-xl text-gray-600 mb-8">Revolutionizing Agriculture with Precision Drone Spraying</p>
            {user && user.roles && user.roles.includes('ROLE_SPRAYER') ? (
              <button 
                onClick={handleOrderManage} 
                className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold text-lg hover:bg-green-600 transition duration-300"
              >
                View Your Assigned Orders!
              </button>
            ) : (
              <button 
                onClick={handleBookSession} 
                className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold text-lg hover:bg-green-600 transition duration-300"
              >
                Book a Session!
              </button>
            )}
          </section>

          {/* Features Section */}
          <section className="px-6 py-12 bg-gray-50">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose HoverSprite</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="text-green-500 mb-4">{feature.icon}</div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="px-6 py-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">How HoverSprite Works</h3>
            <div className="flex justify-between items-center">
              {['Book a Session', 'Plan the Route', 'Execute Spraying', 'Monitor Results'].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About HoverSprite</h4>
              <p className="text-sm">Revolutionizing agriculture with cutting-edge drone technology</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-300">Home</a></li>
                <li><a href="#" className="hover:text-green-300">Services</a></li>
                <li><a href="#" className="hover:text-green-300">About Us</a></li>
                <li><a href="#" className="hover:text-green-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-sm">1234 Farming Lane<br />Cropville, AG 56789<br />info@hoversprite.com</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {/* Add social media icons here */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            <p>&copy; 2024 HoverSprite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
