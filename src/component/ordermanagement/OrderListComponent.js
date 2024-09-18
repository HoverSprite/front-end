import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Download, Edit, MessageCircle, MapPin, Calendar, Users, Crop, DollarSign, Eye, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getListOfOrders } from '../../service/DataService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const OrderListManagement = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const ordersPerPage = 10;
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, status]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getListOfOrders(currentPage, ordersPerPage, status);
      console.log(response);
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order-detail?orderId=${orderId}`);
  };

  const handleCreateNewOrder = () => {
    navigate(`/create`);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchOrders();
  };

  const StatusBadge = ({ status }) => {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'ASSIGN_PROCESSING': 'bg-purple-100 text-purple-800',
      'ASSIGNED': 'bg-indigo-100 text-indigo-800',
      'IN_PROGRESS': 'bg-orange-100 text-orange-800',
      'SPRAY_COMPLETED': 'bg-teal-100 text-teal-800',
      'COMPLETED': 'bg-green-100 text-green-800'
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
          <span className="text-sm">{order.area} decare</span>
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
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
          </div>
          
          <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex space-x-2">
                  {(user.roles.includes('ROLE_RECEPTIONIST') || user.roles.includes('ROLE_FARMER')) && (
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center"
                      onClick={handleCreateNewOrder}
                    >
                      <Plus size={16} className="mr-2" />
                      New Order
                    </button>
                  )}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                    onChange={(e) => handleStatusChange(e.target.value)}
                    value={status || ''}
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="ASSIGN_PROCESSING">Assign Processing</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SPRAY_COMPLETED">Spray Completed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
          <>
            <div className="sm:hidden space-y-4">
              {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
            </div>


            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Date', 'Farmer ID', 'Crop Type', 'Area', 'Cost', 'Status', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.area} decare</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.cost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800" onClick={() => handleViewDetails(order.id)}>
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Download size={16} />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <MessageCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {currentPage * ordersPerPage + 1} to {Math.min((currentPage + 1) * ordersPerPage, totalElements)} of {totalElements} entries
                  </div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === number ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
            </div>
          </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderListManagement;
