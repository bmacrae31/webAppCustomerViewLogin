import React from 'react';
import { Receipt, Download, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCustomer } from '../../context/CustomerContext';

interface Props {
  isDarkMode: boolean;
}

export const BillingHistory: React.FC<Props> = ({ isDarkMode }) => {
  const { customer } = useCustomer();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Billing History
        </h3>
      </div>

      <div className="space-y-4">
        {customer.transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <Receipt className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.type === 'payment' ? 'Subscription Payment' : 'Bill Payment'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(new Date(transaction.timestamp), 'PPp')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${Math.abs(transaction.amount)}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  getStatusStyle(transaction.status)
                }`}>
                  {transaction.status === 'success' ? 'Paid' : 'Failed'}
                </span>
                {transaction.status === 'failed' && (
                  <button
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-600'
                    } transition-colors`}
                    title="View Details"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                )}
                {transaction.status === 'success' && (
                  <button
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-600'
                    } transition-colors`}
                    title="Download Invoice"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {customer.transactions.length === 0 && (
          <div className="text-center py-8">
            <Receipt className={`w-12 h-12 mx-auto mb-3 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              No transactions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};