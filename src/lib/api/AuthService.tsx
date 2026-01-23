// src/lib/api/AuthService.tsx
import apiClient from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  userType: 'CANDIDATE' | 'HR_MANAGER' | 'ADMIN';
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    userType: 'ADMIN' | 'HR_MANAGER' | 'CANDIDATE';
    fullName?: string;
    lastLoginAt?: string;
  };
}

export interface ApiResponse {
  message: string;
  data?: any;
}

export const AuthService = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('AuthService: Sending login request...');
      const response = await apiClient.post('/api/auth/login', credentials);
      console.log('AuthService: Login response received:', response.data);
      
      const { accessToken, refreshToken, ...userData } = response.data;
      
      // Debug: Check the structure
      console.log('AuthService: Response structure:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        userData: userData,
        fullResponse: response.data
      });
      
      // Store tokens
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        console.log('AuthService: Token stored');
      } else {
        console.error('AuthService: No access token in response!');
        throw new Error('No access token received');
      }
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('AuthService: Refresh token stored');
      }
      
      // Check user structure
      let userToStore = null;
      if (response.data.user) {
        userToStore = response.data.user;
      } else if (userData) {
        // Check if user data is at the root level
        userToStore = userData;
      }
      
      if (userToStore) {
        localStorage.setItem('user', JSON.stringify(userToStore));
        console.log('AuthService: User stored:', userToStore);
      } else {
        console.warn('AuthService: No user data found in response');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  // Register
  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    try {
      // Create registration data matching backend DTO
      const registerData = {
        username: userData.username || userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword || userData.password,
        userType: userData.userType,
        mobileNumber: userData.mobileNumber,
        firstName: userData.firstName,
        lastName: userData.lastName
      };
      
      console.log('AuthService: Sending registration request...', registerData);
      const response = await apiClient.post('/api/auth/register', registerData);
      console.log('AuthService: Registration successful:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Registration error:', error);
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      console.log('AuthService: Requesting password reset for:', email);
      const response = await apiClient.post(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`);
      console.log('AuthService: Password reset request successful');
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Forgot password error:', error);
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (data: { 
    token: string; 
    password: string; 
    confirmPassword: string 
  }): Promise<ApiResponse> => {
    try {
      console.log('AuthService: Resetting password...');
      const response = await apiClient.post('/api/auth/reset-password', data);
      console.log('AuthService: Password reset successful');
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Reset password error:', error);
      throw error;
    }
  },

  // Verify Email
  verifyEmail: async (data: { 
    email: string; 
    otpCode: string 
  }): Promise<ApiResponse> => {
    try {
      console.log('AuthService: Verifying email...');
      const response = await apiClient.post('/api/auth/verify-email', data);
      console.log('AuthService: Email verification successful');
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Email verification error:', error);
      throw error;
    }
  },

  // Resend Verification
  resendVerification: async (email: string): Promise<ApiResponse> => {
    try {
      console.log('AuthService: Resending verification email to:', email);
      const response = await apiClient.post(`/api/auth/resend-verification?email=${encodeURIComponent(email)}`);
      console.log('AuthService: Verification email resent');
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Resend verification error:', error);
      throw error;
    }
  },

  // Get Current User
  getCurrentUser: async (): Promise<any> => {
    try {
      console.log('AuthService: Getting current user...');
      const response = await apiClient.get('/api/auth/me');
      console.log('AuthService: Current user data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Get current user error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      console.log('AuthService: Logging out...');
      const token = localStorage.getItem('token');
      if (token) {
        await apiClient.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('AuthService: Backend logout successful');
      }
    } catch (error) {
      console.error('AuthService: Logout error (ignoring):', error);
      // Even if backend logout fails, we still clear local storage
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('AuthService: Local storage cleared');
    }
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<{ 
    accessToken: string; 
    refreshToken: string 
  }> => {
    try {
      console.log('AuthService: Refreshing token...');
      const response = await apiClient.post('/api/auth/refresh', { refreshToken });
      console.log('AuthService: Token refresh successful');
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Refresh token error:', error);
      // If refresh fails, clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  }
};