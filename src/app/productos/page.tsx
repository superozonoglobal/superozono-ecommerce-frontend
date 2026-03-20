"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductosPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Intentar cargar productos personalizados del distribuidor (si hay config)
    const config = api.store.getConfig();
    const defaultProducts: Product[] = [
      { id: 1, name: 'Generador de Ozono Pro v1', price: 299, desc: 'Sistema avanzado de desinfección para espacios industriales.', icon: '⚡', active: true },
      { id: 2, name: 'Purificador SuperOzono Air', price: 159, desc: 'Ideal para hogares y oficinas con flujo constante de personas.', icon: '🌬️', active: true },
      { id: 3, name: 'Eco-Ozonizer Water', price: 89, desc: 'Transforma agua común en potente desinfectante orgánico.', icon: '💧', active: true },
      { id: 4, name: 'Kit Industrial Heavy Duty', price: 1200, desc: 'Para plantas de procesamiento y grandes superficies.', icon: '🏭', active: true },
    ];

    if (config?.products && config.products.length > 0) {
      setProducts(config.products.filter(p => p.active));
    } else {
      setProducts(defaultProducts);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>Cargando catálogo...</div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Tecnología de Ozono Premium
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.6, fontSize: '1.2rem' }}>
          Explora nuestra selección de dispositivos de desinfección de alta gama, diseñados para la máxima eficiencia y sostenibilidad.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
        {products.map((product) => (
          <div key={product.id} className="glass-panel product-card" style={{ 
            padding: '2.5rem', 
            borderRadius: '24px', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {/* Decoración Background */}
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              fontSize: '8rem', 
              opacity: 0.05, 
              pointerEvents: 'none',
              transform: 'rotate(-15deg)'
            }}>
              {product.icon}
            </div>

            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{product.icon}</div>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.8rem' }}>{product.name}</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>{product.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                ${product.price}
              </span>
              <button 
                onClick={() => {
                  addToCart({ ...product, quantity: 1 });
                  alert(`¡${product.name} añadido al carrito!`);
                }}
                style={{ 
                  padding: '1rem 1.5rem', 
                  borderRadius: '14px', 
                  background: 'var(--primary-color)', 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'background 0.3s'
                }}
                className="add-to-cart-btn"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Estilos locales para animaciones */}
      <style jsx>{`
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border-color: var(--primary-color);
        }
        .add-to-cart-btn:hover {
          background: var(--accent-color);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
