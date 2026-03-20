"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CarritoPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '2rem' }}>Carrito de Compras</h1>
      
      {cart.length === 0 ? (
        <div className="glass-panel text-center">
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Tu carrito está vacío.</p>
          <Link href="/" className="login-btn" style={{ display: 'inline-block' }}>
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map((item) => (
              <div key={item.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Precio unitario: ${item.price}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', width: '35px', height: '35px', borderRadius: '4px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--glass-border)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', width: '35px', height: '35px', borderRadius: '4px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--glass-border)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    +
                  </button>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}
                    title="Eliminar producto"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Resumen</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <span>Envío (Estimado)</span>
              <span>$10</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.3rem', fontWeight: 'bold', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <span>Total a pagar</span>
              <span style={{ color: 'var(--primary-color)' }}>${cartTotal + 10}</span>
            </div>
            
            <Link href="/checkout" className="login-btn" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
              Ir al Checkout seguro
            </Link>
          </div>
          
        </div>
      )}
    </div>
  );
}
