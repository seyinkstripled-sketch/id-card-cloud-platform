import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'OPERATOR', 'VIEWER']).optional().default('OPERATOR'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const staffSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required').toUpperCase(),
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  designation: z.string().min(1, 'Designation / Job Title is required'),
  department: z.string().min(1, 'Department is required'),
  bloodGroup: z.string().optional().or(z.literal('')),
  issueDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  status: z.enum(['ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED']).default('ACTIVE'),
  photoUrl: z.string().optional().or(z.literal('')),
  signatureUrl: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});
