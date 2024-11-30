export type DashboardSection = 'membership' | 'payment' | 'billing' | 'account';

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface BillingRecord {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  invoice_url?: string;
}

export interface AccountSettings {
  email: string;
  name: string;
  phone?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  autoRenew: boolean;
}