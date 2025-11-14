import { PRODUCE_EXPIRATION } from '../constants/produceExpiration';

export const getExpirationDate = (itemName) => {
  const name = itemName.toLowerCase();
  for (const [produce, days] of Object.entries(PRODUCE_EXPIRATION)) {
    if (name.includes(produce)) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);
      return expDate;
    }
  }
  return null;
};

export const getDaysUntilExpiration = (expDate) => {
  if (!expDate) return null;
  const now = new Date();
  const exp = new Date(expDate);
  const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  return days;
};

export const getExpirationStatus = (expDate) => {
  const days = getDaysUntilExpiration(expDate);
  if (!days) return 'none';
  if (days < 0) return 'expired';
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'good';
};