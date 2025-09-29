import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithRole: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<boolean>;
  isAuthenticated: boolean;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const response = await authAPI.getProfile(storedToken);
          if (response.success && response.data) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            removeAuthToken();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          removeAuthToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.tokens.accessToken);
        setAuthToken(response.data.tokens.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithRole = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await authAPI.loginWithRole({ email, password, role });
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.tokens.accessToken);
        setAuthToken(response.data.tokens.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Role login error:', error);
      return false;
    }
  };

  const register = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authAPI.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.tokens.accessToken);
        setAuthToken(response.data.tokens.accessToken);
        return { success: true };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    if (token) {
      authAPI.logout(token).catch(console.error);
    }
    setUser(null);
    setToken(null);
    removeAuthToken();
    // Force a full page reload to clear all state and redirect to home
    window.location.replace('/');
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await authAPI.updateProfile(token, profileData);
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    loginWithRole,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};