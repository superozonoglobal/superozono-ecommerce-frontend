"use client";
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(api.users.getCurrentUser());
  }, []);

  const stats = [
    { title: 'Ganacias Totales', value: '$12,450.00', trend: '+12%', icon: '💰', color: '#10b981' },
    { title: 'Nuevos Afiliados', value: '24', trend: '+5', icon: '🚀', color: '#3b82f6' },
    { title: 'Admins Activos', value: '8', trend: 'Estable', icon: '👤', color: '#8b5cf6' },
    { title: 'Salud del Sistema', value: '99.9%', trend: 'Óptimo', icon: '⚡', color: '#f59e0b' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Hola, {user?.name || 'Administrador'} 👋
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Este es el resumen operativo de Superozono Global.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}`, transition: 'transform 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: stat.trend.includes('+') ? '#4ade80' : '#fff' }}>
                {stat.trend}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.2rem' }}>{stat.title}</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 700 }}>Actividad Reciente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { type: 'invite', user: 'carlos@tienda.com', desc: 'Suscripción de Distribuidor', time: 'hace 2 horas' },
              { type: 'sale', user: 'Admin Norte', desc: 'Comisión generada $45.00', time: 'hace 5 horas' },
              { type: 'auth', user: 'Root Admin', desc: 'Backup de seguridad completado', time: 'hace 1 día' },
            ].map((item, id) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.type === 'invite' ? '#3b82f6' : '#10b981' }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.user}</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{item.desc}</p>
                </div>
                <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Commission Settings (Simulated) */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 700 }}>Configuración Global</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>Comisión Base</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" style={{ flex: 1 }} defaultValue="15" />
                <span style={{ fontWeight: 'bold' }}>15%</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>Mantenimiento Mensual</label>
              <input type="text" defaultValue="$9.99" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            </div>
            <button style={{ padding: '1rem', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Actualizar Políticas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
