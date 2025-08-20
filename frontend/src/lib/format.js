import { format as dateFnsFormat, parseISO } from 'date-fns';

// Format date to a readable string
export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateFnsFormat(dateObj, format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

// Format currency amount
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format a number to 2 decimal places
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '-';
  return parseFloat(number).toFixed(decimals);
};

// Format a string to title case
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Truncate text with ellipsis
export const truncate = (text, length = 50, ellipsis = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + ellipsis;
};

// Format file size
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Format a duration in seconds to HH:MM:SS
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '--:--';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [
    h > 0 ? h : null,
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].filter(Boolean).join(':');
};

// Format a number with commas as thousand separators
export const numberWithCommas = (x) => {
  if (x === null || x === undefined) return '-';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
