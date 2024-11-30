import React, { useState, useEffect } from 'react';
import { CustomerCard } from './CustomerCard';
import { TransactionHistory } from './TransactionHistory';
import { OffersList } from './OffersList';
import { RewardRedemption } from './RewardRedemption';
import { PaymentCard } from './PaymentCard';
import { TransactionModal } from './TransactionModal';
import { MembershipDashboard } from './dashboard/MembershipDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';
import { AppHeader } from './AppHeader';

export const AppContent: React.FC = () => {
  const [showTransactions, setShowTransactions] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { notification, closeNotification } = useCustomer();

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      setIsDarkMode(currentHour >= 17 || currentHour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <AppHeader 
          isDarkMode={isDarkMode}
          onShowTransactions={() => setShowTransactions(true)}
          onShowDashboard={() => setShowDashboard(true)}
        />

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <CustomerCard isDarkMode={isDarkMode} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <RewardRedemption isDarkMode={isDarkMode} />
              <PaymentCard isDarkMode={isDarkMode} />
            </div>
            <div className="lg:sticky lg:top-28 h-fit">
              <OffersList isDarkMode={isDarkMode} />
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showTransactions && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTransactions(false)}
                className="fixed inset-0 bg-black/5 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={`fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-50 overflow-hidden ${
                  isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <TransactionHistory onClose={() => setShowTransactions(false)} isDarkMode={isDarkMode} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <MembershipDashboard
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
          isDarkMode={isDarkMode}
        />

        <AnimatePresence>
          {notification.isOpen && (
            <TransactionModal
              {...notification}
              onClose={closeNotification}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};