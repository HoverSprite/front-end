// src/component/ordermanagement/OrderListManagement.js

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Download, Edit, MessageCircle, MapPin, Calendar, Users, Crop, DollarSign, Eye, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getListOfOrders } from '../../service/DataService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; // Import useUser

const OrderListManagement = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 10;
  const navigate = useNavigate();
  const { user } = useUser(); // Get user from context

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getListOfOrders(user);
        console.log(response);
        // The data is already parsed, so we don't need to call response.json()
        if (response.status === 200 && response.data) {
          setOrders(response.data);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user && (user.role === 'FARMER' || user.role === 'RECEPTIONIST')) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter(order =>
    Object.values(order).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (orderId) => {
    navigate(`/order-detail?orderId=${orderId}`);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const StatusBadge = ({ status }) => {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const OrderCard = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-md mb-4 sm:hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-xs text-gray-500">{new Date(order.dateTime).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center">
          <Crop size={14} className="text-green-600 mr-2" />
          <span className="text-sm">{order.cropType}</span>
        </div>
        <div className="flex items-center">
          <MapPin size={14} className="text-blue-600 mr-2" />
          <span className="text-sm">{order.area} m²</span>
        </div>
        <div className="flex items-center">
          <DollarSign size={14} className="text-yellow-600 mr-2" />
          <span className="text-sm">${order.cost.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="text-purple-600 mr-2" />
          <span className="text-sm">Session #{order.spraySession}</span>
        </div>
      </div>
      <div className="flex items-center mb-3">
        <Users size={14} className="text-gray-600 mr-2" />
        <span className="text-sm">Farmer #{order.farmer}</span>
      </div>
      <div className="flex justify-between items-center">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => handleViewDetails(order.id)}
        >
          <Eye size={14} className="mr-1" />
          <span className="text-sm">View Details</span>
        </button>
        <div className="flex space-x-3">
          <button className="text-gray-600 hover:text-gray-800">
            <Edit size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <Download size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition duration-300 flex items-center">
                <Plus size={16} className="mr-1" />
                <span className="hidden sm:inline">New Order</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={20} />
              </button>
              <div className="flex items-center">
                <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
                <ChevronDown size={16} className="text-gray-500 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl sm:mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-20">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders"
              className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button className="px-3 py-2 border rounded-md flex items-center justify-center w-full sm:w-auto">
              Filters <ChevronDown size={16} className="ml-1" />
            </button>
            <button className="px-3 py-2 border rounded-md flex items-center justify-center w-full sm:w-auto">
              Sort <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="sm:hidden space-y-4">
          {currentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.dateTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.farmer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.cropType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.area} m²</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Download size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <MessageCircle size={16} />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(Math.ceil(filteredOrders.length / ordersPerPage)).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === number + 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default OrderListManagement;
