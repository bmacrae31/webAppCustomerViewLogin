import React from 'react';
import { useCustomer } from '../context/CustomerContext';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Gift, AlertTriangle, Receipt } from 'lucide-react';

export const TransactionLog: React.FC = () => {
  const { customer } = useCustomer();

  const getTransactionStyle = (transaction: { type: string; status?: string }) => {
    if (transaction.status === 'failed') {
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />
      };
    }
    
    switch (transaction.type) {
      case 'payment':
        return {
          bg: 'bg-gray-900/50',
          text: 'text-gray-300',
          icon: <DollarSign className="w-5 h-5 text-gray-400" />
        };
      case 'reward':
        return {
          bg: 'bg-[#db2763]/10',
          text: 'text-[#db2763]',
          icon: <Gift className="w-5 h-5 text-[#db2763]" />
        };
      case 'offer_redemption':
        return {
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          icon: <Receipt className="w-5 h-5 text-cyan-400" />
        };
      case 'reward_redemption':
        return {
          bg: 'bg-[#db2763]/10',
          text: 'text-[#db2763]',
          icon: <DollarSign className="w-5 h-5 text-[#db2763]" />
        };
      default:
        return {
          bg: 'bg-gray-900/50',
          text: 'text-gray-300',
          icon: <DollarSign className="w-5 h-5 text-gray-400" />
        };
    }
  };

  const getTransactionDescription = (transaction: any) => {
    switch (transaction.type) {
      case 'payment':
        return 'Subscription Payment';
      case 'reward':
        return 'Reward Credit';
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
      <h3 className="text-lg font-outfit font-semibold text-white mb-4">Transaction History</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {customer.transactions.map((transaction) => {
          const style = getTransactionStyle(transaction);
          return (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-3 rounded-xl ${style.bg}`}
            >
              <div className="flex items-center space-x-3">
                {style.icon}
                <div>
                  <p className={`font-medium ${style.text}`}>
                    {getTransactionDescription(transaction)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {transaction.amount !== 0 && (
                <span className={`font-semibold ${style.text}`}>
                  {transaction.type === 'payment' || transaction.type === 'reward_redemption' ? '-' : '+'}${Math.abs(transaction.amount)}
                </span>
              )}
            </div>
          );
        })}
        {customer.transactions.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};