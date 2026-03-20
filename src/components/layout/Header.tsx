"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { User } from '@/types';

const STORAGE_KEY = 'superozono_store_config';

export default function Header() {
  const { cartCount } = useCart();
  const [logo, setLogo] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPath = pathname?.startsWith('/admin') || pathname?.startsWith('/distribuidor');

  useEffect(() => {
    // 1. Cargar Usuario
    setCurrentUser(api.users.getCurrentUser());

    // 2. Cargar Branding (Si no es admin)
    if (isAdminPath) {
      document.documentElement.style.setProperty('--primary-color', '#3b82f6');
      document.documentElement.style.setProperty('--accent-color', '#8b5cf6');
      document.documentElement.style.setProperty('--body-bg', '#0f172a');
      document.documentElement.style.setProperty('--body-bg-gradient', 
        'radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%)'
      );
    } else {
      const config = api.store.getConfig();
      if (config) {
        if (config.primaryColor) document.documentElement.style.setProperty('--primary-color', config.primaryColor);
        if (config.accentColor) document.documentElement.style.setProperty('--accent-color', config.accentColor);
        if (config.backgroundColor) document.documentElement.style.setProperty('--body-bg', config.backgroundColor);
        
        if (config.primaryColor && config.accentColor) {
           const gradient = `radial-gradient(circle at 15% 50%, ${config.primaryColor}15, transparent 25%), radial-gradient(circle at 85% 30%, ${config.accentColor}15, transparent 25%)`;
           document.documentElement.style.setProperty('--body-bg-gradient', gradient);
        }
        setLogo(config.logoBase64 || null);
        setShowLogo(config.showLogo !== undefined ? config.showLogo : true);
      }
    }
  }, [isAdminPath, pathname]);

  const handleLogout = () => {
    api.users.logout();
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {logo && showLogo && !isAdminPath ? (
            <img src={logo} alt="Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
          ) : (showLogo && '🚀')}
          <span>SuperOzono</span>
        </Link>
        <nav className="main-nav">
          <Link href="/productos" className="nav-link">Productos</Link>
          
          {currentUser ? (
            <>
              {currentUser.role === 'super_admin' || currentUser.role === 'admin' ? (
                <Link href="/admin" className="nav-link">Admin</Link>
              ) : (
                <Link href="/distribuidor" className="nav-link">Dashboard</Link>
              )}
              <Link href="/carrito" className="nav-link">
                Carrito {cartCount > 0 && <span style={{ background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', padding: '2px 8px', marginLeft: '5px', fontSize: '0.8rem' }}>{cartCount}</span>}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Hola, {currentUser.name}</span>
                <button onClick={handleLogout} className="nav-link logout-btn-text" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}>Salir</button>
              </div>
            </>
          ) : (
            <Link href="/login" className="nav-link login-btn">Iniciar Sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
