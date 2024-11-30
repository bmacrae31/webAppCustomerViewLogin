import React from 'react';
import { CreditCard, Receipt, User, Star } from 'lucide-react';
import { DashboardSection } from '../../types';

interface Props {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  isDarkMode: boolean;
}

export const DashboardNav: React.FC<Props> = ({
  activeSection,
  setActiveSection,
  isDarkMode,
}) => {
  const navItems = [
    { id: 'membership', label: 'Membership', icon: Star },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'billing', label: 'Billing History', icon: Receipt },
    { id: 'account', label: 'Account Settings', icon: User },
  ] as const;

  return (
    <nav className={`w-64 h-full border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="py-4 sticky top-0">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
              activeSection === id
                ? isDarkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};