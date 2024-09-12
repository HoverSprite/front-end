import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import OrderDetails from '../../fragment/ordermanagement/OrderDetails';
import { getOrderDetails } from '../../service/DataService';

const OrderDetailComponent = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);

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
        setOrderData(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  const handleUpdateOrder = async (updatedData) => {
    try {
      const response = await getOrderDetails(updatedData.id);
      setOrderData({ ...response.data });
      setForceUpdate((prev) => prev + 1); // Trigger a re-render
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  useEffect(() => {
    console.log("here")
  }, [forceUpdate]);


  if (!orderData) {
    return <div>Loading...</div>;
  }

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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-6">
            <button
              onClick={handleGoBack}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Go Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center space-x-4">
              <Search className="text-gray-500" />
              <Bell className="text-gray-500" />
              <div className="flex items-center">
                <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full mr-2" />
                <ChevronDown className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <OrderDetails orderData={orderData} onUpdate={handleUpdateOrder} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailComponent;