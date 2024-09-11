import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import OrderDetails from '../../fragment/ordermanagement/OrderDetails';

const Header = ({ farmerName, farmerAvatar }) => (
  <div className="flex justify-between items-center p-4 border-b bg-white">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center mr-2">F</div>
      <span className="text-xl font-bold">FarmSync</span>
    </div>
    <div className="flex items-center bg-gray-100 rounded-md p-2 w-1/3">
      <Search className="text-gray-400 mr-2" size={20} />
      <input type="text" placeholder="Search or type command..." className="bg-transparent outline-none w-full" />
    </div>
    <div className="flex items-center">
      <button className="mr-4"><Bell size={20} /></button>
      <img src={farmerAvatar} alt={`${farmerName} Avatar`} className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

const OrderDetailComponent = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/1/farmer/orders/1');
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);

  const handleUpdateOrder = async (updatedData) => {
    try {
      // In a real application, you would send this update to your backend
      // await axios.put(`http://localhost:8080/api/user/1/farmer/orders/${updatedData.id}`, updatedData);
      setOrderData(updatedData);
      console.log('Order updated:', updatedData);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 overflow-auto">
        <Header 
          farmerName={`${orderData.farmer.firstName} ${orderData.farmer.lastName}`}
          farmerAvatar={orderData.farmer.profilePictureUrl}
        />
        <OrderDetails orderData={orderData} onUpdate={handleUpdateOrder} />
      </div>
    </div>
  );
};

export default OrderDetailComponent;