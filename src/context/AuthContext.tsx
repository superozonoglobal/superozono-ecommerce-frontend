"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User, UserRole } from '@/types';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
}

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, pass: string) => Promise<UserRole | false>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('superozono_access_token');
    const storedUser = localStorage.getItem('superozono_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch(e) {}
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      if (pathname?.startsWith('/admin') || pathname?.startsWith('/distribuidor')) {
        router.replace('/login');
      }
    } else {
      if (pathname === '/login') {
        const dest = user.rol === 'ROOT_ADMIN' ? '/admin' : '/distribuidor';
        router.replace(dest);
      } else if (user.rol === 'ROOT_ADMIN' && pathname?.startsWith('/distribuidor')) {
        router.replace('/admin');
      } else if (user.rol === 'DISTRIBUTOR' && pathname?.startsWith('/admin')) {
        router.replace('/distribuidor');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, pass: string): Promise<UserRole | false> => {
    try {
      const loginData = await authService.login(email, pass);
      const userObj: Usuario = {
        id: loginData.user.id,
        nombre: loginData.user.firstName + (loginData.user.lastName ? ' ' + loginData.user.lastName : ''),
        email: loginData.user.email,
        rol: loginData.user.role,
      };
      
      localStorage.setItem('superozono_access_token', loginData.token);
      localStorage.setItem('superozono_user', JSON.stringify(userObj));
      setUser(userObj);
      
      return userObj.rol;
    } catch (error: any) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('superozono_access_token');
    localStorage.removeItem('superozono_user');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
