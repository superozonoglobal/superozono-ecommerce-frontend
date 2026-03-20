"use client";

import React, { useState } from 'react';

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState('tiendas');

  return (
    <div className="page-container dashboard-layout" style={{ maxWidth: '1400px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Centro de Mando - SuperAdmin</h1>
      
      <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
        
        {/* SIDEBAR ADMINISTRADOR MÁXIMO */}
        <div className="glass-panel" style={{ width: '280px', height: 'fit-content', padding: '1.5rem 1rem', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              SA
            </div>
            <div>
              <p style={{ fontWeight: 'bold' }}>Root Operador</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mantenimiento Total</p>
            </div>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('tiendas')}
              style={{ padding: '0.8rem 1rem', textAlign: 'left', background: activeTab === 'tiendas' ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: 'none', borderRadius: 'var(--border-radius-sm)', color: '#fff', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            >
              🏢 Red de Sucursales
            </button>
            <button 
              onClick={() => setActiveTab('crear')}
              style={{ padding: '0.8rem 1rem', textAlign: 'left', background: activeTab === 'crear' ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: 'none', borderRadius: 'var(--border-radius-sm)', color: '#fff', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            >
              ➕ Asignar Nueva Sucursal
            </button>
          </nav>
        </div>

        {/* CONTENIDO SUPERADMIN DINÁMICO */}
        <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
          
          {/* TAB 1: Red de Tiendas (Listado General) */}
          {activeTab === 'tiendas' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <h2>Monitor de Distribuidores Activos</h2>
                <div style={{ color: 'var(--text-muted)' }}>Total Licencias: <b style={{color: 'var(--accent-color)' }}>3</b></div>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem' }}>ID Licencia</th>
                    <th style={{ padding: '1rem' }}>Nombre Fiscal Tienda</th>
                    <th style={{ padding: '1rem' }}>Comisión Acordada</th>
                    <th style={{ padding: '1rem' }}>Estado Servidor</th>
                    <th style={{ padding: '1rem' }}>Seguridad</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'STORE-001', name: 'Sanitaria Oro S.A.', comision: '15%', status: 'Activo' },
                    { id: 'STORE-002', name: 'Clínicas Health', comision: '20%', status: 'Activo' },
                    { id: 'STORE-003', name: 'Medellín Supplies', comision: '10%', status: 'Bloqueado' },
                  ].map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{row.id}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{row.name}</td>
                      <td style={{ padding: '1rem' }}>{row.comision}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.4rem 0.8rem', background: row.status === 'Activo' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: row.status === 'Activo' ? '#4ade80' : '#f87171', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'var(--transition-smooth)' }} onMouseOver={e => {e.currentTarget.style.background='var(--accent-color)'; e.currentTarget.style.color='#fff'}}  onMouseOut={e => {e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--accent-color)'}}>Auditar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Creación de Tienda */}
          {activeTab === 'crear' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <h2>Apertura de Nuevo Distribuidor</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Ingresa los pactos comerciales y otorga un enlace de afiliación a un nuevo aliado.</p>
              </div>
              
              <form style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '600px', marginTop: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Franquicia / Nombre Sugerido</label>
                  <input type="text" placeholder="Ej: Red de Farmacias Aliadas" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Correo de Activación del Titular</label>
                  <input type="email" placeholder="representante@farmacias.com" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Tarifa de Ganancia Directa</label>
                  <select defaultValue="15" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', color: '#fff', fontSize: '1rem', cursor: 'pointer', outline: 'none' }}>
                    <option value="10">10% - Vendedor Básico</option>
                    <option value="15">15% - Distribuidor Autorizado</option>
                    <option value="20">20% - Socio Premium</option>
                  </select>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px dashed var(--accent-color)', borderRadius: 'var(--border-radius-sm)', background: 'rgba(139, 92, 246, 0.05)' }}>
                  <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '1.5' }}>💡 Al hacer clic, generaremos una licencia única temporal. El dueño de negocio deberá usar ese Token en la ruta oculta de <b style={{ color: 'var(--accent-color)' }}>Registro por Invitación</b> para heredar su infraestructura.</p>
                </div>

                <button 
                  type="submit" 
                  onClick={(e) => { e.preventDefault(); alert("¡Permisos de Tienda y Enlace de Activación creados exitosamente! Revisa tu correo administrador."); }}
                  style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))', color: '#fff', fontSize: '1.1rem', padding: '1.25rem', width: '100%', border: 'none', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem', WebkitTextFillColor: '#fff' }}
                >
                  🚀 Generar Servidor de Tienda Virtual
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
