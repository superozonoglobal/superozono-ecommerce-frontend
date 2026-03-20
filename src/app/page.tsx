"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useCart, CartItem } from '@/context/CartContext';

const STORAGE_KEY = 'superozono_store_config';

// Data base de productos (fallback)
const defaultProducts = [
  { id: 1, name: 'Generador Pro 3000', price: 299, desc: 'Generador de ozono industrial de alta eficiencia para purificar espacios de hasta 100m2 sin descanso.', icon: '⚡' },
  { id: 2, name: 'Purificador Home XL', price: 149, desc: 'Sistema doméstico silencioso y discreto para mantener purificado el aire y librar el hogar 24/7.', icon: '🌬️' },
  { id: 3, name: 'Aqua Pure Sistema Médico', price: 499, desc: 'Avanzada integración ozonizada para la purificación instantánea del agua de consumo, tecnología alemana.', icon: '💧' },
  { id: 4, name: 'Mini Portátil Car', price: 89, desc: 'El dispositivo ligero y portátil ideal para eliminar virus, hongos y malos olores en el auto en minutos.', icon: '🚙' },
];

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        
        // Filtrar y actualizar productos
        if (config.products) {
          const activeProducts = config.products
            .filter((p: any) => p.active)
            .map((p: any) => ({
              ...defaultProducts.find(dp => dp.id === p.id),
              price: p.price,
              stock: p.stockShowroom
            }))
            .filter((p: any) => p.id !== undefined);
            
          setProducts(activeProducts);
        }
      } catch (e) {
        console.error("Error cargando configuración en cliente:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleAddToCart = (p: any) => {
    const item: CartItem = { id: p.id, name: p.name!, price: p.price, quantity: 1 };
    addToCart(item);
    alert(`¡${p.name} se ha añadido al carrito!`);
  };

  if (loading) return <div className="page-container">Cargando tienda...</div>;

  return (
    <div className="page-container">
      {/* Sección Hero */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>La evolución de la pureza</h1>
        <p className={styles.heroSubtitle}>
          Descubre en Superozono la tecnología líder en purificación inteligente. 
          Equipos de última generación para hogares, clínicas y vehículos.
        </p>
      </section>

      {/* Cuadrícula de Productos */}
      <section className={styles.productsGrid}>
        {products.length > 0 ? products.map((p) => (
          <div key={p.id} className={styles.productCard}>
            <div className={styles.productImage}>
              {p.icon}
            </div>
            <div className={styles.productInfo}>
              <h2 className={styles.productName}>{p.name}</h2>
              <p className={styles.productDescription}>{p.desc}</p>
              <div className={styles.productFooter}>
                <span className={styles.productPrice}>${p.price}</span>
                <button className={styles.addToCartBtn} onClick={() => handleAddToCart(p)}>+ Carrito</button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
             No hay productos disponibles en este momento.
          </div>
        )}
      </section>
    </div>
  );
}
