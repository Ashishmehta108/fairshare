import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const billSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  totalAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.date(),
  category: z.string().optional(),
  friends: z.array(
    z.object({
      friendId: z.string(),
      amount: z.number().min(0.01, 'Amount must be greater than 0'),
      status: z.enum(['pending', 'paid']).default('pending'),
    })
  ).min(1, 'At least one friend must be selected'),
});

export const friendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Helper function to format validation errors for display
export const formatValidationErrors = (error) => {
  if (!error) return {};
  
  return error.inner.reduce((acc, err) => {
    return {
      ...acc,
      [err.path]: err.message,
    };
  }, {});
};

// Helper to parse API errors
export const parseApiError = (error) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.msg).join('\n');
  }
  return error.message || 'An error occurred';
};
