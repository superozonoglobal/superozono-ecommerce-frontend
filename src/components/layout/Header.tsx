"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-surface-container">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <span className="text-xl font-black tracking-tight text-primary font-headline uppercase">SuperOzono</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              placeholder="Buscar en nuestra colección..." 
              type="text" 
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className="text-primary font-bold font-headline text-sm tracking-wide">Comprar Todo</Link>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-medium" href="#">Soluciones</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-medium" href="#">Impacto</a>
        </nav>

        {/* Trailing Icons */}
        <div className="flex items-center gap-4">
          <Link href="/carrito" className="hover:bg-emerald-50 rounded-full p-2 transition-all relative">
            <span className="material-symbols-outlined text-emerald-800" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          <div className="hidden sm:block w-8 h-8 rounded-full overflow-hidden border border-primary-fixed-dim">
            <Link href="/login">
              <img 
                className="w-full h-full object-cover cursor-pointer" 
                alt="User profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBkaQRFGnrACxRKPTswAMkhyoJsNRqUlY7UWGK-F8b5guChjFClxpupu58ORzVRLFuqFbF4zrsNuXOJWtnK8A7EXJwVzvSvirBtD-jexTdqAMmFydrxOYXASXbFBxQ1sx03XwNQIUN1czFTWHZUNOPrymxvy-3HFP7XYlR01DUO2-LQKy1qod8b8m1zbzXQVVAss3-YqkTa1IcC6-YTFznTCIju76Ss4PZq7feYPo51lvAXjE4LKWUYl4zciG4HscazLFG0uApmiI"
              />
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary active:scale-95 transition-all z-50"
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-0 bg-white z-40 p-6 flex flex-col gap-8 pt-24"
          >
            <div className="flex flex-col gap-6">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-black text-primary font-headline tracking-tighter">TIENDA</Link>
              <a onClick={() => setIsOpen(false)} className="text-xl font-headline font-bold text-on-surface-variant tracking-tight" href="#">SOLUCIONES</a>
              <a onClick={() => setIsOpen(false)} className="text-xl font-headline font-bold text-on-surface-variant tracking-tight" href="#">IMPACTO</a>
            </div>
            <div className="mt-auto pt-8 border-t border-surface-container flex flex-col gap-4">
               <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-5 bg-surface-container-low rounded-3xl font-black text-xs uppercase tracking-widest text-primary">
                  <span className="material-symbols-outlined">person</span> 
                  MI CUENTA MAESTRA
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
