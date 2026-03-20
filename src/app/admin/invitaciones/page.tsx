"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Invitation, UserRole } from '@/types';

export default function InvitacionesPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('distribuidor');
  const [subdomain, setSubdomain] = useState('');
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    setInvites(api.invites.getAll());
  }, []);

  const handleCreateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newInvite: Invitation = {
      id: token,
      email,
      role,
      subdomain,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    api.invites.create(newInvite);
    setInvites([...invites, newInvite]);
    
    const link = `${window.location.origin}/activar-cuenta?token=${token}`;
    setGeneratedLink(link);
    setEmail('');
    setSubdomain('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado al portapapeles');
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 800 }}>Gestión de Invitaciones</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Formulario */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Nueva Invitación</h2>
          <form onSubmit={handleCreateInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>Correo del Invitado</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>Rol Asignado</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
              >
                <option value="distribuidor">Distribuidor (Afiliado)</option>
                <option value="admin">Administrador (Gestión)</option>
              </select>
            </div>

            {role === 'distribuidor' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>Subdominio Tienda</label>
                <input 
                  type="text" 
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="mi-tienda-pro"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                />
              </div>
            )}

            <button type="submit" style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              borderRadius: '8px', 
              background: 'var(--primary-color)', 
              color: '#fff', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}>
              Generar Link de Invitación
            </button>
          </form>

          {generatedLink && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>¡Invitación Generada!</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input readOnly value={generatedLink} style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem' }} />
                <button onClick={() => copyToClipboard(generatedLink)} style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Copiar</button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Invitaciones */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Invitaciones Recientes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {invites.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No hay invitaciones pendientes</p>
            ) : invites.map((inv) => (
              <div key={inv.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{inv.email}</p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{inv.role.toUpperCase()} • {new Date(inv.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => copyToClipboard(`${window.location.origin}/activar-cuenta?token=${inv.id}`)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Re-copiar Link</button>
                  <button onClick={() => { api.invites.remove(inv.id); setInvites(api.invites.getAll()); }} style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '4px', color: '#ef4444', cursor: 'pointer' }}>Revocar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
