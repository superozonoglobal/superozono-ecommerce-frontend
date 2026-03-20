"use client";
import { useEffect } from 'react';

export default function Initializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const usersRaw = localStorage.getItem('superozono_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      const adminExists = users.some((u: any) => u.email === 'admin@superozono.com');
      
      if (!adminExists) {
        const rootUser = {
          id: 'root',
          email: 'admin@superozono.com',
          password: 'admin',
          role: 'super_admin',
          name: 'Root Admin'
        };
        localStorage.setItem('superozono_users', JSON.stringify([...users, rootUser]));
      }
    }
  }, []);

  return null;
}
