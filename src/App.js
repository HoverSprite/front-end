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