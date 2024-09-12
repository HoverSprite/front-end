import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, ChevronDown, Search, MoreHorizontal } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-gray-100 h-screen p-4">
    <div className="flex items-center mb-8">
      <div className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center mr-2">S</div>
      <span className="text-xl font-bold">ShopZen</span>
    </div>
    {['Home', 'Orders', 'Products', 'Customers', 'Content', 'Finances', 'Analytics', 'Marketing', 'Discounts', 'Sales Channels', 'Online Store', 'Point of Sale', 'Shop', 'Apps', 'Setting'].map((item, index) => (
      <div key={index} className={`py-2 px-4 my-1 rounded ${item === 'Orders' ? 'bg-purple-100 text-purple-600' : ''}`}>
        {item}
      </div>
    ))}
  </div>
);

const Header = () => (
  <div className="flex justify-between items-center p-4 border-b">
    <div className="flex items-center bg-gray-100 rounded-md p-2">
      <Search className="text-gray-400 mr-2" size={20} />
      <input type="text" placeholder="Search or type command..." className="bg-transparent outline-none" />
    </div>
    <div className="flex items-center">
      <Bell className="mr-4" size={20} />
      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
    </div>
  </div>
);

const StatCard = ({ title, value, change }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex items-end">
      <span className="text-3xl font-bold mr-2">{value}</span>
      <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change > 0 ? '▲' : '▼'} {Math.abs(change)}% last week
      </span>
    </div>
    <ResponsiveContainer width="100%" height={50}>
      <BarChart data={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 2 }, { value: 4 }]}>
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const OrdersTable = () => (
  <table className="w-full mt-4">
    <thead>
      <tr className="text-left">
        <th className="p-2">Order</th>
        <th className="p-2">Date</th>
        <th className="p-2">Customer</th>
        <th className="p-2">Payment</th>
        <th className="p-2">Total</th>
        <th className="p-2">Items</th>
        <th className="p-2">Fulfillment</th>
        <th className="p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {[
        { id: '#1002', date: '11 Feb, 2024', customer: 'Wade Warren', payment: 'Pending', total: '$200.00', items: '2 items', fulfillment: 'Unfulfilled' },
        { id: '#1004', date: '13 Feb, 2024', customer: 'Esther Howard', payment: 'Success', total: '$220.00', items: '3 items', fulfillment: 'Fulfilled' },
        { id: '#1007', date: '15 Feb, 2024', customer: 'Jenny Wilson', payment: 'Pending', total: '$250.00', items: '1 items', fulfillment: 'Unfulfilled' },
      ].map((order, index) => (
        <tr key={index} className="border-t">
          <td className="p-2">{order.id}</td>
          <td className="p-2">{order.date}</td>
          <td className="p-2">{order.customer}</td>
          <td className="p-2">
            <span className={`px-2 py-1 rounded ${order.payment === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {order.payment}
            </span>
          </td>
          <td className="p-2">{order.total}</td>
          <td className="p-2">{order.items}</td>
          <td className="p-2">
            <span className={`px-2 py-1 rounded ${order.fulfillment === 'Fulfilled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.fulfillment}
            </span>
          </td>
          <td className="p-2">
            <MoreHorizontal size={20} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Dashboard = () => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex items-center">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-l">Export</button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r flex items-center">
              More actions <ChevronDown size={20} className="ml-2" />
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded ml-4">Create order</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Orders" value="21" change={25.25} />
          <StatCard title="Order items over time" value="15" change={18.2} />
          <StatCard title="Returns Orders" value="0" change={-12} />
          <StatCard title="Fulfilled orders over time" value="12" change={12.2} />
        </div>
        <OrdersTable />
      </div>
    </div>
  </div>
);

export default Dashboard;