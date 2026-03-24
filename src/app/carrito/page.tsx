"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalCost } = useCart();
  
  const subtotal = getTotalCost();
  const tax = subtotal * 0.08;
  const shipping = items.length > 0 ? 12.50 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12 pb-32">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-headline text-5xl font-black tracking-tighter text-on-surface mb-2">Tu Carrito.</h1>
        <p className="text-on-surface-variant font-black uppercase tracking-widest text-[10px] opacity-40">Tienes {items.length} producto(s) en tu sesión actual</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Product List Area */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-outline-variant/5 overflow-hidden"
          >
            <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-outline-variant/10 mb-8 text-on-surface-variant text-[10px] font-black uppercase tracking-widest opacity-40">
              <div className="col-span-6">Especificaciones</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Unitario</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">shopping_cart_off</span>
                  <p className="text-on-surface-variant font-bold text-lg">Tu carrito está esperando ser llenado.</p>
                  <Link href="/" className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-on-surface transition-all">Explorar Productos</Link>
                </motion.div>
              ) : (
                items.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: idx * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low/30 transition-all rounded-[2rem] px-4 -mx-4 group"
                  >
                    <div className="col-span-12 md:col-span-6 flex gap-6 items-center">
                      <div className="w-24 h-24 bg-surface-container-low rounded-2xl overflow-hidden flex-shrink-0 border border-outline-variant/10 shadow-inner group-hover:scale-105 transition-transform">
                        <img className="w-full h-full object-cover" alt={item.name} src={item.imageUrl} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-headline font-black text-lg text-on-surface leading-tight uppercase tracking-tight truncate">{item.name}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{item.category}</p>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="mt-4 text-[10px] font-black text-tertiary flex items-center gap-2 hover:bg-tertiary/10 px-3 py-1.5 rounded-full transition-all uppercase tracking-tighter"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span> Eliminar
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-6 md:col-span-2 flex justify-center">
                      <div className="flex items-center bg-surface-container-low rounded-2xl p-1 border border-outline-variant/10">
                        <button 
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all active:scale-90"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-4 font-black text-sm tabular-nums">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all active:scale-90"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className="text-xs font-black text-on-surface-variant/40 tracking-tighter">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className="font-headline font-black text-xl text-primary tracking-tighter">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="flex items-center justify-between mt-8">
            <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all group">
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Summary Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 sticky top-28"
        >
          <div className="bg-on-surface rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <h2 className="font-headline font-black text-3xl mb-10 tracking-tighter relative z-10">Total de Orden.</h2>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest">Subtotal Bruto</span>
                <span className="font-black text-sm">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest">Embalaje y Envío</span>
                <span className="font-black text-sm">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  Aranceles (IVA) 
                  <span className="material-symbols-outlined text-[12px]">contact_support</span>
                </span>
                <span className="font-black text-sm">${tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 mt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total Consolidado</span>
                  <span className="text-5xl font-black font-headline tracking-tighter text-primary-fixed">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4 pt-10">
                <Link 
                  href="/checkout" 
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${items.length > 0 ? 'bg-primary text-on-primary hover:bg-white hover:text-on-surface hover:scale-105 shadow-primary/30' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                >
                  Finalizar Pedido
                  <span className="material-symbols-outlined text-[16px]">credit_score</span>
                </Link>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                   <p className="text-center text-[9px] font-black uppercase tracking-wider opacity-40 leading-relaxed">
                     Sistemas de pago biométricos y encriptación de grado militar activos.
                   </p>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
              <label className="block text-[9px] font-black text-white/40 mb-4 uppercase tracking-widest">Código de Proximidad</label>
              <div className="flex gap-2">
                <input type="text" placeholder="CÓDIGO" className="flex-grow bg-white/5 border-none rounded-xl px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all placeholder:text-white/10" />
                <button className="bg-white/10 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">OK</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
