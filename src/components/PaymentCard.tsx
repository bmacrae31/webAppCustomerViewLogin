import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  isDarkMode: boolean;
}

export const PaymentCard: React.FC<Props> = ({ isDarkMode }) => {
  const { customer, processBillPayment } = useCustomer();
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0) {
      await processBillPayment(numericAmount);
      setAmount('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl card-shadow p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h3 className={`text-lg font-outfit font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
        Pay Bill
      </h3>
      
      <div className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-2">
          <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Earn 5% Cash Back
          </span>
        </div>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Rewards will be added to your balance automatically
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="billAmount" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Bill Amount
          </label>
          <div className="mt-1 relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>$</span>
            </div>
            <input
              type="number"
              inputMode="decimal"
              name="billAmount"
              id="billAmount"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`block w-full pl-7 pr-4 py-3 sm:text-sm rounded-xl border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600'
                  : 'bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900'
              }`}
              placeholder="Enter bill amount"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all duration-200"
        >
          <span>Pay Bill</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>
    </motion.div>
  );
};