import React from 'react';
import { History, Settings } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface AppHeaderProps {
  isDarkMode: boolean;
  onShowTransactions: () => void;
  onShowDashboard: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  onShowTransactions,
  onShowDashboard,
}) => {
  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <img 
            src="https://rethinkveterinarysolutions.com/hs-fs/hubfs/Rethink_Veterinary_Solutions_No_RVS-1-1.png?width=175&height=50&name=Rethink_Veterinary_Solutions_No_RVS-1-1.png" 
            alt="ReThink Veterinary Solutions" 
            className="h-8 sm:h-10"
          />
          <div className="flex-1 flex justify-end space-x-4">
            <NotificationBell isDarkMode={isDarkMode} />
            <button
              onClick={onShowTransactions}
              className={`p-2 rounded-xl transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <History className="w-6 h-6" />
            </button>
            <button
              onClick={onShowDashboard}
              className={`p-2 rounded-xl transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};