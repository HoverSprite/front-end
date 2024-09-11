import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './perspective/HomePage';
import ScanPage from './perspective/ScanPage';
import QRCodePage from './perspective/QRCodePage';
import OrderManagementPage from './perspective/OrderManagementPage';
import Dashboard from './component/ordermanagement/Code1';
import OrderDetailComponent from './component/ordermanagement/OrdeDetailComponent';
import ShopZenApp from './component/ordermanagement/Code4';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/qr" element={<QRCodePage />} />
        <Route path="/order-manage" element={<OrderManagementPage />} />
        <Route path="/code1" element={<Dashboard />} />
        <Route path="/order-detail" element={<OrderDetailComponent />} />
        <Route path="/code4" element={<ShopZenApp />} />
      </Routes>
    </div>
  );
}

export default App;


