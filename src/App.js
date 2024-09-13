import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import RoleSelection from './component/RoleSelection';
import FarmerDashboard from './component/FarmerDashboard';
import ReceptionistDashboard from './component/ReceptionistDashboard';
import SprayerDashboard from './component/SprayerDashboard';
import SprayOrderPage from './component/SprayOrderPage';
import Navbar from './component/NavbarComponent';

const App = () => {
  const [user, setUser] = useState(null);

  const handleSelectRole = (role) => {
    if (role === 'FARMER') {
      setUser({ role: 'FARMER', id: '1' });
    } else if (role === 'RECEPTIONIST') {
      setUser({ role: 'RECEPTIONIST', id: '2' });
    } else if (role === 'SPRAYER') {
      setUser({ role: 'SPRAYER', id: '3' });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <RoleSelection onSelectRole={handleSelectRole} />} 
        />
        <Route 
          path="/farmer" 
          element={user && user.role === 'FARMER' ? <FarmerDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/receptionist" 
          element={user && user.role === 'RECEPTIONIST' ? <ReceptionistDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/sprayer" 
          element={user && user.role === 'SPRAYER' ? <SprayerDashboard user={user} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/sprayorder" 
          element={user ? <SprayOrderPage user={user} /> : <Navigate to="/" />} 
        />
      </Routes>
    </>
  );
};

export default App;