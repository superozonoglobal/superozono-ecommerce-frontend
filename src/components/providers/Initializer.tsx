"use client";
import { useEffect } from 'react';

export default function Initializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const usersRaw = localStorage.getItem('superozono_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      const adminExists = users.some((u: any) => u.email === 'root@superozono.com');
      
      if (!adminExists) {
        const rootUser = {
          id: 'root-prod',
          email: 'root@superozono.com',
          password: 'SuperOzono2026!',
          role: 'ROOT_ADMIN',
          name: 'Super Admin'
        };
        localStorage.setItem('superozono_users', JSON.stringify([...users, rootUser]));
      }
    }
  }, []);

  return null;
}
