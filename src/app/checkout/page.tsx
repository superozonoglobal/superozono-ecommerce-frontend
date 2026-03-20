"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [isSuccess, setIsSuccess] = useState(false);

  // Vista Condicional: Éxito
  if (isSuccess) {
    return (
      <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem', animation: 'fadeIn 0.5s ease-out' }}>
        <div className="glass-panel text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🎉</div>
          <h1 style={{ color: 'var(--primary-color)' }}>¡Pedido Confirmado!</h1>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Gracias por elegir Superozono. Tu orden ha sido procesada correctamente y el recibo fue generado.
          </p>
          <Link href="/productos" className="login-btn" style={{ display: 'inline-block', marginTop: '2.5rem' }}>
            Finalizar y volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // Vista Condicional: Carrito Vacío
  if (cart.length === 0) {
    return (
      <div className="page-container">
        <h1 style={{ marginBottom: '2rem' }}>Checkout Seguro</h1>
        <div className="glass-panel text-center">
          <p style={{ color: 'var(--text-muted)' }}>Tus artículos a comprar han expirado o aún no has seleccionado nada.</p>
          <Link href="/productos" className="login-btn" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Regresar al catálogo</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula el POST a la pasarela real que haremos en la semana 4
    setIsSuccess(true);
  };

  const inputStyles = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    color: '#fff',
    marginBottom: '1rem',
    outline: 'none',
    transition: 'var(--transition-smooth)'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: 'var(--text-muted)'
  };

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '2rem' }}>Finalizar Compra</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
        
        {/* COLUMNA IZQUIERDA: Formularios de Registro y Pago */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Seccion 1: Datos de Envío */}
          <div>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>1. Mis Datos y Envío</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyles}>Nombre Completo Titular</label>
                <input type="text" required placeholder="Ej: John Doe" style={inputStyles} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyles}>Correo Electrónico (Para envío de factura)</label>
                <input type="email" required placeholder="correo@ejemplo.com" style={inputStyles} />
              </div>
              <div>
                <label style={labelStyles}>Dirección exacta</label>
                <input type="text" required placeholder="Calle #123, Sector Central..." style={inputStyles} />
              </div>
              <div>
                <label style={labelStyles}>Ciudad / Estado</label>
                <input type="text" required placeholder="Distrito Capital" style={inputStyles} />
              </div>
            </div>
          </div>

          {/* Seccion 2: Métodos de Pago */}
          <div>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>2. Método de Transferencia</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div 
                onClick={() => setPaymentMethod('tarjeta')} 
                style={{ 
                  flex: 1, padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition-smooth)',
                  border: `2px solid ${paymentMethod === 'tarjeta' ? 'var(--primary-color)' : 'var(--glass-border)'}`, 
                  borderRadius: 'var(--border-radius-sm)', 
                  background: paymentMethod === 'tarjeta' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                }}
              >
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>💳 Tarjeta de Crédito Segura</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Procesamiento protegido (Stripe)</p>
              </div>
              
              <div 
                onClick={() => setPaymentMethod('transferencia')} 
                style={{ 
                  flex: 1, padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition-smooth)',
                  border: `2px solid ${paymentMethod === 'transferencia' ? 'var(--primary-color)' : 'var(--glass-border)'}`, 
                  borderRadius: 'var(--border-radius-sm)', 
                  background: paymentMethod === 'transferencia' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                }}
              >
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🏦 Transferencia Directa</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Depósito manual al comercio</p>
              </div>
            </div>

            {/* Inputs Condicionales para "Tarjeta" */}
            {paymentMethod === 'tarjeta' && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', animation: 'fadeIn 0.3s' }}>
                <label style={labelStyles}>Número de Tarjeta</label>
                <input type="text" required placeholder="0000 0000 0000 0000" style={inputStyles} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyles}>Expiración</label>
                    <input type="text" required placeholder="MM/YY" style={{...inputStyles, marginBottom: '0'}} />
                  </div>
                  <div>
                    <label style={labelStyles}>CVC / CVV</label>
                    <input type="text" required placeholder="123" style={{...inputStyles, marginBottom: '0'}} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Información Condicional para "Transferencia" */}
            {paymentMethod === 'transferencia' && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-color)', borderRadius: 'var(--border-radius-sm)', animation: 'fadeIn 0.3s' }}>
                <p style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Datos del Beneficiario para el Depósito:</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>• Banco: Fiduciario Global<br/>• Cuenta: 1290380193892<br/>• Titular: SUPEROZONO LLC</p>
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#fbbf24' }}>* Tendrás 24 horas para enviar el comprobante tras confirmar este pedido.</p>
              </div>
            )}
          </div>
          
          {/* Botón Gigante Pago */}
          <button type="submit" className="login-btn" style={{ fontSize: '1.2rem', padding: '1.25rem', width: '100%', border: 'none', letterSpacing: '1px' }}>
            Confirmar y Pagar Orden ${cartTotal + 10}
          </button>
        </form>

        {/* COLUMNA DERECHA: Resumen de Orden (Ticket Virtual) */}
        <div className="glass-panel" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>3. Tu Orden Actual</h2>
          
          {/* Lista de productos traídos del carrito Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cantidad: {item.quantity} ud.</p>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <span>Subtotal Productos</span>
              <span>${cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <span>Gastos de Transporte</span>
              <span>$10</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary-color)' }}>
              <span>Total a Liquidar</span>
              <span>${cartTotal + 10}</span>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
