"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, apiUtils, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  initiateRegistration: (userData: any) => Promise<void>;
  completeRegistration: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await apiService.login(email, password);
      
      // Fetch user data after successful login
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateRegistration = async (userData: any) => {
    try {
      setError(null);
      setIsLoading(true);
      // This is now a client-side only operation
      // The actual user creation will happen in completeRegistration
      console.log('Initiating registration for:', userData.email);
    } catch (err: any) {
      setError(err.message || 'Registration initiation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeRegistration = async (userData: any) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiService.completeRegistration(userData);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setError(null);
      setIsLoading(true);
      if (!user?.user_id) {
        throw new Error('No user ID available');
      }
      const updatedUser = await apiService.updateUser(user.user_id, userData);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Refresh failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    
    // Clear onboarding data on logout
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_data')
      sessionStorage.removeItem('farmer_location')
      sessionStorage.removeItem('user_registration_data')
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiUtils.isAuthenticated()) {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        // Token is invalid, clear it
        apiUtils.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    initiateRegistration,
    completeRegistration,
    updateUser,
    refreshUser,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 