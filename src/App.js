import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import RoleSelection from './component/RoleSelection';
import FarmerDashboard from './component/FarmerDashboard';
import ReceptionistDashboard from './component/ReceptionistDashboard';
import SprayerDashboard from './component/SprayerDashboard';
import SprayOrderPage from './component/SprayOrderPage';
import MapComponent from './component/MapComponent';
import Navbar from './component/NavbarComponent';
import { LanguageProvider } from './localization/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const { isDark } = useTheme();

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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
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
        <Route 
          path="/map" 
          element={user && user.role === 'SPRAYER' ? <MapComponent /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;