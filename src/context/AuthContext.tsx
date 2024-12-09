import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db, User } from '../db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedExpiry = localStorage.getItem('sessionExpiry');
      
      if (storedUser && storedExpiry) {
        const expiry = new Date(storedExpiry);
        if (expiry > new Date()) {
          const user = JSON.parse(storedUser);
          setUser(user);
        } else {
          // Session expired
          localStorage.removeItem('user');
          localStorage.removeItem('sessionExpiry');
        }
      }
    };

    checkAuth();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const existingUser = await db.users.where('email').equals(email).first();
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user: User = {
        email,
        password,
        name,
        createdAt: new Date()
      };

      await db.users.add(user);
      toast.success('Account created successfully');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const user = await db.users.where('email').equals(email).first();
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      setUser(user);
      
      // Set session expiry - 24 hours if remember me is checked, 2 hours if not
      const expiryTime = new Date(Date.now() + (rememberMe ? 24 : 2) * 60 * 60 * 1000);
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('sessionExpiry', expiryTime.toISOString());
      
      navigate('/');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}