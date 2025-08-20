export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_CONFIG = {
  appName: 'FairShare',
  defaultCurrency: 'USD',
  dateFormat: 'MMM d, yyyy',
  dateTimeFormat: 'MMM d, yyyy h:mm a',
};

export const BILL_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
};

export const BILL_STATUS_OPTIONS = [
  { value: BILL_STATUS.PENDING, label: 'Pending' },
  { value: BILL_STATUS.PAID, label: 'Paid' },
  { value: BILL_STATUS.PARTIALLY_PAID, label: 'Partially Paid' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];
