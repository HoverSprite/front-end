import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./perspective/HomePage";
import ScanPage from "./perspective/ScanPage";
import QRCodePage from "./perspective/QRCodePage";
import OrderManagementPage from "./perspective/OrderManagementPage";
import PaymentPage from "./perspective/PaymentPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/qr" element={<QRCodePage />} />
        <Route path="/order-manage" element={<OrderManagementPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
