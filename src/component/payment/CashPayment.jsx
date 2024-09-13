import React, { useState } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';

const CashPayment = ({ totalCost, onPaymentComplete }) => {
  const [cashAmount, setCashAmount] = useState('');
  const [change, setChange] = useState(0);

  const handleCashAmountChange = (e) => {
    const amount = e.target.value;
    setCashAmount(amount);
    if (amount && !isNaN(amount)) {
      const changeAmount = parseFloat(amount) - totalCost;
      setChange(changeAmount >= 0 ? changeAmount : 0);
    } else {
      setChange(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(cashAmount)
    if (parseFloat(cashAmount) >= totalCost) {
      onPaymentComplete('cash', cashAmount);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Cash Received
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="number"
              name="cashAmount"
              id="cashAmount"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0"
              value={cashAmount}
              onChange={handleCashAmountChange}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                VND
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
          <span className="text-sm font-medium text-blue-700">Total Due</span>
          <span className="text-sm font-semibold text-blue-700">{totalCost.toLocaleString()} VND</span>
        </div>

        <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
          <span className="text-sm font-medium text-green-700">Change</span>
          <span className="text-sm font-semibold text-green-700">{change.toLocaleString()} VND</span>
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            parseFloat(cashAmount) >= totalCost
              ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={parseFloat(cashAmount) < totalCost}
        >
          Complete Cash Payment
          <ArrowRight className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default CashPayment;