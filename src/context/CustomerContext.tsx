import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Customer, CustomerContextType, Transaction, PaymentStatus } from '../types';
import { format } from 'date-fns';
import { processMockPayment } from '../services/mockPaymentGateway';
import { generateOffers, removeExpiredOffers } from '../services/offerService';
import toast from 'react-hot-toast';

const PAYMENT_INTERVAL = 5 * 60 * 1000;
const SUBSCRIPTION_AMOUNT = 50;
const REWARD_AMOUNT = 60;
const CLEANUP_INTERVAL = 30 * 1000;
const CASHBACK_PERCENTAGE = 0.05;

const initialCustomer: Customer = {
  name: 'Amazing Member',
  subscriptionAmount: SUBSCRIPTION_AMOUNT,
  rewardBalance: 0,
  isSubscribed: false,
  lastPaymentDate: null,
  transactions: [],
  paymentStatus: 'idle',
  offers: []
};

interface TransactionNotification {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  amount?: number;
  timestamp: string;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem('customer');
    return saved ? JSON.parse(saved) : initialCustomer;
  });
  
  const [notification, setNotification] = useState<TransactionNotification>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    timestamp: ''
  });
  
  const paymentIntervalRef = useRef<number>();
  const cleanupIntervalRef = useRef<number>();
  const statusTimeoutRef = useRef<number>();

  useEffect(() => {
    localStorage.setItem('customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    const cleanup = () => {
      if (customer.isSubscribed) {
        setCustomer(prev => ({
          ...prev,
          offers: removeExpiredOffers(prev.offers)
        }));
      }
    };

    cleanup();
    cleanupIntervalRef.current = window.setInterval(cleanup, CLEANUP_INTERVAL);
    
    return () => {
      if (cleanupIntervalRef.current) {
        window.clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [customer.isSubscribed]);

  useEffect(() => {
    if (customer.isSubscribed && !paymentIntervalRef.current) {
      processPayment();
      paymentIntervalRef.current = window.setInterval(processPayment, PAYMENT_INTERVAL);
    }
    
    return () => {
      if (paymentIntervalRef.current) {
        window.clearInterval(paymentIntervalRef.current);
        paymentIntervalRef.current = undefined;
      }
    };
  }, [customer.isSubscribed]);

  const showModal = (
    type: 'success' | 'error',
    title: string,
    message: string,
    amount?: number
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      amount,
      timestamp: format(new Date(), 'PPpp')
    });
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      toast.success(message, { duration: 3000 });
    } else {
      toast.error(message, { duration: 3000 });
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const updatePaymentStatus = (status: PaymentStatus) => {
    setCustomer(prev => ({ ...prev, paymentStatus: status }));
    
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    
    if (status === 'success' || status === 'failed') {
      statusTimeoutRef.current = window.setTimeout(() => {
        setCustomer(prev => ({ ...prev, paymentStatus: 'idle' }));
      }, 3000);
    }
  };

  const processPayment = async () => {
    updatePaymentStatus('processing');

    try {
      await processMockPayment(SUBSCRIPTION_AMOUNT);

      const paymentTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'payment',
        amount: -SUBSCRIPTION_AMOUNT,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      const rewardTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'reward',
        amount: REWARD_AMOUNT,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      const newOffers = generateOffers();
      const currentOffers = removeExpiredOffers(customer.offers);

      setCustomer(prev => ({
        ...prev,
        rewardBalance: prev.rewardBalance + REWARD_AMOUNT,
        lastPaymentDate: format(new Date(), 'PPpp'),
        transactions: [paymentTransaction, rewardTransaction, ...prev.transactions],
        offers: [...newOffers, ...currentOffers]
      }));
      
      updatePaymentStatus('success');
      showToast('success', 'Payment processed successfully!');
    } catch (error) {
      const failedTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'failed',
        amount: -SUBSCRIPTION_AMOUNT,
        timestamp: new Date().toISOString(),
        status: 'failed'
      };

      setCustomer(prev => ({
        ...prev,
        transactions: [failedTransaction, ...prev.transactions]
      }));
      
      updatePaymentStatus('failed');
      showToast('error', 'Payment processing failed');
    }
  };

  const processBillPayment = async (amount: number) => {
    updatePaymentStatus('processing');

    try {
      await processMockPayment(amount);

      const paymentTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'bill_payment',
        amount: -amount,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      const cashbackAmount = amount * CASHBACK_PERCENTAGE;
      const cashbackTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'cashback',
        amount: cashbackAmount,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      setCustomer(prev => ({
        ...prev,
        rewardBalance: prev.rewardBalance + cashbackAmount,
        transactions: [paymentTransaction, cashbackTransaction, ...prev.transactions]
      }));

      updatePaymentStatus('success');
      showModal(
        'success',
        'Bill Payment Successful',
        `Payment processed successfully! You earned $${cashbackAmount.toFixed(2)} in cash back rewards.`,
        amount
      );
    } catch (error) {
      const failedTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'failed',
        amount: -amount,
        timestamp: new Date().toISOString(),
        status: 'failed'
      };

      setCustomer(prev => ({
        ...prev,
        transactions: [failedTransaction, ...prev.transactions]
      }));

      updatePaymentStatus('failed');
      showToast('error', 'Bill payment failed');
    }
  };

  const redeemOffer = async (offerId: string) => {
    if (!customer.isSubscribed) {
      showToast('error', 'Please start a subscription to redeem offers');
      return;
    }

    const offer = customer.offers.find(o => o.id === offerId);
    
    if (!offer || new Date(offer.expiresAt) <= new Date() || offer.isRedeemed) {
      showToast('error', 'This offer is no longer available');
      return;
    }

    setCustomer(prev => ({
      ...prev,
      offers: prev.offers.map(o => 
        o.id === offerId ? { ...o, isRedeemed: true } : o
      ),
      transactions: [
        {
          id: crypto.randomUUID(),
          type: 'offer_redemption',
          amount: 0,
          timestamp: new Date().toISOString(),
          status: 'success',
          offerName: offer.name
        },
        ...prev.transactions
      ]
    }));

    showModal(
      'success',
      'Offer Redeemed',
      `Successfully redeemed: ${offer.name}`
    );
  };

  const redeemRewards = async (amount: number) => {
    if (!customer.isSubscribed) {
      showToast('error', 'Please start a subscription to redeem rewards');
      return;
    }

    if (amount <= 0 || amount > customer.rewardBalance) {
      showToast('error', 'Invalid redemption amount');
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: 'reward_redemption',
      amount: -amount,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    setCustomer(prev => ({
      ...prev,
      rewardBalance: prev.rewardBalance - amount,
      transactions: [transaction, ...prev.transactions]
    }));

    showModal(
      'success',
      'Rewards Redeemed',
      'Successfully redeemed rewards',
      amount
    );
  };

  const startSubscription = () => {
    setCustomer(prev => ({ ...prev, isSubscribed: true }));
  };

  const stopSubscription = () => {
    if (paymentIntervalRef.current) {
      window.clearInterval(paymentIntervalRef.current);
      paymentIntervalRef.current = undefined;
    }
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = undefined;
    }
    setCustomer(prev => ({ 
      ...prev, 
      isSubscribed: false, 
      paymentStatus: 'idle',
      offers: []
    }));
  };

  return (
    <CustomerContext.Provider 
      value={{ 
        customer,
        startSubscription,
        stopSubscription,
        redeemOffer,
        redeemRewards,
        processBillPayment,
        notification,
        closeNotification
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};