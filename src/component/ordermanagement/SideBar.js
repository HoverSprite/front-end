import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, ArrowLeft, Menu, X } from 'lucide-react';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
const Sidebar = ({ isOpen, onClose }) => {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
            onClick={onClose}
          ></div>
        )}
        
        {/* Sidebar */}
        <div className={`fixed inset-y-0 right-0 w-64 max-w-[80%] bg-white shadow-lg z-[10000] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                  <Search size={18} />
                  <span className="text-sm">Search</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                  <Bell size={18} />
                  <span className="text-sm">Notifications</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                  <img src="/api/placeholder/32/32" alt="User" className="w-5 h-5 rounded-full" />
                  <span className="text-sm">Profile</span>
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default Sidebar;