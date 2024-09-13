import React from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">HoverSprite</Link>
        {user ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.role}</span>
            <Link to="/sprayorder" className="mr-4 hover:underline">Create Spray Order</Link>
            <NotificationIcon userId={user.id} userRole={user.role} />
            <button onClick={onLogout} className="ml-4 bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/" className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;