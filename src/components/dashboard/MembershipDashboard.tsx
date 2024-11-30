import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DashboardNav } from './DashboardNav';
import { MembershipDetails } from './MembershipDetails';
import { PaymentMethods } from './PaymentMethods';
import { BillingHistory } from './BillingHistory';
import { AccountSettings } from './AccountSettings';
import { useDashboard } from '../../hooks/useDashboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const MembershipDashboard: React.FC<Props> = ({ isOpen, onClose, isDarkMode }) => {
  const { activeSection, setActiveSection } = useDashboard();

  const renderContent = () => {
    switch (activeSection) {
      case 'membership':
        return <MembershipDetails isDarkMode={isDarkMode} />;
      case 'payment':
        return <PaymentMethods isDarkMode={isDarkMode} />;
      case 'billing':
        return <BillingHistory isDarkMode={isDarkMode} />;
      case 'account':
        return <AccountSettings isDarkMode={isDarkMode} />;
      default:
        return <MembershipDetails isDarkMode={isDarkMode} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-4xl shadow-2xl z-50 ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            } flex flex-col`}
          >
            {/* Header */}
            <div className={`flex-none p-4 flex items-center justify-between border-b ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-outfit font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Membership Dashboard
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Navigation Sidebar */}
              <div className="flex-none">
                <DashboardNav
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Content Area with Scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-2xl mx-auto">
                  {renderContent()}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};