import React from 'react';
import { useCustomer } from '../context/CustomerContext';
import { formatDistanceToNow, format } from 'date-fns';
import { DollarSign, Gift, AlertTriangle, Receipt, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
}

export const TransactionHistory: React.FC<Props> = ({ onClose, isDarkMode }) => {
  const { customer } = useCustomer();

  const getTransactionStyle = (transaction: { type: string; status?: string }) => {
    if (transaction.status === 'failed') {
      return {
        bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
        text: 'text-red-400',
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />
      };
    }
    
    switch (transaction.type) {
      case 'payment':
        return {
          bg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-900',
          icon: <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
        };
      case 'reward':
        return {
          bg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
          text: 'text-rethink-blue',
          icon: <Gift className="w-5 h-5 text-rethink-blue" />
        };
      case 'cashback':
        return {
          bg: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
          text: 'text-green-500',
          icon: <DollarSign className="w-5 h-5 text-green-500" />
        };
      case 'offer_redemption':
        return {
          bg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-900',
          icon: <Receipt className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
        };
      case 'reward_redemption':
        return {
          bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
          text: 'text-rethink-red',
          icon: <DollarSign className="w-5 h-5 text-rethink-red" />
        };
      default:
        return {
          bg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-900',
          icon: <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
        };
    }
  };

  const getTransactionDescription = (transaction: any) => {
    switch (transaction.type) {
      case 'payment':
        return 'Subscription Payment';
      case 'reward':
        return 'Reward Credit';
      case 'cashback':
        return 'Cash Back Reward';
      case 'offer_redemption':
        return `Redeemed: ${transaction.offerName}`;
      case 'reward_redemption':
        return 'Rewards Redeemed';
      case 'failed':
        return 'Failed Payment';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} flex items-center justify-between`}>
        <h2 className={`text-xl font-outfit font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Transaction History
        </h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {customer.transactions.map((transaction, index) => {
          const style = getTransactionStyle(transaction);
          const timestamp = new Date(transaction.timestamp);
          
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col p-4 rounded-xl ${style.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {style.icon}
                  <div>
                    <p className={`font-medium ${style.text}`}>
                      {getTransactionDescription(transaction)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {transaction.amount !== 0 && (
                  <span className={`font-semibold ${style.text}`}>
                    {transaction.type === 'payment' || transaction.type === 'reward_redemption' ? '-' : '+'}${Math.abs(transaction.amount)}
                  </span>
                )}
              </div>
              <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {format(timestamp, 'MMM d, yyyy h:mm a')}
              </div>
            </motion.div>
          );
        })}
        {customer.transactions.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};