import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListOfOrders } from '../service/DataService';

const FarmerDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getListOfOrders(user.id, user.role);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Farmer Dashboard</h1>
      <p className="text-lg mb-6">Welcome to your farmer dashboard. Here you can manage your spray orders and view your field information.</p>
      <Link to="/sprayorder" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
        Create Spray Order
      </Link>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map(order => (
              <li key={order.id} className="mb-2">
                <Link to={`/order-detail/${order.id}`} className="text-blue-600 hover:underline">
                  Order #{order.id} - Status: {order.status}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;