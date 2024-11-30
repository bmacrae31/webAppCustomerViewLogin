import React from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { Star, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  isDarkMode: boolean;
}

export const MembershipDetails: React.FC<Props> = ({ isDarkMode }) => {
  const { customer } = useCustomer();

  const features = [
    'Automatic rewards on every payment',
    'Exclusive member-only offers',
    'Priority customer support',
    'Early access to new features',
  ];

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
          <Star className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Membership Status
          </h3>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              customer.isSubscribed
                ? 'bg-green-500/10 text-green-500'
                : 'bg-yellow-500/10 text-yellow-500'
            }`}>
              {customer.isSubscribed ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Monthly Fee</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${customer.subscriptionAmount}
            </span>
          </div>
          
          {customer.lastPaymentDate && (
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Last Payment</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {customer.lastPaymentDate}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Membership Benefits
        </h3>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <CheckCircle2 className={`w-5 h-5 ${
                customer.isSubscribed
                  ? 'text-green-500'
                  : isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <span className={`${
                customer.isSubscribed
                  ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {!customer.isSubscribed && (
        <div className="flex justify-center">
          <button
            onClick={() => {}} // Will be implemented in the next update
            className="px-6 py-2 bg-rethink-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Membership
          </button>
        </div>
      )}
    </div>
  );
};