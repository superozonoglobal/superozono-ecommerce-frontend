"use client";
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(api.users.getAll());
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 800 }}>Gestión de Usuarios</h1>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Auditores y Distribuidores Registrados</h2>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total: {users.length} usuarios</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>Nombre</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Rol</th>
              <th style={{ padding: '1rem' }}>Subdominio / ID</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No hay usuarios registrados</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.name || 'Sin nombre'}</td>
                <td style={{ padding: '1rem', opacity: 0.8 }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.7rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: u.role === 'super_admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: u.role === 'super_admin' ? '#ef4444' : u.role === 'admin' ? '#8b5cf6' : '#3b82f6'
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', opacity: 0.6 }}>{u.subdomain || u.id.substring(0, 8)}</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginRight: '1rem' }}>Editar</button>
                  <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Suspender</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
