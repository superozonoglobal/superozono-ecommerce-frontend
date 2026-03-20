"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const STORAGE_KEY = 'superozono_store_config';

export default function Header() {
  const { cartCount } = useCart();
  const [logo, setLogo] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/distribuidor');

  useEffect(() => {
    if (isAdmin) {
      // RESETEAR a tema por defecto en el panel de admin
      document.documentElement.style.setProperty('--primary-color', '#3b82f6');
      document.documentElement.style.setProperty('--accent-color', '#8b5cf6');
      document.documentElement.style.setProperty('--body-bg', '#0f172a');
      document.documentElement.style.setProperty('--body-bg-gradient', 
        'radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%)'
      );
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        
        // Aplicar Branding SOLO si no es Admin
        if (config.primaryColor) document.documentElement.style.setProperty('--primary-color', config.primaryColor);
        if (config.accentColor) document.documentElement.style.setProperty('--accent-color', config.accentColor);
        if (config.backgroundColor) document.documentElement.style.setProperty('--body-bg', config.backgroundColor);
        
        // Gradiente radial reactivo
        if (config.primaryColor && config.accentColor) {
           const gradient = `radial-gradient(circle at 15% 50%, ${config.primaryColor}15, transparent 25%), radial-gradient(circle at 85% 30%, ${config.accentColor}15, transparent 25%)`;
           document.documentElement.style.setProperty('--body-bg-gradient', gradient);
        }

        setLogo(config.logoBase64 || null);
        setShowLogo(config.showLogo !== undefined ? config.showLogo : true);
      } catch (e) {
        console.error("Error cargando branding en Header:", e);
      }
    }
  }, [isAdmin, pathname]);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {logo && showLogo && !isAdmin ? (
            <img src={logo} alt="Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
          ) : (showLogo && '🚀')}
          <span>SuperOzono</span>
        </Link>
        <nav className="main-nav">
          <Link href="/productos" className="nav-link">Productos</Link>
          <Link href="/distribuidor" className="nav-link">Dashboard</Link>
          <Link href="/carrito" className="nav-link">
            Carrito {cartCount > 0 && <span style={{ background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', padding: '2px 8px', marginLeft: '5px', fontSize: '0.8rem' }}>{cartCount}</span>}
          </Link>
          <Link href="/login" className="nav-link login-btn">Iniciar Sesión</Link>
        </nav>
      </div>
    </header>
  );
}
