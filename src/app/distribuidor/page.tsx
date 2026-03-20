"use client";

import React, { useState, useEffect } from 'react';

// Tipado para productos
interface Product {
  id: number;
  name: string;
  price: number;
  stockReal: number;
  stockShowroom: number;
  icon: string;
  active: boolean;
}

const STORAGE_KEY = 'superozono_store_config';

export default function DistribuidorDashboardPage() {
  const [activeTab, setActiveTab] = useState('analiticas');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [storeName, setStoreName] = useState('Distribuidora Sanitaria S.A.');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Productos simulados del backend
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Generador Pro 3000', price: 299, stockReal: 100, stockShowroom: 12, icon: '⚡', active: true },
    { id: 2, name: 'Purificador Home XL', price: 149, stockReal: 50, stockShowroom: 4, icon: '🌬️', active: true },
    { id: 3, name: 'Aqua Pure Sistema Médico', price: 499, stockReal: 20, stockShowroom: 2, icon: '💧', active: true },
    { id: 4, name: 'Mini Portátil Car', price: 89, stockReal: 200, stockShowroom: 25, icon: '🚙', active: true },
    { id: 5, name: 'Filtro Carbón Activo', price: 35, stockReal: 500, stockShowroom: 0, icon: '⚫', active: false },
  ]);

  // 1. CARGAR datos de LocalStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setPrimaryColor(config.primaryColor || '#3b82f6');
        setAccentColor(config.accentColor || '#8b5cf6');
        setBackgroundColor(config.backgroundColor || '#0f172a');
        setLogoBase64(config.logoBase64 || null);
        setShowLogo(config.showLogo !== undefined ? config.showLogo : true);
        setStoreName(config.storeName || 'Distribuidora Sanitaria S.A.');
        if (config.products) setProducts(config.products);
      } catch (e) {
        console.error("Error cargando configuración:", e);
      }
    }
  }, []);

  // 2. GUARDAR datos automáticamente en LocalStorage (SIN afectar al DOM del panel)
  useEffect(() => {
    const config = { primaryColor, accentColor, backgroundColor, logoBase64, showLogo, storeName, products };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // No aplicamos document.documentElement.style.setProperty aquí para no "ensuciar" el panel de admin
  }, [primaryColor, accentColor, backgroundColor, logoBase64, showLogo, storeName, products]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo es muy pesado (máx 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyStoreLink = () => {
    const link = `https://superozono.com/tienda/${storeName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    alert('¡Enlace de tienda copiado al portapapeles!');
  };

  const handleStockChange = (id: number, val: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stockShowroom: val } : p));
  };

  const toggleProduct = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="page-container dashboard-layout" style={{ maxWidth: '1400px' }}>
      
      {/* MODAL DE PREVISUALIZACIÓN FULL-SCREEN */}
      {showPreviewModal && (
        <div style={fullScreenOverlayStyle}>
          <div style={{ position: 'absolute', top: '20px', right: '40px', zIndex: 1100, display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}>MODO PREVISUALIZACIÓN</span>
            <button onClick={() => setShowPreviewModal(false)} style={exitPreviewButtonStyle}>Salir de Previa</button>
          </div>
          <div style={{ width: '100%', height: '100%', background: '#fff' }}>
             <iframe src="/" style={{ width: '100%', height: '100%', border: 'none' }} title="Preview"></iframe>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Panel de Control - Administrador de Tienda</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowPreviewModal(true)} 
            style={{ background: 'var(--accent-color)', border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            👁️ Ver Previa Full-Screen
          </button>
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>URL Pública:</span>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
              /tienda/{storeName.toLowerCase().replace(/\s+/g, '-')}
            </code>
            <button onClick={copyStoreLink} style={{ background: 'var(--primary-color)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
              Copiar
            </button>
          </div>
        </div>
      </header>
      
      <div style={{ display: 'flex', gap: '2rem', minHeight: '700px' }}>
        
        {/* SIDEBAR */}
        <div className="glass-panel" style={{ width: '280px', height: 'fit-content', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: logoBase64 ? 'transparent' : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              {logoBase64 && showLogo ? <img src={logoBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" /> : (showLogo ? '🚀' : 'S')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{storeName}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Membresía: Premium</p>
            </div>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('analiticas')} style={tabButtonStyle(activeTab === 'analiticas')}>📈 Analíticas</button>
            <button onClick={() => setActiveTab('productos')} style={tabButtonStyle(activeTab === 'productos')}>🏷️ Mi Catálogo</button>
            <button onClick={() => setActiveTab('personalizacion')} style={tabButtonStyle(activeTab === 'personalizacion')}>🎨 Personalización</button>
            <button onClick={() => setActiveTab('pagos')} style={tabButtonStyle(activeTab === 'pagos')}>💳 Métodos de Pago</button>
            <button onClick={() => setActiveTab('perfil')} style={tabButtonStyle(activeTab === 'perfil')}>⚙️ Perfil</button>
          </nav>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
          
          {/* ANALÍTICAS */}
          {activeTab === 'analiticas' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Resumen de Rendimiento</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Ventas del Mes" value="$12,450" change="+15%" icon="💰" />
                <StatCard title="Pedidos Pendientes" value="8" change="-2" icon="📦" />
                <StatCard title="Visitas a Tienda" value="1,240" change="+30%" icon="👥" />
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Ventas Semanales</h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', justifyContent: 'space-around', padding: '10px' }}>
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} style={{ width: '30px', height: `${h}%`, background: `linear-gradient(to top, var(--primary-color), var(--accent-color))`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>${h*10}</span>
                      <span style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{['L','M','Mi','J','V','S','D'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERSONALIZACIÓN */}
          {activeTab === 'personalizacion' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Personalización de Marca Avanzada</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                  
                  {/* LOGO UPLOAD */}
                  <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Identidad (Logo)</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {logoBase64 ? <img src={logoBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" /> : '🖼️'}
                       </div>
                       <div>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} id="logo-input" style={{ display: 'none' }} />
                          <label htmlFor="logo-input" style={{ background: 'var(--primary-color)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-block', marginBottom: '0.5rem' }}>Subir Logo Imagen</label>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mínimo 200x200px. Máximo 2MB.</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <input type="checkbox" checked={showLogo} onChange={() => setShowLogo(!showLogo)} id="logo-toggle" />
                      <label htmlFor="logo-toggle" style={{ cursor: 'pointer' }}>Mostrar Logo en Tienda</label>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Paleta de Colores</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Color Principal</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={colorInputStyle} />
                        <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ ...inputStyle, width: '100px', padding: '0.4rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Color de Acento</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={colorInputStyle} />
                        <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ ...inputStyle, width: '100px', padding: '0.4rem' }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Color de Fondo (Dashboard & Tienda)</label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} style={{ ...colorInputStyle, width: '100px' }} />
                        <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} style={{ ...inputStyle, width: '120px', padding: '0.4rem' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Esto cambiará el tono azul base de toda la interfaz.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: `2px solid ${primaryColor}` }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Vista Rápida</h3>
                  <div style={{ background: backgroundColor, padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                    {/* Simular gradiente radial */}
                    <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '60px', height: '60px', background: primaryColor, opacity: 0.2, filter: 'blur(20px)' }}></div>
                    
                    <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {logoBase64 && showLogo ? <img src={logoBase64} style={{ width: '20px', height: '20px' }} alt="mini-logo" /> : (showLogo ? '🚀' : null)}
                        <span style={{ fontWeight: 'bold', color: primaryColor, fontSize: '0.8rem' }}>SuperOzono</span>
                      </div>
                    </header>
                    <div style={{ height: '40px', background: primaryColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>ESTILO APLICADO</div>
                    <p style={{ fontSize: '0.7rem', marginTop: '1rem', color: 'var(--text-muted)' }}>Toda la tonalidad visual se ha sincronizado.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATÁLOGO / INVENTARIO */}
          {activeTab === 'productos' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Gestión de Inventario y Visibilidad</h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sincronizado con Almacén Central: <b style={{ color: '#4ade80' }}>OK</b></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {products.map((p) => (
                  <div key={p.id} style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: 'var(--border-radius-sm)', 
                    border: `1px solid ${p.active ? 'var(--glass-border)' : 'rgba(255,255,255,0.05)'}`,
                    opacity: p.active ? 1 : 0.6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                      <button 
                        onClick={() => toggleProduct(p.id)}
                        style={{ 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '12px', 
                          border: 'none', 
                          fontSize: '0.7rem', 
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          background: p.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
                          color: p.active ? '#4ade80' : '#fff'
                        }}
                      >
                        {p.active ? '● Visible' : '○ Oculto'}
                      </button>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{p.name}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>Precio Público:</span> <b>${p.price}</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>Stock Real (Admin):</span> <span>{p.stockReal} Uds</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '4px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--accent-color)' }}>Stock para Clientes:</label>
                        <input 
                           type="number" 
                           value={p.stockShowroom} 
                           onChange={(e) => handleStockChange(p.id, parseInt(e.target.value))}
                           style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '0.3rem' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGOS */}
          {activeTab === 'pagos' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Vías de Recaudación</h2>
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <PaymentMethod name="Transferencia Manual" desc="Bancos nacionales e internacionales." active={true} />
                  <PaymentMethod name="Pasarela OzonoPay" desc="Procesamiento nativo seguro." active={false} />
                </div>
              </div>
            </div>
          )}

          {/* PERFIL */}
          {activeTab === 'perfil' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Configuración Autorizada</h2>
              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '600px', marginTop: '2rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Razón Social / Nombre Comercial</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={inputStyle} />
                </div>
                <button type="button" className="login-btn" style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1rem' }}>Guardar Cambios</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Estilos Modal / Preview
const fullScreenOverlayStyle: React.CSSProperties = {
  position: 'fixed' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  background: '#000',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column' as const,
  animation: 'fadeIn 0.3s ease-out'
};

const exitPreviewButtonStyle: React.CSSProperties = {
  background: '#ef4444',
  border: 'none',
  color: '#fff',
  padding: '0.6rem 1.2rem',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
  transition: 'transform 0.2s'
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
};

const modalContentStyle: React.CSSProperties = {
  width: '95%',
  height: '90%',
  maxWidth: '1200px',
  display: 'flex',
  flexDirection: 'column' as const,
  padding: '1.5rem',
  background: 'var(--bg-dark)',
  border: '1px solid var(--glass-border)'
};

const closeButtonStyle: React.CSSProperties = {
  background: '#ef4444',
  border: 'none',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

// Componentes y Estilos anteriores
function StatCard({ title, value, change, icon }: any) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem' }}>{value}</h3>
        <p style={{ fontSize: '0.75rem', color: change.startsWith('+') ? '#4ade80' : '#f87171', marginTop: '0.3rem' }}>{change}</p>
      </div>
      <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
    </div>
  );
}

function PaymentMethod({ name, desc, active }: any) {
  return (
    <div style={{ padding: '1rem', border: `1px solid ${active ? 'var(--primary-color)' : 'var(--glass-border)'}`, borderRadius: 'var(--border-radius-sm)', background: active ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{name}</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
      </div>
      <button style={{ background: active ? 'var(--primary-color)' : 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
        {active ? 'Configurado' : 'Activar'}
      </button>
    </div>
  );
}

const tabButtonStyle = (isActive: boolean) => ({
  padding: '0.8rem 1rem',
  textAlign: 'left' as const,
  background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
  border: 'none',
  borderRadius: 'var(--border-radius-sm)',
  color: isActive ? '#fff' : 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)',
  fontWeight: isActive ? 'bold' : 'normal'
});

const labelStyle = { display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', color: '#fff', fontSize: '1rem' };
const colorInputStyle = { width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' };

