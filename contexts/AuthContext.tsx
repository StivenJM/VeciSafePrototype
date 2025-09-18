import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  uid: string;
  phoneNumber?: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate Firebase Auth initialization
  useEffect(() => {
    // Check for existing user session
    const checkAuthState = () => {
      // Simulate checking for stored auth token
      const storedUser = SecureStore.getItem('vecisafe_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Create anonymous user for demo purposes
        const anonymousUser: User = {
          uid: `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          isAnonymous: true,
        };
        setUser(anonymousUser);
        if (typeof SecureStore !== 'undefined') {
          SecureStore.setItem('vecisafe_user', JSON.stringify(anonymousUser));
        }
      }
      setLoading(false);
    };

    checkAuthState();
  }, []);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    setLoading(true);
    try {
      // Simulate Firebase Auth phone verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would send SMS and return verification ID
      console.log('SMS sent to:', phoneNumber);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    setLoading(true);
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === '123456') { // Demo verification code
        const verifiedUser: User = {
          uid: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          phoneNumber: '+1234567890', // Demo phone number
          isAnonymous: false,
        };
        
        setUser(verifiedUser);
        if (typeof SecureStore !== 'undefined') {
          SecureStore.setItem('vecisafe_user', JSON.stringify(verifiedUser));
        }
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate sign out
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new anonymous user
      const anonymousUser: User = {
        uid: `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        isAnonymous: true,
      };
      
      setUser(anonymousUser);
      if (typeof SecureStore !== 'undefined') {
        SecureStore.setItem('vecisafe_user', JSON.stringify(anonymousUser));
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithPhoneNumber,
    verifyCode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}