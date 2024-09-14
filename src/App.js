// // src/App.js
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './perspective/HomePage';
import ScanPage from './perspective/ScanPage';
import QRCodePage from './perspective/QRCodePage';
import OrderManagementPage from './perspective/OrderManagementPage';
import Dashboard from './component/ordermanagement/Code1';
import OrderDetailComponent from './component/ordermanagement/OrdeDetailComponent';
import ShopZenApp from './component/ordermanagement/Code4';
import PaymentPage from "./perspective/PaymentPage";
import SignUpPage from './perspective/SignUpPage';
import SignInPage from './perspective/SignInPage';
import RoleSelectionPage from './perspective/RoleSelectionPage';
import UserDetailsSignUpPage from './perspective/UserDetailsPage';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/scan" element={<AnimatedPage><ScanPage /></AnimatedPage>} />
          <Route path="/qr" element={<AnimatedPage><QRCodePage /></AnimatedPage>} />
          <Route path="/order-manage" element={<AnimatedPage><OrderManagementPage /></AnimatedPage>} />
          <Route path="/code1" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/order-detail" element={<AnimatedPage><OrderDetailComponent /></AnimatedPage>} />
          <Route path="/code4" element={<AnimatedPage><ShopZenApp /></AnimatedPage>} />
          <Route path="/payment" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
          <Route path="/signin" element={<AnimatedPage><SignInPage /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><SignUpPage /></AnimatedPage>} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/user-details" element={<UserDetailsSignUpPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
// import React, { useState } from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import RoleSelection from './component/RoleSelection';
// import FarmerDashboard from './component/FarmerDashboard';
// import ReceptionistDashboard from './component/ReceptionistDashboard';
// import SprayerDashboard from './component/SprayerDashboard';
// import SprayOrderPage from './component/SprayOrderPage';
// import MapComponent from './component/MapComponent';
// import Navbar from './component/NavbarComponent';
// import './App.css';
// import HomePage from './perspective/HomePage';
// import ScanPage from './perspective/ScanPage';
// import QRCodePage from './perspective/QRCodePage';
// import OrderManagementPage from './perspective/OrderManagementPage';
// import Dashboard from './component/ordermanagement/Code1';
// import OrderDetailComponent from './component/ordermanagement/OrdeDetailComponent.js';
// import ShopZenApp from './component/ordermanagement/Code4';
// import PaymentPage from "./perspective/PaymentPage";
// import { LanguageProvider } from './localization/LanguageContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { useTheme } from './contexts/ThemeContext';
// import { UserProvider } from './contexts/UserContext'; // Import UserProvider

// const AppContent = () => {
//   const [user, setUser] = useState(null);
//   const { isDark } = useTheme();

//   const handleSelectRole = (role) => {
//     if (role === 'FARMER') {
//       setUser({ role: 'FARMER', id: '1' });
//     } else if (role === 'RECEPTIONIST') {
//       setUser({ role: 'RECEPTIONIST', id: '2' });
//     } else if (role === 'SPRAYER') {
//       setUser({ role: 'SPRAYER', id: '3' });
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//   };

//   return (
//     <UserProvider user={user} setUser={setUser}> {/* Wrap with UserProvider */}
//       <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//         {user && <Navbar user={user} onLogout={handleLogout} />}
//         <Routes>
//           <Route 
//             path="/" 
//             element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <RoleSelection onSelectRole={handleSelectRole} />} 
//           />
//           <Route 
//             path="/farmer" 
//             element={user && user.role === 'FARMER' ? <FarmerDashboard /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/receptionist" 
//             element={user && user.role === 'RECEPTIONIST' ? <ReceptionistDashboard /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/sprayer" 
//             element={user && user.role === 'SPRAYER' ? <SprayerDashboard user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/sprayorder" 
//             element={user ? <SprayOrderPage user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/map" 
//             element={user && user.role === 'SPRAYER' ? <MapComponent /> : <Navigate to="/" />} 
//           />
//           <Route path="/" element={<HomePage />} />
//           <Route path="/scan" element={<ScanPage />} />
//           <Route path="/qr" element={<QRCodePage />} />
//           <Route path="/order-manage" element={<OrderManagementPage />} />
//           <Route path="/code1" element={<Dashboard />} />
//           <Route path="/order-detail" element={<OrderDetailComponent />} />
//           <Route path="/code4" element={<ShopZenApp />} />
//           <Route path="/payment" element={<PaymentPage />} />
//         </Routes>
//       </div>
//     </UserProvider>
//   );
// };

// const App = () => {
//   return (
//     <LanguageProvider>
//       <ThemeProvider>
//         <AppContent />
//       </ThemeProvider>
//     </LanguageProvider>
//   );
// };

// export default App;
