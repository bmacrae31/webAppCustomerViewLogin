import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { formatDistanceToNow } from 'date-fns';
import { Gift, Clock, Tag, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Offer } from '../types';

interface Props {
  isDarkMode: boolean;
}

interface ConfirmationDialogProps {
  offer: Offer;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  offer,
  onConfirm,
  onCancel,
  isDarkMode,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-[100]">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative w-full max-w-md mx-4 p-6 rounded-xl shadow-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-yellow-500/10">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Confirm Redemption
          </h3>
        </div>
        <button
          onClick={onCancel}
          className={`p-1 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p className="mb-2">Are you sure you want to redeem this offer?</p>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {offer.name}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {offer.description}
          </p>
        </div>
        <p className="mt-2 text-sm">This action cannot be undone.</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Confirm Redemption
        </button>
      </div>
    </motion.div>
  </div>
);

// Rest of the OffersList component remains the same
export const OffersList: React.FC<Props> = ({ isDarkMode }) => {
  const { customer, redeemOffer } = useCustomer();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  const validOffers = customer.isSubscribed 
    ? (customer.offers || []).filter(offer => new Date(offer.expiresAt) > new Date())
    : [];

  const handleRedemption = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const confirmRedemption = async () => {
    if (selectedOffer) {
      await redeemOffer(selectedOffer.id);
      setSelectedOffer(null);
    }
  };

  return (
    <>
      <div className={`rounded-2xl card-shadow p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-2 mb-6">
          <Tag className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
          <h3 className={`text-lg font-outfit font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Available Offers
          </h3>
        </div>
        
        <div className="space-y-4">
          {!customer.isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Gift className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Start your subscription to unlock offers
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                New offers appear after each payment
              </p>
            </motion.div>
          ) : validOffers.length > 0 ? (
            validOffers.map((offer, index) => {
              const isExpiringSoon = new Date(offer.expiresAt).getTime() - Date.now() < 300000;
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group rounded-xl p-4 transition-all duration-200 ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3">
                      <Gift className={`w-5 h-5 mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {offer.name}
                        </p>
                        <p className={isDarkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>
                          {offer.description}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className={isDarkMode ? 'w-4 h-4 text-gray-400' : 'w-4 h-4 text-gray-500'} />
                          <p className={`text-xs ${
                            isExpiringSoon 
                              ? 'text-yellow-600 font-medium' 
                              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {isExpiringSoon ? 'Expiring soon! ' : ''}
                            Expires {formatDistanceToNow(new Date(offer.expiresAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRedemption(offer)}
                      disabled={offer.isRedeemed}
                      className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        offer.isRedeemed
                          ? isDarkMode 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {offer.isRedeemed ? 'Redeemed' : 'Redeem Now'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Gift className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>No offers available</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                New offers will appear after your next payment
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOffer && (
          <ConfirmationDialog
            offer={selectedOffer}
            onConfirm={confirmRedemption}
            onCancel={() => setSelectedOffer(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </>
  );
};