"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const user = api.users.getCurrentUser();
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
      router.push('/login');
    }
  }, [router]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Invitaciones', path: '/admin/invitaciones', icon: '✉️' },
    { name: 'Usuarios', path: '/admin/usuarios', icon: '👥' },
    { name: 'Configuración', path: '/admin/config', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--body-bg)' }}>
      {/* Sidebar Admin */}
      <aside style={{ 
        width: '260px', 
        background: 'rgba(15, 23, 42, 0.95)', 
        borderRight: '1px solid var(--glass-border)',
        padding: '2rem 1.5rem',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Super Admin</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Panel de Control Root</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? '600' : '400'
              }}>
                <span>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem' }}>
          <button 
            onClick={() => {
              api.users.logout();
              router.push('/login');
            }}
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              borderRadius: '8px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '3rem' }}>
        {children}
      </main>
    </div>
  );
}
