// src/lib/api/UserService.ts
import apiClient from './apiClient';
import { User, CreateUserRequest, UpdateUserRequest } from '../../types';

export const UserService = {
  // Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/api/admin/users/${id}`);
    return response.data;
  },

  // Create new user (Admin only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/api/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/users/${id}`);
  },

  // Update user status (Active/Inactive)
  updateUserStatus: async (id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<User> => {
    const response = await apiClient.patch(`/api/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Get user statistics (Admin dashboard)
  getUserStats: async () => {
    const response = await apiClient.get('/api/admin/users/stats');
    return response.data;
  },

  // Search users with filters
  searchUsers: async (filters: {
    userType?: string;
    status?: string;
    searchTerm?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await apiClient.get('/api/admin/users/search', { params: filters });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (userId: number): Promise<void> => {
    await apiClient.post(`/api/admin/users/${userId}/resend-verification`);
  },

  // Send password reset
  sendPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/api/auth/reset-password', { token, newPassword });
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/api/auth/verify-email', { token });
  },

  // Send OTP for mobile verification
  sendMobileOTP: async (mobileNumber: string): Promise<void> => {
    await apiClient.post('/api/auth/send-mobile-otp', { mobileNumber });
  },

  // Verify mobile with OTP
  verifyMobile: async (mobileNumber: string, otp: string): Promise<void> => {
    await apiClient.post('/api/auth/verify-mobile-otp', { mobileNumber, otp });
  }
};