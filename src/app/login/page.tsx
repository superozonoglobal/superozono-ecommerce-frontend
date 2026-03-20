"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Búsqueda de usuario (Simulada)
    const user = api.users.getByEmail(email);

    if (user && user.password === password) {
      // Guardar sesión (Simulada)
      localStorage.setItem('superozono_current_user', JSON.stringify(user));
      
      // Redirección por Rol
      if (user.role === 'super_admin' || user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'distribuidor') {
        router.push('/distribuidor');
      }
    } else {
      setError('Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '3.5rem', maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Bienvenido
          </h1>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Ingresa a tu panel de Superozono</p>
        </div>

        {error && (
          <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.8 }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nombre@empresa.com"
              style={{ width: '100%', padding: '1.1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.8 }}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '1.1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem' }}
            />
          </div>

          <button type="submit" style={{ 
            marginTop: '1rem',
            padding: '1.2rem', 
            borderRadius: '10px', 
            background: 'var(--primary-color)', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s, background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Iniciar Sesión
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.5 }}>
          ¿No tienes una cuenta? <br /> Contacta a tu administrador para recibir una invitación.
        </div>
      </div>
    </div>
  );
}
