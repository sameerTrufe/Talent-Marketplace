// src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'ADMIN' | 'HR_MANAGER' | 'CANDIDATE';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';
  mobileNumber?: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'CANDIDATE' | 'HR_MANAGER';
  firstName: string;
  lastName: string;
  mobileNumber?: string;
  companyId?: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  userType?: 'CANDIDATE' | 'HR_MANAGER';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}