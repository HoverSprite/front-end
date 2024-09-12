import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CashPayment from "../component/payment/CashPayment";
import CardPayment from "../component/payment/CardPayment";
import OrderSummary from "../component/payment/OrderSummary";
import "./PaymentPage.css";

const stripePromise = loadStripe(
  "pk_test_51PxtUEGcgUkVJh5X3NhkPGsCogF9gzXVOiq32FbjAzZhtvGP3NTUC7p04baM2XFQXCBNnGY5oc53wGa6oDuj22fo00s67jICCn"
);

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);

 
  const order = {
    id: 1,
    area: 50.0,
    location: "Field A",
    cropType: "Wheat",
    serviceDate: new Date("2024-09-11"),
    totalCost: 1020000,
  };

  const handlePaymentComplete = (method, paidAmount) => {
    console.log(
      `Payment of ${paidAmount.toLocaleString()} VND completed using ${method}`
    );
    
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-options">
          <h2>Select Payment Method</h2>
          <div className="payment-methods">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={paymentMethod === "cash" ? "active" : ""}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={paymentMethod === "card" ? "active" : ""}
            >
              Card
            </button>
          </div>
          {paymentMethod === "cash" && (
            <CashPayment
              totalCost={order.totalCost}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
          {paymentMethod === "card" && (
            <Elements stripe={stripePromise}>
              <CardPayment
                amount={order.totalCost}
                onPaymentComplete={handlePaymentComplete}
              />
            </Elements>
          )}
        </div>
        <OrderSummary order={order} />
      </div>
    </div>
  );
};

export default PaymentPage;
