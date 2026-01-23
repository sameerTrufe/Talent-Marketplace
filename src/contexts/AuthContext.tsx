import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthService } from '../lib/api/AuthService';

interface User {
  id: number;
  username: string;
  email: string;
  userType: 'ADMIN' | 'HR_MANAGER' | 'CANDIDATE';
  status: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  lastLoginAt?: string;
  fullName?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: () => Promise<string | null>;
  setUser: (user: User) => void;
  restoreSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear all auth data
  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
  }, []);

  // Restore session from localStorage
  const restoreSession = useCallback(async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session restoration failed:', error);
      clearLocalStorage();
      return false;
    }
  }, [clearLocalStorage]);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          await restoreSession();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [restoreSession]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      
      // Store tokens
      if (response.token || response.accessToken) {
        const token = response.token || response.accessToken;
        setToken(token);
        localStorage.setItem('token', token);
      }
      
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Store user
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      clearLocalStorage();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      await AuthService.register(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Updated logout function without useNavigate
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearLocalStorage();
      setLoading(false);
      // Don't navigate here - let the component handle navigation
      // Return a flag so components know logout was successful
      return true;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await AuthService.refreshToken(refreshToken);
      
      if (response.accessToken) {
        setToken(response.accessToken);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearLocalStorage();
      throw error;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        token,
        refreshToken,
        setUser: updateUser,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};