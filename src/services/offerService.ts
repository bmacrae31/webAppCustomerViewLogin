import { Offer } from '../types';

const OFFERS: Offer[] = [
  {
    id: '1',
    name: 'Free Coffee',
    description: 'Get a free coffee of your choice',
    expiresAt: '', // Will be set dynamically
    isRedeemed: false
  },
  {
    id: '2',
    name: 'Pastry Discount',
    description: '50% off any pastry',
    expiresAt: '',
    isRedeemed: false
  },
  {
    id: '3',
    name: 'Loyalty Bonus',
    description: 'Double points on your next purchase',
    expiresAt: '',
    isRedeemed: false
  }
];

export const generateOffers = (): Offer[] => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 5); // Expires in 5 minutes

  return OFFERS.map(offer => ({
    ...offer,
    id: crypto.randomUUID(),
    expiresAt: expiryDate.toISOString(),
    isRedeemed: false
  }));
};

export const removeExpiredOffers = (offers: Offer[]): Offer[] => {
  const now = new Date();
  return offers.filter(offer => new Date(offer.expiresAt) > now);
};