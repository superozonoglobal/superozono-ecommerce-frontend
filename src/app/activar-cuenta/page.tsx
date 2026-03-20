"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Invitation, User } from '@/types';

function ActivarCuentaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      const inv = api.invites.getById(token);
      if (inv && inv.status === 'pending') {
        setInvitation(inv);
      } else {
        setError('Invitación inválida o expirada.');
      }
    } else {
      setError('Token no proporcionado.');
    }
    setLoading(false);
  }, [token]);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!invitation) return;

    // Crear usuario
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email: invitation.email,
      password: password,
      role: invitation.role,
      subdomain: invitation.subdomain,
      name: invitation.email.split('@')[0]
    };

    api.users.create(newUser);
    api.invites.remove(invitation.id);

    alert('¡Cuenta activada con éxito! Ahora puedes iniciar sesión.');
    router.push('/login');
  };

  if (loading) return <div className="page-container">Verificando invitación...</div>;

  if (error) return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '400px', margin: '0 auto' }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Error</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/')} style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'var(--primary-color)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Volver al Inicio</button>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '450px', width: '100%' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 800 }}>Activar tu Cuenta</h1>
        <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>Hola <strong>{invitation?.email}</strong>, establece tu contraseña para comenzar.</p>

        <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>Nueva Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Detalles de la cuenta:</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Rol: {invitation?.role.toUpperCase()}</p>
            {invitation?.subdomain && <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Subdominio: {invitation.subdomain}.superozono.com</p>}
          </div>

          <button type="submit" style={{ 
            marginTop: '1rem',
            padding: '1.1rem', 
            borderRadius: '8px', 
            background: 'var(--primary-color)', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}>
            Activar Mi Cuenta y Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ActivarCuentaPage() {
  return (
    <Suspense fallback={<div className="page-container">Cargando...</div>}>
      <ActivarCuentaContent />
    </Suspense>
  );
}
