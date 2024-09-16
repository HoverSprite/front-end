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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function AppRoutes() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
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
            <ProtectedRoute>
              <AnimatedPage><ScanPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <ProtectedRoute>
              <AnimatedPage><QRCodePage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/code1"
          element={
            <ProtectedRoute>
              <AnimatedPage><Dashboard /></AnimatedPage>
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
          path="/code4"
          element={
            <ProtectedRoute>
              <AnimatedPage><ShopZenApp /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <AnimatedPage><PaymentPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <AnimatedPage><SprayOrderPage /></AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/role-selection"
          element={
              <AnimatedPage><RoleSelectionPage /></AnimatedPage>
          }
        />
        <Route
          path="/user-details"
          element={
              <AnimatedPage><UserDetailsSignUpPage /></AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;