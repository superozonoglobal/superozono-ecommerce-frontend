"use client";

import { useState, useMemo } from 'react';
import { User, Product, Store } from '@/types';

interface InventorySectionProps {
  currentUser: any; // Using any to handle Usuario/User mismatch from different contexts
  distributors: User[];
  stores: Store[];
  allProducts: Product[];
  onBack: () => void;
}

export default function InventorySection({ 
  currentUser, 
  distributors, 
  stores,
  allProducts 
}: InventorySectionProps) {
  const [view, setView] = useState<'list' | 'assignment'>('list');
  const [selectedDistro, setSelectedDistro] = useState<User | null>(null);
  const [assignedProducts, setAssignedProducts] = useState<(Product & { assignQty: number, minPrice: number, maxPrice: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter distributors based on role and who invited them
  const filteredDistros = useMemo(() => {
    let list = distributors.filter(d => d.role === 'ADMIN' || d.role === 'DISTRIBUTOR');
    
    // Check both role (User) and rol (Usuario)
    const userRole = currentUser.role || currentUser.rol;
    
    if (userRole === 'ADMIN') {
      // Admin only sees their own
      list = list.filter(d => d.invitedBy === currentUser.id);
    }
    
    // In search
    if (searchQuery) {
      list = list.filter(d => 
        d.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return list;
  }, [distributors, currentUser, searchQuery]);

  const handleSelectDistro = (distro: User) => {
    setSelectedDistro(distro);
    setView('assignment');
    // Mock initial assigned products for demo or fetch from API
    setAssignedProducts([
      { ...allProducts[0], assignQty: 500, minPrice: 45.00, maxPrice: 59.99 },
      { ...allProducts[1], assignQty: 0, minPrice: 280.00, maxPrice: 325.00 },
      { ...allProducts[2], assignQty: 100, minPrice: 85.00, maxPrice: 110.00 },
    ].filter(p => p.id)); // filter out undefined if allProducts is empty
  };

  const totalInventoryCost = assignedProducts.reduce((acc, p) => acc + (p.assignQty * p.minPrice), 0);

  if (view === 'assignment' && selectedDistro) {
    const store = stores.find(s => s.ownerId === selectedDistro.id);
    
    return (
      <div className="animate-in fade-in duration-500">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 items-center gap-2 text-sm font-medium text-on-surface-variant/60">
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setView('list')}>Usuarios</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Asignación de Inventario</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-black">{selectedDistro.firstName} {selectedDistro.lastName}</span>
        </nav>

        <header className="mb-12">
          <h1 className="font-headline text-5xl font-black text-on-surface tracking-tighter">Asignar Inventario Inicial.</h1>
          <p className="text-on-surface-variant mt-2 font-medium opacity-60">Control de stock y márgenes de ganancia para distribuidores.</p>
        </header>

        {/* Distributor Context Card */}
        <div className="bg-surface-container-lowest rounded-[32px] p-8 mb-12 flex flex-col md:flex-row items-center justify-between border border-outline-variant/10 shadow-sm gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined text-4xl">business</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Perfil del Distribuidor</p>
              <h3 className="text-2xl font-black text-on-surface tracking-tight">{store?.name || 'Distribuidor Sin Tienda'}</h3>
              <p className="text-on-surface-variant text-sm font-bold opacity-60 flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-[16px]">mail</span> 
                {selectedDistro.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">Fase de Configuración: 2/3</span>
            <div className="w-56 h-2 bg-surface-container rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-primary w-2/3 rounded-full transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">search</span>
            <input 
              className="w-full pl-14 pr-6 py-5 bg-surface-container-low border border-outline-variant/5 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30" 
              placeholder="Buscar productos por nombre, SKU o categoría..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-low hover:bg-surface-container rounded-2xl transition-all border border-outline-variant/5">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filtrar
            </button>
            <button className="flex items-center gap-2 px-6 py-4 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all border border-primary/20">
              <span className="material-symbols-outlined text-[18px]">download</span> Importar CSV
            </button>
          </div>
        </div>

        {/* Table/List */}
        <div className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden mb-12">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low/50 text-on-surface-variant/60 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-10 py-6">Producto</th>
                  <th className="px-8 py-6">Stock Global</th>
                  <th className="px-8 py-6">Asignar Qty</th>
                  <th className="px-8 py-6">Rango de Precios (Min-Max)</th>
                  <th className="px-10 py-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {assignedProducts.map((product, idx) => (
                  <tr key={idx} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container border border-outline-variant/10 p-1">
                          <img 
                            alt={product.name} 
                            src={product.imageUrl || "https://images.unsplash.com/photo-1582560475093-ba66accbc424?q=80&w=200&auto=format&fit=crop"} 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-on-surface text-lg leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest mt-1">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-on-surface">{product.quantity} Unidades</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${product.quantity > 100 ? 'text-emerald-600' : 'text-error'}`}>
                          {product.quantity > 100 ? 'Stock Suficiente' : 'Stock Bajo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            const newArr = [...assignedProducts];
                            newArr[idx].assignQty = Math.max(0, newArr[idx].assignQty - 1);
                            setAssignedProducts(newArr);
                          }}
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-outline-variant/20 flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <input 
                          className="w-20 p-3 bg-surface-container/50 text-center rounded-xl border border-outline-variant/10 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-mono text-xs font-black" 
                          type="number" 
                          value={product.assignQty}
                          onChange={(e) => {
                            const newArr = [...assignedProducts];
                            newArr[idx].assignQty = parseInt(e.target.value) || 0;
                            setAssignedProducts(newArr);
                          }}
                        />
                         <button 
                          onClick={() => {
                            const newArr = [...assignedProducts];
                            newArr[idx].assignQty += 1;
                            setAssignedProducts(newArr);
                          }}
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-outline-variant/20 flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant/40">$</span>
                          <input 
                            className="w-24 pl-6 p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10 focus:ring-4 focus:ring-primary/10 text-xs font-black font-mono" 
                            type="text" 
                            value={product.minPrice}
                            onChange={(e) => {
                              const newArr = [...assignedProducts];
                              newArr[idx].minPrice = parseFloat(e.target.value) || 0;
                              setAssignedProducts(newArr);
                            }}
                          />
                        </div>
                        <span className="text-on-surface-variant/20 font-black">—</span>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant/40">$</span>
                          <input 
                            className="w-24 pl-6 p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10 focus:ring-4 focus:ring-primary/10 text-xs font-black font-mono" 
                            type="text" 
                            value={product.maxPrice}
                            onChange={(e) => {
                              const newArr = [...assignedProducts];
                              newArr[idx].maxPrice = parseFloat(e.target.value) || 0;
                              setAssignedProducts(newArr);
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => setAssignedProducts(assignedProducts.filter((_, i) => i !== idx))}
                        className="w-10 h-10 flex items-center justify-center text-on-surface-variant/20 hover:text-error hover:bg-error/10 rounded-full transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-10 border-t border-dashed border-outline-variant/20 flex justify-center bg-surface-container-low/20">
            <button className="flex items-center gap-3 px-8 py-5 rounded-[24px] border-2 border-dashed border-outline-variant/30 hover:border-primary hover:text-primary transition-all text-on-surface-variant/40 font-black uppercase tracking-widest text-[10px] group">
              <span className="material-symbols-outlined transition-transform group-hover:scale-125">add_circle</span>
              Añadir Productos del Catálogo
            </button>
          </div>
        </div>

        {/* Totals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-20 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 bg-surface-container-low/50 rounded-[40px] p-10 flex flex-col justify-center border border-outline-variant/5">
            <h5 className="font-headline text-2xl font-black text-on-surface mb-4 uppercase tracking-tight">Términos de Distribución</h5>
            <p className="text-on-surface-variant font-medium leading-relaxed opacity-70">Al guardar esta asignación, las cantidades especificadas se reservarán en el stock global para el distribuidor seleccionado hasta que se finalice la configuración.</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">verified</span> Tarifas Estándar
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span> Asignación Bloqueada (48h)
              </div>
            </div>
          </div>
          <div className="bg-primary p-10 rounded-[40px] flex flex-col justify-between text-on-primary shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-3">Valor Total de Inventario</p>
              <h4 className="text-5xl font-headline font-black tracking-tighter">${totalInventoryCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <p className="text-[10px] font-bold mt-4 opacity-40 uppercase tracking-widest">Base de cálculo proyectada</p>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="opacity-60">SKUs Asignados</span>
                <span>{assignedProducts.length}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="opacity-60">Volumen Estimado</span>
                <span>{(assignedProducts.length * 0.8).toFixed(1)} m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="fixed bottom-0 left-0 right-0 md:pl-72 z-40">
          <div className="bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 p-6 md:p-8 flex items-center justify-between mx-4 md:mx-10 mb-6 rounded-[32px] shadow-2xl">
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-2xl transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span> Atrás
            </button>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                Guardar Borrador
              </button>
              <button className="px-10 py-5 bg-on-surface text-surface text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95">
                Confirmar y Continuar
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">Inventarios Globales.</h2>
          <p className="text-on-surface-variant mt-2 font-medium opacity-60">Gestiona la red de distribución y asignación de stock centralizado.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">search</span>
          <input 
            type="text" 
            placeholder="Buscar distribuidor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 pl-14 pr-6 py-4 bg-surface-container-low border border-outline-variant/5 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all text-xs font-black uppercase tracking-widest placeholder:text-on-surface-variant/30"
          />
        </div>
      </header>

      {/* Grid of Distributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredDistros.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface-container-low/50 rounded-[40px] border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">group_off</span>
            <p className="text-on-surface-variant font-black uppercase tracking-widest opacity-40">No se encontraron distribuidores</p>
          </div>
        ) : filteredDistros.map((distro) => {
          const store = stores.find(s => s.ownerId === distro.id);
          return (
            <div 
              key={distro.id} 
              className="bg-surface-container-lowest p-8 rounded-[40px] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col justify-between min-h-[320px]"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">storefront</span>
                  </div>
                  {distro.invitedBy && (currentUser.role === 'ROOT_ADMIN' || currentUser.rol === 'ROOT_ADMIN') && distro.invitedBy !== currentUser.id && (
                    <span className="px-3 py-1 bg-on-surface/5 rounded-full text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                      Invitado por: {distro.invitedByName || 'Otro Admin'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tight leading-tight">{store?.name || distro.firstName + ' ' + (distro.lastName || '')}</h3>
                  <p className="text-xs text-on-surface-variant font-bold opacity-40 mt-1 truncate">{distro.email}</p>
                </div>
                <div className="pt-4 flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden p-1 shadow-sm">
                           <img 
                             src={`https://images.unsplash.com/photo-1582560475093-ba66accbc424?q=80&w=100&auto=format&fit=crop`} 
                             className="w-full h-full object-cover rounded-full"
                             alt="prod"
                           />
                        </div>
                      ))}
                   </div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">12 SKUs</span>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-outline-variant/5 mt-8">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Valor Stock</span>
                  <span className="text-sm font-black text-on-surface">$24,500</span>
                </div>
                <button 
                  onClick={() => handleSelectDistro(distro)}
                  className="w-12 h-12 rounded-2xl bg-on-surface text-surface flex items-center justify-center hover:bg-primary transition-all active:scale-90 shadow-xl"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
