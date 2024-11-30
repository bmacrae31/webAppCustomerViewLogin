import React from 'react';
import { useCustomer } from '../context/CustomerContext';
import { CreditCard, Gift, DollarSign, Loader2, Clock } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

export const CustomerCard: React.FC<Props> = ({ isDarkMode }) => {
  const { customer, startSubscription, stopSubscription } = useCustomer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600';
      case 'success':
        return 'text-rethink-blue';
      case 'failed':
        return 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'failed':
        return 'Payment failed';
      default:
        return customer.isSubscribed ? 'Active' : 'Inactive';
    }
  };

  return (
    <div className={`rounded-2xl card-shadow p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className={`font-outfit text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getGreeting()}, Amazing Member
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              {customer.paymentStatus === 'processing' && (
                <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
              )}
              <p className={`text-sm ${getStatusColor(customer.paymentStatus)}`}>
                {getStatusMessage(customer.paymentStatus)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={customer.isSubscribed ? stopSubscription : startSubscription}
          disabled={customer.paymentStatus === 'processing'}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            customer.isSubscribed
              ? `${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border hover:bg-opacity-90 disabled:opacity-50`
              : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
          }`}
        >
          {customer.paymentStatus === 'processing' ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </span>
          ) : (
            customer.isSubscribed ? 'Stop Subscription' : 'Start Subscription'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-2">
            <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Subscription</span>
          </div>
          <p className={`mt-1 text-2xl font-outfit font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${customer.subscriptionAmount}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Billed every 5 minutes</p>
        </div>

        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-2">
            <Gift className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Rewards</span>
          </div>
          <p className="mt-1 text-2xl font-outfit font-bold text-rethink-blue">
            ${customer.rewardBalance}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total rewards earned</p>
        </div>

        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Last Payment</span>
          </div>
          <p className={`mt-1 text-lg font-outfit font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
            {customer.lastPaymentDate || 'No payments yet'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next payment in 5 minutes</p>
        </div>
      </div>
    </div>
  );
};