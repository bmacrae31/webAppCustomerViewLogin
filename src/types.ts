export interface Customer {
  name: string;
  subscriptionAmount: number;
  rewardBalance: number;
  isSubscribed: boolean;
  lastPaymentDate: string | null;
  transactions: Transaction[];
  paymentStatus: PaymentStatus;
  offers: Offer[];
}

export interface Transaction {
  id: string;
  type: 'payment' | 'reward' | 'reward_redemption' | 'offer_redemption' | 'failed' | 'bill_payment' | 'cashback';
  amount: number;
  timestamp: string;
  status: 'success' | 'failed';
  offerName?: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  expiresAt: string;
  isRedeemed: boolean;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface CustomerContextType {
  customer: Customer;
  startSubscription: () => void;
  stopSubscription: () => void;
  redeemOffer: (offerId: string) => Promise<void>;
  redeemRewards: (amount: number) => Promise<void>;
  processBillPayment: (amount: number) => Promise<void>;
  notification: {
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    amount?: number;
    timestamp: string;
  };
  closeNotification: () => void;
}

export interface Notification {
  id: string;
  type: 'payment' | 'reward' | 'offer' | 'system' | 'subscription';
  title: string;
  message: string;
  priority: 'high' | 'normal' | 'low';
  isRead: boolean;
  timestamp: string;
  metadata?: {
    amount?: number;
    offerId?: string;
    actionUrl?: string;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  paymentAlerts: boolean;
  rewardAlerts: boolean;
  offerAlerts: boolean;
  systemAlerts: boolean;
}