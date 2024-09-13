import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Crop, CreditCard, ArrowLeft, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CashPayment from "../component/payment/CashPayment";
import CardPayment from "../component/payment/CardPayment";
import { getOrderDetails, sendUpdatedOrderToAPI } from "../service/DataService";

const stripePromise = loadStripe(
  "pk_test_51PxtUEGcgUkVJh5X3NhkPGsCogF9gzXVOiq32FbjAzZhtvGP3NTUC7p04baM2XFQXCBNnGY5oc53wGa6oDuj22fo00s67jICCn"
);

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error("No orderId provided in URL");
        return;
      }

      try {
        const response = await getOrderDetails(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePaymentComplete = async (method, paidAmount) => {
    setIsProcessing(true);
    let updatedOrder;
    let paymentData;
    console.log(method)
    console.log(paidAmount)
    try {
      paymentData = {
        sprayOrder: order.id,
        farmer: order.farmer.id,
        amount: paidAmount,
        paymentMethod: method === 'cash' ? 'CASH' : (method === 'visa' ? 'VISA' : 'MASTERCARD'),
        transaction: `TRX-${Date.now()}`, // Generate a unique transaction ID
        paymentDate: new Date().toISOString(),
        status: 'SUCCESS' // Assuming payment is successful at this point
      };

      updatedOrder = {
        ...order,
        paymentReceivedAmount: paidAmount,
        payment: paymentData
      };

      await sendUpdatedOrderToAPI(updatedOrder);
      
      console.log(`Payment of ${paidAmount.toLocaleString()} VND completed using ${method}`);
      setIsProcessing(false);
      navigate(`/order-detail?orderId=${orderId}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsProcessing(false);
      
      // Update payment status to FAILED in case of an error
      if (updatedOrder && paymentData) {
        const failedPaymentData = {
          ...paymentData,
          status: 'FAILED'
        };
        updatedOrder = {
          ...updatedOrder,
          payment: failedPaymentData,
        };
        try {
          await sendUpdatedOrderToAPI(updatedOrder);
        } catch (updateError) {
          console.error("Error updating order with failed payment status:", updateError);
        }
      }
      // Handle error (e.g., show error message to user)
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleReturnToOrderDetails = () => {
    navigate(`/order-detail?orderId=${orderId}`);
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-4">
        <button
          onClick={handleReturnToOrderDetails}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Order Details
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md mb-4"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order.id} Payment</h2>
            <p className="text-sm text-gray-500">
              {formatDateTime(order.spraySession.date, order.spraySession.startTime)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <p className="text-sm text-gray-700 mb-2">
              <User className="inline mr-2" size={16} />
              Farmer: {`${order.farmer.firstName} ${order.farmer.lastName}`}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <Crop className="inline mr-2" size={16} />
              Crop Type: {order.cropType}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <MapPin className="inline mr-2" size={16} />
              Location: {order.location}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Service Date: {formatDateTime(order.spraySession.date, order.spraySession.startTime)}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <DollarSign className="inline mr-2" size={16} />
              Total Cost: {order.cost.toLocaleString()} VND
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex mb-4 border-b">
              <button
                className={`pb-2 px-4 text-sm font-medium ${paymentMethod === 'cash' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                Cash Payment
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${paymentMethod === 'card' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setPaymentMethod('card')}
              >
                Card Payment
              </button>
            </div>
            {paymentMethod === "cash" && (
              <CashPayment
                totalCost={order.cost}
                onPaymentComplete={(method, amount) => handlePaymentComplete(method, amount)}
              />
            )}
            {paymentMethod === "card" && (
              <Elements stripe={stripePromise}>
                <CardPayment
                  amount={order.cost}
                  onPaymentComplete={(amount, cardType) => handlePaymentComplete(amount)}
                />
              </Elements>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;