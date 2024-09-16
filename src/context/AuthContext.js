import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from './../service/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userInfo = await authService.refreshToken();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to refresh token:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const userInfo = await authService.signin(username, password);
    setUser(userInfo);
    return userInfo;
  };

  const oauth2_signup = async (userData) => {
    const userInfo = await authService.oauth_signup(userData);
    setUser(userInfo);
    return userInfo;
  }

  const logout = async () => {
    await authService.signout();
    setUser(null);
  };

  const value = {
    user,
    login,
    oauth2_signup,
    logout,
    loading,
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};