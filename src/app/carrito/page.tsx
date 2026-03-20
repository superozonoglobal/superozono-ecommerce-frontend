"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Tu carrito está vacío</h1>
        <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '1.1rem' }}>Parece que aún no has añadido ninguna solución tecnológica a tu pedido.</p>
        <Link href="/productos" style={{ background: 'var(--primary-color)', color: '#fff', padding: '1.2rem 2.5rem', borderRadius: '15px', fontWeight: 'bold', textDecoration: 'none' }}>
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem' }}>Resumen de tu Pedido</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Lista de Items */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🚀
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>SKU: OZ-{(item.id + 100)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>-</button>
                <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ width: '100px', textAlign: 'right' }}>
                <p style={{ fontWeight: 900, fontSize: '1.2rem' }}>${item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} style={{ fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Pago */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem', fontWeight: 700 }}>Total a Pagar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
              <span>Subtotal ({cartCount} prod.)</span>
              <span>${cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
              <span>Envío Logístico</span>
              <span style={{ color: '#4ade80' }}>Gratis</span>
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '10px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 900 }}>
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
          </div>
          <button style={{ 
            width: '100%', 
            padding: '1.2rem', 
            borderRadius: '15px', 
            background: 'var(--primary-color)', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 800, 
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
          }}>
            Finalizar Pedido
          </button>
        </div>

      </div>
    </div>
  );
}
