import { api } from './config';
import { Customer, Transaction, Offer } from '../../types';

export const customerApi = {
  getProfile: () => 
    api.get<Customer>('/customer/profile'),

  processPayment: (amount: number) =>
    api.post<{ success: boolean }>('/payments', { amount }),

  redeemRewards: (amount: number) =>
    api.post<{ success: boolean }>('/rewards/redeem', { amount }),

  redeemOffer: (offerId: string) =>
    api.post<{ success: boolean }>(`/offers/${offerId}/redeem`),

  getOffers: () =>
    api.get<Offer[]>('/offers'),

  getTransactions: () =>
    api.get<Transaction[]>('/transactions'),
};