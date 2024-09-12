import React, { useState } from "react";
import "./CashPayment.css";


const CashPayment = ({ totalCost, onPaymentComplete }) => {
  const [receivedAmount, setReceivedAmount] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);
  const [isSprayFinished, setIsSprayFinished] = useState(false);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);

  const handleReceivedAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setReceivedAmount(amount);
    if (amount >= totalCost) {
      setChangeAmount(amount - totalCost);
    } else {
      setChangeAmount(0);
    }
  };

  const handleConfirmPayment = () => {
    if (isSprayFinished && isPaymentReceived && receivedAmount >= totalCost) {
      onPaymentComplete("cash", totalCost);
    } else {
      alert("Please ensure all conditions are met before confirming payment.");
    }
  };

  return (
      <div className="cash-payment">
        <h2>Cash Payment</h2>
        <div className="payment-details">
          <p>
            <strong>Total Cost:</strong> {totalCost.toLocaleString()} VND
          </p>
          <div className="input-group">
            <label htmlFor="received-amount">Received Amount:</label>
            <input
              type="number"
              id="received-amount"
              value={receivedAmount}
              onChange={handleReceivedAmountChange}
              placeholder="Enter received amount"
            />
          </div>
          {changeAmount > 0 && (
            <p>
              <strong>Change to Return:</strong> {changeAmount.toLocaleString()}{" "}
              VND
            </p>
          )}
        </div>
        <div className="confirmation-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={isSprayFinished}
              onChange={() => setIsSprayFinished(!isSprayFinished)}
            />
            FARMER confirmed spray finished
          </label>
          <label>
            <input
              type="checkbox"
              checked={isPaymentReceived}
              onChange={() => setIsPaymentReceived(!isPaymentReceived)}
            />
            SPRAYER received cash payment
          </label>
        </div>
        <button
          className="confirm-payment-button"
          onClick={handleConfirmPayment}
          disabled={
            !isSprayFinished || !isPaymentReceived || receivedAmount < totalCost
          }
        >
          Confirm Payment
        </button>
      </div>
  );
};

export default CashPayment;
