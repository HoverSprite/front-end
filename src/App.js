import './App.css';
import './utils/axiosConfig';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import SprayOrderPage from './component/SprayOrderPage';
import Navbar from './component/NavbarComponent'; // Import Navbar
import { LanguageProvider } from './localization/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import MapComponent from './component/MapComponent';


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

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  const showNavbar = !['/signin', '/signup', '/role-selection', '/user-details'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/signin" element={<AnimatedPage><SignInPage /></AnimatedPage>} />
        <Route path="/signup" element={<AnimatedPage><SignUpPage /></AnimatedPage>} />
        <Route
          path="/"
          element={
              <AnimatedPage><HomePage /></AnimatedPage>
          }
        />
        <Route
          path="/order-manage"
          element={
            <ProtectedRoute>
              <AnimatedPage><OrderManagementPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={['ROLE_FARMER']}>
              <AnimatedPage><ScanPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <ProtectedRoute allowedRoles={['ROLE_SPRAYER']}>
              <AnimatedPage><QRCodePage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-detail"
          element={
            <ProtectedRoute>
              <AnimatedPage><OrderDetailComponent /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={['ROLE_FARMER']}>
              <AnimatedPage><PaymentPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_RECEPTIONIST']}>
              <AnimatedPage><SprayOrderPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/role-selection"
          element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage><RoleSelectionPage /></AnimatedPage>
              )
          }
        />
        <Route
          path="/user-details"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AnimatedPage><UserDetailsSignUpPage /></AnimatedPage>
            )
          }
        />
        <Route
          path="/route"
          element={
            <ProtectedRoute allowedRoles={['ROLE_SPRAYER']}>
              <AnimatedPage><MapComponent /></AnimatedPage>
            </ProtectedRoute>
          }
        />

      </Routes>
    </AnimatePresence>
    </>

  );
}

// function App() {
//   return (
//     <div className="App">
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </div>
//   );
// }

// export default App;

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
      <AuthProvider>

        <AppRoutes />
        </AuthProvider>

      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;