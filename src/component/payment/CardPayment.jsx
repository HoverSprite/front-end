import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CardPayment.css";

const CardPayment = ({ amount, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardBrand, setCardBrand] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }

    if (event.brand) {
      setCardBrand(event.brand);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      // In a real app, you'd send the payment method to your server here
      onPaymentComplete("card", amount);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card-payment-form">
      <div className="card-input-container">
        <div className="card-brands">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className={`card-brand-logo ${
              cardBrand === "visa" ? "active" : ""
            }`}
          />
          <img
            src="https://www.svgrepo.com/show/126529/mastercard.svg"
            alt="Mastercard"
            className={`card-brand-logo ${
              cardBrand === "mastercard" ? "active" : ""
            }`}
          />
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
          onChange={handleChange}
        />
      </div>
      {error && <div className="card-error">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="pay-button"
      >
        {isProcessing ? "Processing..." : `Pay ${amount.toLocaleString()} VND`}
      </button>
    </form>
  );
};

export default CardPayment;
