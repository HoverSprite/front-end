import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Droplet, ArrowRight, Leaf, Shield, Crop } from 'lucide-react';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { getOrderDetails } from '../../service/DataService';
import OrderDetails from '../../fragment/ordermanagement/OrderDetails';
import { useAuth } from '../../context/AuthContext';

const OrderDetailComponent = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrderDetails(orderId);
        if (response && response.data) {
          setOrderData(response.data);
        } else {
          setOrderData(null);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setOrderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location, user, forceUpdate]);

  const handleUpdateOrder = async (updatedData) => {
    try {
      const response = await getOrderDetails(updatedData.id);
      setOrderData({ ...response.data });
      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/order-manage');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!orderData) {
    return <div className="flex justify-center items-center h-screen">No order found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
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
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={20} />
              </button>
              <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderDetails orderData={orderData} onUpdate={handleUpdateOrder} />
      </main>
    </div>
  );
};

export default OrderDetailComponent;