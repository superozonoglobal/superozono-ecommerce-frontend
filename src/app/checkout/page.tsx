"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, getTotalCost, clearCart, addToCart } = useCart();
  const router = useRouter();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    alert("¡Pago simulado exitoso! Redirigiendo a la pantalla principal...");
    router.push("/");
  };

  const subtotal = getTotalCost();
  const tax = subtotal * 0.08;
  const shipping = items.length > 0 ? 12.50 : 0;
  const total = subtotal + tax + shipping;

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-10 border-b border-outline-variant/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-headline text-4xl font-black text-on-surface tracking-tighter">Finalizar Compra.</h1>
          <Link href="/carrito" className="text-xs font-black text-primary uppercase tracking-widest hover:underline mt-4 inline-flex items-center gap-2 opacity-60">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Regresar al Carrito
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
           <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
           <span className="text-[10px] font-black text-emerald-700 tracking-widest uppercase">Pago Seguro y Encriptado</span>
        </div>
      </motion.header>

      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden mb-8">
        <button 
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="w-full flex items-center justify-between p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm"
        >
          <div className="flex items-center gap-4">
             <span className="material-symbols-outlined text-primary">shopping_basket</span>
             <span className="font-black text-sm uppercase tracking-tight">{isSummaryExpanded ? 'Ocultar Resumen' : 'Ver Resumen'}</span>
          </div>
          <span className="font-headline font-black text-xl text-primary">${total.toFixed(2)}</span>
        </button>
        
        <AnimatePresence>
          {isSummaryExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-surface-container-lowest rounded-b-[2rem] border-x border-b border-outline-variant/5 shadow-xl"
            >
              <div className="p-6 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-xl border border-outline-variant/10" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{item.name}</p>
                      <p className="text-[10px] opacity-60">Cant: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleCheckout} 
          className="lg:col-span-7 space-y-10"
        >
          {/* Shipping Address */}
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <h2 className="font-headline text-2xl font-black text-on-surface mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              </div>
              Datos de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Nombre Completo</label>
                 <input required className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="Juan Pérez" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Teléfono Móvil</label>
                 <input required type="tel" className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="+57 300 000 0000" />
               </div>
               <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Dirección de Entrega</label>
                 <input required className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="Calle 123 #45-67, Edificio Ozon" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Ciudad / Provincia</label>
                 <input required className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="Bogotá D.C." />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Código Postal</label>
                 <input required className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="110111" />
               </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors"></div>
            <h2 className="font-headline text-2xl font-black text-on-surface mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-xl">credit_card</span>
              </div>
              Método de Pago
            </h2>
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Número de Tarjeta Virtual/Física</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <span className="material-symbols-outlined text-on-surface-variant/40">credit_card</span>
                   </div>
                   <input required className="w-full pl-14 bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="0000 0000 0000 0000" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Expira</label>
                   <input required className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="MM/YY" />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">CVC</label>
                   <input required type="password" maxLength={4} className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl py-4 px-5 text-sm font-medium transition-all" placeholder="***" />
                 </div>
               </div>
            </div>
          </section>

          <button type="submit" className="w-full bg-primary text-on-primary py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:bg-on-surface transition-all flex items-center justify-center gap-3 group">
            Confirmar Pedido Maestro
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">rocket_launch</span>
          </button>
        </motion.form>

        {/* Order Summary - Desktop Only */}
        <aside className="hidden lg:block lg:col-span-5 bg-surface-container-low p-10 rounded-[2.5rem] shadow-inner border border-outline-variant/5 sticky top-24">
          <h2 className="font-headline text-2xl font-black text-on-surface mb-10 tracking-tight">Tu Selección.</h2>
          <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center group">
                <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 border border-outline-variant/10 p-2 shadow-sm group-hover:scale-105 transition-transform">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-on-surface truncate leading-tight uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-black text-on-surface-variant/40 mt-1 uppercase tracking-widest">Cantidad: {item.quantity}</p>
                </div>
                <div className="font-black text-sm tracking-tighter text-on-surface">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="pt-10 border-t border-outline-variant/10 space-y-4">
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant/60"><span>Subtotal Bruto</span> <span className="text-on-surface">${subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant/60"><span>Logística Express</span> <span className="text-on-surface">${shipping.toFixed(2)}</span></div>
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant/60"><span>Impuestos</span> <span className="text-on-surface">${tax.toFixed(2)}</span></div>
             <div className="mt-8 pt-8 border-t-2 border-primary/10">
               <div className="flex justify-between items-center">
                 <span className="font-black uppercase tracking-[0.2em] text-[10px] text-primary">Inversión Total</span> 
                 <span className="font-headline font-black text-4xl text-primary tracking-tighter">${total.toFixed(2)}</span>
               </div>
             </div>
          </div>
          
          <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10">
             <p className="text-[10px] font-black leading-relaxed opacity-60 uppercase text-primary">
               Al confirmar tu pedido, aceptas nuestros términos de servicio molecular y garantía de pureza SuperOzono.
             </p>
          </div>
        </aside>
      </div>

      {/* Suggested Products Carousel */}
      <section className="mt-20">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Completa tu compra</h2>
             <p className="text-on-surface-variant text-sm mt-1">Otros clientes también compraron estos productos.</p>
           </div>
           <div className="flex gap-2">
             <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white transition-colors">
               <span className="material-symbols-outlined text-sm">chevron_left</span>
             </button>
             <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white transition-colors">
               <span className="material-symbols-outlined text-sm">chevron_right</span>
             </button>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group bg-white p-2 rounded-2xl border border-outline-variant/10 hover:shadow-xl transition-all cursor-pointer">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-3 relative">
                 <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Suggestion" src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDK3c9CROrKB11EuFbETtnBcxIvvBjEb5Ctc8zSdDGK-tj8NYRkZ84Cb0TPC88WELTums0RGER7z6uDOjNNN14KxbRpve7LaOJJAMcSRFRUryXNGH0g3j4skMUWMiIQI5qDUNkDClcAQtmXhEN4jcH_fADBBDcx4B69qOB1g0jNztnTtLocZ3ukHiIlnNNutTpXtiWkWt12amKY41eg0Q7YPeaD6Ci_KaMLlXISj5qBTo9fVXKAY0myXyjZKgcQ8pAiXb02ISICL8g`} />
                 <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                      id: `suggested-${i}`,
                      name: `Producto Recomendado ${i}`,
                      price: 25.99,
                      quantity: 1,
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK3c9CROrKB11EuFbETtnBcxIvvBjEb5Ctc8zSdDGK-tj8NYRkZ84Cb0TPC88WELTums0RGER7z6uDOjNNN14KxbRpve7LaOJJAMcSRFRUryXNGH0g3j4skMUWMiIQI5qDUNkDClcAQtmXhEN4jcH_fADBBDcx4B69qOB1g0jNztnTtLocZ3ukHiIlnNNutTpXtiWkWt12amKY41eg0Q7YPeaD6Ci_KaMLlXISj5qBTo9fVXKAY0myXyjZKgcQ8pAiXb02ISICL8g"
                    });
                  }}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                 >
                    <span className="material-symbols-outlined text-sm">add</span>
                 </button>
              </div>
              <h4 className="font-bold text-xs text-on-surface truncate">Producto Recomendado {i}</h4>
              <p className="text-primary font-bold text-sm mt-1">$25.99</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
