import React from "react";
import "./OrderSummary.css";

const OrderSummary = ({ order }) => {
  return (
    <div className="order-summary">
      <h2>Order #{order.id}</h2>
      <div className="order-header">
        <span className="crop-icon">🌾</span>
        <span className="crop-type">{order.cropType}</span>
      </div>
      <div className="order-details">
        <p>
          <strong>Area:</strong> {order.area.toFixed(2)} hectares
        </p>
        <p>
          <strong>Location:</strong> {order.location}
        </p>
        <p>
          <strong>Date:</strong> {order.serviceDate.toLocaleDateString()}
        </p>
      </div>
      <div className="order-cost">
        <h3>Total Cost</h3>
        <p className="total-cost">{order.totalCost.toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default OrderSummary;
