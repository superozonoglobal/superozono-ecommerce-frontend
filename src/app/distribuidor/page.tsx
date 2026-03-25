"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";
import { orderService } from "@/services/order.service";
import { Store, Product, User } from "@/types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

export default function DistribuidorDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); // overview, personalization, inventory
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [activeStore, setActiveStore] = useState<Store | null>(null);

  // Customization State
  const [branding, setBranding] = useState({
    primaryColor: '#286652',
    secondaryColor: '#515f74',
    logoUrl: '',
    bannerUrl: '',
    subdomain: ''
  });

  const [paymentMethods, setPaymentMethods] = useState({
    transferencia: true,
    efectivo: true,
    tarjeta: false
  });

  // Inventory & Orders State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const inventoryData = products.slice(0, 5).map(p => ({
    name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
    stock: p.quantity
  }));
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    basePrice: 0,
    quantity: 0
  });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const salesData = [
    { name: 'Sem 1', sales: 400 },
    { name: 'Sem 2', sales: 700 },
    { name: 'Sem 3', sales: 600 },
    { name: 'Sem 4', sales: 900 },
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user?.rol === 'ADMIN' || user?.rol === 'DISTRIBUTOR') {
      fetchStores();
    }
  }, [user]);

  const fetchStores = async () => {
    setLoadingStores(true);
    try {
      const data = await storeService.listMyStores();
      setStores(data || []);
      if (data && data.length > 0) {
        const store = data[0];
        setActiveStore(store);
        setBranding({
          primaryColor: store.primaryColor || '#286652',
          secondaryColor: store.secondaryColor || '#515f74',
          logoUrl: store.logoUrl || '',
          bannerUrl: store.bannerUrl || '',
          subdomain: store.subdomain || ''
        });
        // Initial fetch for the active tab if it's not personalization
        if (activeTab === 'inventory') fetchProducts(store.id);
        if (activeTab === 'orders') fetchOrders(store.id);
      }
    } catch (err) {
      console.error("Error fetching stores", err);
      showToast("Error al cargar tiendas", "error");
    } finally {
      setLoadingStores(false);
    }
  };

  const fetchProducts = async (storeId: string) => {
    setLoadingProducts(true);
    try {
      const data = await productService.getStoreProducts(storeId);
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async (storeId: string) => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getStoreOrders(storeId);
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeStore) {
      if (activeTab === 'inventory') fetchProducts(activeStore.id);
      if (activeTab === 'orders') fetchOrders(activeStore.id);
    }
  }, [activeTab, activeStore]);

  const handleUpdateBranding = async () => {
    if (!activeStore) return;
    setIsUpdating(true);
    try {
      await storeService.updateStore(activeStore.id, {
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        logoUrl: branding.logoUrl,
        bannerUrl: branding.bannerUrl,
        subdomain: branding.subdomain
      });
      showToast("Identidad visual actualizada", "success");
      fetchStores();
    } catch (error) {
      console.error("Error updating branding", error);
      showToast("Error al guardar cambios", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore) return;
    setIsUpdating(true);
    try {
      await productService.createProduct({
        ...newProduct,
        storeId: activeStore.id
      });
      showToast("Producto creado exitosamente", "success");
      setShowProductModal(false);
      setNewProduct({ name: '', description: '', sku: '', category: '', basePrice: 0, quantity: 0 });
      fetchProducts(activeStore.id);
    } catch (error) {
      console.error("Error creating product", error);
      showToast("Error al crear producto", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user || (user.rol !== 'ADMIN' && user.rol !== 'DISTRIBUTOR')) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant animate-pulse">
            Sincronizando portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface relative font-sans overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Verdant Style */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-outline-variant/5 flex flex-col shadow-2xl z-50 transition-transform duration-500 ease-spring lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-outline-variant/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-variation-fill">eco</span>
            </div>
            <div>
              <h1 className="font-headline text-xl font-black text-on-surface tracking-tighter">SuperOzono</h1>
              <p className="text-[10px] text-primary font-black tracking-widest uppercase opacity-70">{user.rol === 'ADMIN' ? 'ADMINISTRADOR' : 'DISTRIBUIDOR'}</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <button 
            onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeTab === "overview" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-black tracking-tight">Vista General</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab("personalization"); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeTab === "personalization" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[20px]">palette</span>
            <span className="text-sm font-black tracking-tight">Personalización</span>
          </button>

          <button 
            onClick={() => { setActiveTab("inventory"); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeTab === "inventory" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span className="text-sm font-black tracking-tight">Inventario</span>
          </button>

          <button 
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeTab === "orders" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span className="text-sm font-black tracking-tight">Órdenes</span>
          </button>

          <button 
            onClick={() => { setActiveTab("payments"); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeTab === "payments" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            <span className="text-sm font-black tracking-tight">Medios de Pago</span>
          </button>
        </nav>

        <div className="p-6 border-t border-outline-variant/5">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-surface-container-low mb-4 border border-outline-variant/5">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center font-black text-xl shadow-inner">
              {user.nombre.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-on-surface leading-tight truncate">{user.nombre}</p>
              <p className="text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-widest truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 py-4 bg-surface-container-lowest text-error rounded-[20px] font-black text-[10px] tracking-[0.2em] uppercase border border-error/20 hover:bg-error/5 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface relative z-10">
        <div className="lg:hidden p-6 border-b border-outline-variant/5 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-12 h-12 flex items-center justify-center bg-surface-container border border-outline-variant/10 rounded-2xl text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary text-xs shadow-md">
              <span className="material-symbols-outlined text-sm font-variation-fill">eco</span>
            </div>
            <span className="font-headline font-black text-sm tracking-tight">SuperOzono</span>
          </div>
        </div>
        {loadingStores ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 animate-pulse">
            <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
            <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest italic">Sincronizando Tienda...</p>
          </div>
        ) : !activeStore ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto space-y-8">
            <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-5xl text-primary opacity-40">store_off</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter">Sin Tienda Asignada.</h2>
              <p className="text-on-surface-variant font-medium text-lg leading-relaxed">Tu cuenta de distribuidor aún no tiene una tienda configurada. Contacta al administrador central para activarla.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/" className="px-10 py-4 bg-on-surface text-surface rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-black/20">Regresar al Inicio</Link>
              <button onClick={logout} className="px-10 py-4 bg-surface-container-highest text-error rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-error/10 hover:border-error/20 transition-all border border-transparent shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">logout</span> Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 lg:p-12 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/5 pb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded-full">Tienda Activa</span>
                  <p className="text-[10px] text-on-surface-variant font-black tracking-[0.1em] opacity-40">ID: {activeStore.id.split('-')[0]}</p>
                </div>
                <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">{activeStore.name}</h2>
                <div className="flex items-center gap-2 text-primary font-bold text-sm bg-surface-container rounded-lg px-3 py-1.5 w-fit border border-primary/5">
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span>{activeStore.subdomain}.superozono.com</span>
                </div>
              </div>
              <div className="flex gap-4">
                <a 
                  href={`#`} 
                  onClick={(e) => {
                     e.preventDefault();
                     navigator.clipboard.writeText(`https://${activeStore.subdomain}.superozono.com`);
                     showToast("Link copiado al portapapeles", "success");
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 bg-surface-container-high text-on-surface rounded-2xl text-sm font-black tracking-tight shadow-sm hover:bg-surface-container-highest transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span> COMPARTIR ENLACE
                </a>
                <a 
                  href={`https://${activeStore.subdomain}.superozono.com`} 
                  target="_blank"
                  className="flex items-center gap-2 px-6 py-3.5 bg-on-surface text-surface rounded-2xl text-sm font-black tracking-tight shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span> VER TIENDA PÚBLICA
                </a>
              </div>
            </header>

            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-primary">payments</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-40">Ventas (Este Mes)</p>
                    <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">${orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toFixed(2)}</h3>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <span className="material-symbols-outlined text-secondary">shopping_cart</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-40">Pedidos Totales</p>
                    <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">{orders.length}</h3>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-tertiary/5 flex items-center justify-center group-hover:bg-tertiary/10 transition-colors">
                      <span className="material-symbols-outlined text-tertiary">inventory_2</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-40">Productos</p>
                    <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">{products.length}</h3>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-error/5 flex items-center justify-center group-hover:bg-error/10 transition-colors">
                      <span className="material-symbols-outlined text-error">trending_up</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-40">Popularidad</p>
                    <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">--</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sales Trend Chart */}
                  <div className="bg-surface-container-lowest p-8 rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden relative group">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-xl font-black text-on-surface uppercase tracking-tight">Tendencia de Ventas</h4>
                        <p className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase mt-1">Ingresos por semana en {activeStore.name}</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">trending_up</span>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#286652" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#286652" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 900}} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 900}} 
                          />
                          <Tooltip 
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#286652" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Stock Bar Chart */}
                  <div className="bg-surface-container-lowest p-8 rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden relative group">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-xl font-black text-on-surface uppercase tracking-tight">Niveles de Stock</h4>
                        <p className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase mt-1">Principales productos en inventario</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary">inventory</span>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inventoryData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 900}} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 900}} 
                          />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                          />
                          <Bar dataKey="stock" fill="#515f74" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Inventario de Productos</h3>
                  <button onClick={() => setShowProductModal(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl text-sm font-black tracking-tight shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                    <span className="material-symbols-outlined">add</span> NUEVO PRODUCTO
                  </button>
                </div>
                
                <section className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-container-low text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                      <tr>
                        <th className="px-8 py-5 text-left">Producto</th>
                        <th className="px-8 py-5 text-left">SKU</th>
                        <th className="px-8 py-5 text-left">Precio</th>
                        <th className="px-8 py-5 text-left">Stock</th>
                        <th className="px-8 py-5 text-left">Estado</th>
                        <th className="px-8 py-5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {loadingProducts ? (
                        <tr><td colSpan={6} className="p-20 text-center text-on-surface-variant font-bold">Cargando inventario...</td></tr>
                      ) : products.length === 0 ? (
                        <tr><td colSpan={6} className="p-20 text-center text-on-surface-variant font-bold opacity-50">No hay productos en esta tienda.</td></tr>
                      ) : products.map(product => (
                        <tr key={product.id} className="hover:bg-primary/[0.02] transition-colors group">
                          <td className="px-8 py-6 font-black text-on-surface">{product.name}</td>
                          <td className="px-8 py-6 text-sm font-bold opacity-60 font-mono">{product.sku}</td>
                          <td className="px-8 py-6 text-sm font-black text-primary">${product.basePrice}</td>
                          <td className="px-8 py-6 text-sm font-bold">{product.quantity}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${product.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant/60'}`}>
                              {product.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-3 text-secondary hover:bg-secondary/10 rounded-2xl transition-all">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Historial de Ventas</h3>
                
                <section className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-container-low text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                      <tr>
                        <th className="px-8 py-5 text-left">Pedido ID</th>
                        <th className="px-8 py-5 text-left">Cliente</th>
                        <th className="px-8 py-5 text-left">Total</th>
                        <th className="px-8 py-5 text-left">Estado</th>
                        <th className="px-8 py-5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {loadingOrders ? (
                        <tr><td colSpan={5} className="p-20 text-center text-on-surface-variant font-bold">Consultando registros...</td></tr>
                      ) : orders.length === 0 ? (
                        <tr><td colSpan={5} className="p-20 text-center text-on-surface-variant font-bold opacity-50">Sin actividad de ventas aún.</td></tr>
                      ) : orders.map(order => (
                        <tr key={order.id} className="hover:bg-secondary/[0.02] transition-colors group">
                          <td className="px-8 py-6 font-mono text-xs opacity-60">#{order.id.split('-')[0]}</td>
                          <td className="px-8 py-6">
                            <p className="font-black text-on-surface">{order.customerName}</p>
                            <p className="text-[10px] text-on-surface-variant opacity-40 font-bold">{order.customerEmail}</p>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-secondary">${order.totalPrice}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${order.status === 'PAID' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant/60'}`}>
                              {order.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-3 text-primary hover:bg-primary/10 rounded-2xl transition-all">
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            )}

            {activeTab === "personalization" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-12 gap-12">
                {/* Branding Form */}
                <div className="col-span-12 lg:col-span-5 space-y-10">
                  <section className="bg-surface-container-lowest p-10 rounded-[40px] border border-outline-variant/10 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[28px]">palette</span>
                      </div>
                      <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter">Identidad Visual</h3>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Color Primario (Marca)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={branding.primaryColor} 
                            onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                            className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-surface shadow-lg overflow-hidden flex-shrink-0"
                          />
                          <input 
                            type="text" 
                            value={branding.primaryColor} 
                            onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                            className="flex-1 bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold font-mono text-on-surface"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Color Secundario (Acentos)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={branding.secondaryColor} 
                            onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                            className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-surface shadow-lg overflow-hidden flex-shrink-0"
                          />
                          <input 
                            type="text" 
                            value={branding.secondaryColor} 
                            onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                            className="flex-1 bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold font-mono text-on-surface"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Subdominio de la Tienda</label>
                        <div className="flex items-center gap-0">
                          <input 
                            type="text" 
                            value={branding.subdomain} 
                            onChange={e => setBranding({...branding, subdomain: e.target.value})}
                            className="flex-1 bg-surface-container border border-outline-variant/20 rounded-l-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="mi-tienda"
                          />
                          <div className="bg-surface-container-high border-y border-r border-outline-variant/20 rounded-r-2xl py-4 px-6 text-xs font-black text-on-surface-variant/40">
                            .superozono.com
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">URL del Logotipo</label>
                        <input 
                          type="text" 
                          value={branding.logoUrl} 
                          onChange={e => setBranding({...branding, logoUrl: e.target.value})}
                          className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="https://ejemplo.com/logo.png"
                        />
                      </div>

                      <div className="pt-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Logotipo Comercial (Subir)</label>
                        <div className="mt-4 border-2 border-dashed border-outline-variant/30 rounded-3xl p-10 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-all cursor-pointer group shadow-inner">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 group-hover:text-primary transition-colors mb-4">upload_file</span>
                          <p className="text-sm font-black text-on-surface opacity-80 uppercase tracking-tight">Seleccionar Imagen...</p>
                          <p className="text-[10px] text-on-surface-variant mt-2 font-bold opacity-40">SVG, PNG o WEBP (Máx 2MB)</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleUpdateBranding}
                      disabled={isUpdating}
                      className="w-full py-5 bg-on-surface text-surface rounded-[24px] font-black text-sm tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                    >
                      {isUpdating ? 'GUARDANDO...' : 'GUARDAR IDENTIDAD'}
                    </button>
                  </section>
                </div>

                {/* Preview Column */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                  <div className="sticky top-12">
                    <div className="flex items-center justify-between mb-4 px-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Previsualización en Vivo</p>
                      <div className="flex gap-2">
                         <div className="w-2 h-2 rounded-full bg-error/20"></div>
                         <div className="w-2 h-2 rounded-full bg-secondary/20"></div>
                         <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                      </div>
                    </div>
                    {/* Mockup Frame */}
                    <div className="bg-surface-container-highest rounded-[48px] p-2 shadow-2xl border border-white/40 overflow-hidden ring-1 ring-black/5">
                      <div className="bg-surface-container-lowest rounded-[40px] overflow-hidden min-h-[650px] flex flex-col relative scale-100 origin-top">
                        {/* Mockup Top Nav */}
                        <div className="px-8 py-5 flex justify-between items-center bg-white border-b border-surface-container">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: branding.primaryColor }}>
                               <span className="material-symbols-outlined text-sm font-variation-fill">eco</span>
                            </div>
                            <span className="font-headline font-black text-xs tracking-tighter uppercase">{activeStore.name}</span>
                          </div>
                          <div className="flex gap-6 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">
                            <span className="text-on-surface" style={{ color: branding.primaryColor }}>Inicio</span>
                            <span>Catálogo</span>
                            <span>Nosotros</span>
                          </div>
                        </div>

                        {/* Mockup Hero */}
                        <div className="relative h-60 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10"></div>
                          <img 
                            src="https://images.unsplash.com/photo-1582560475093-ba66accbc424?q=80&w=2000&auto=format&fit=crop" 
                            className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-[20s] hover:scale-125"
                            alt="Plant background"
                          />
                          <div className="absolute inset-0 z-20 flex flex-col justify-center p-10 text-white space-y-4">
                            <h4 className="text-4xl font-black leading-[0.9] tracking-tighter max-w-xs">TECNOLOGÍA EN OXIGENACIÓN.</h4>
                            <button className="px-8 py-3 w-fit text-black font-black text-[10px] tracking-widest uppercase rounded-full shadow-2xl hover:scale-110 transition-all" style={{ backgroundColor: branding.primaryColor, color: '#ffffff' }}>EXPLORAR PRODUCTOS</button>
                          </div>
                        </div>

                        {/* Mockup Grid */}
                        <div className="p-10 flex-1 bg-surface-container-low/30 grid grid-cols-2 gap-6">
                          {[1, 2].map(i => (
                            <div key={i} className="space-y-4 group">
                              <div className="aspect-[4/5] bg-white rounded-[32px] overflow-hidden shadow-sm border border-outline-variant/10 p-2">
                                <div className="w-full h-full bg-surface-container rounded-[24px] flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity overflow-hidden">
                                   <img src={`https://images.unsplash.com/photo-1542156822-6924d1a71ace?q=80&w=500&auto=format&fit=crop`} className="w-full h-full object-cover" alt="Product" />
                                </div>
                              </div>
                              <div className="px-2 space-y-1">
                                <div className="h-4 w-3/4 bg-on-surface/5 rounded-full"></div>
                                <div className="h-3 w-1/2 bg-on-surface/5 rounded-full opacity-40"></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mockup Sticky Badge */}
                        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 px-5 py-3 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl group cursor-pointer hover:bg-white/60 transition-all">
                           <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: branding.primaryColor }}></div>
                           <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tienda en Vivo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl space-y-12">
                <header>
                  <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Configuración de Pagos</h3>
                  <p className="text-on-surface-variant font-medium opacity-60 text-sm mt-1">Habilita los métodos de pago que tus clientes podrán usar en tu tienda.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: 'transferencia', name: 'Transferencia Bancaria', icon: 'account_balance', desc: 'Pago directo a tu cuenta bancaria.' },
                    { id: 'efectivo', name: 'Efectivo / Contra Entrega', icon: 'payments', desc: 'Ideal para entregas locales y cercanía.' },
                    { id: 'tarjeta', name: 'Tarjeta de Crédito/Débito', icon: 'credit_card', desc: 'Procesa pagos online con pasarela.' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethods(prev => ({ ...prev, [method.id]: !prev[method.id as keyof typeof paymentMethods] }))}
                      className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group flex flex-col justify-between h-64 ${paymentMethods[method.id as keyof typeof paymentMethods] ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/30'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${paymentMethods[method.id as keyof typeof paymentMethods] ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-2xl">{method.icon}</span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${paymentMethods[method.id as keyof typeof paymentMethods] ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/20'}`}>
                          {paymentMethods[method.id as keyof typeof paymentMethods] && <span className="material-symbols-outlined text-sm font-black">done</span>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-headline text-xl font-black text-on-surface tracking-tight leading-none mb-2">{method.name}</h4>
                        <p className="text-xs font-medium text-on-surface-variant opacity-60 leading-relaxed">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container-low/50 p-8 rounded-[32px] border border-outline-variant/10 flex items-center justify-between gap-8">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-primary text-3xl">info</span>
                    <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                      Los cambios en los métodos de pago se reflejarán instantáneamente en el checkout de tu tienda pública. Asegúrate de tener configuradas tus cuentas en la sección de perfil.
                    </p>
                  </div>
                  <button className="px-8 py-4 bg-on-surface text-surface rounded-2xl text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-xl">Guardar Configuración</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NEW PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden border border-outline-variant/10 animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-primary/[0.02]">
              <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Nuevo Producto</h3>
              <button onClick={() => setShowProductModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 hover:text-error transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-10 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Nombre del Producto</label>
                 <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Ej: Camiseta Premium" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">SKU</label>
                   <input required type="text" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="PROD-001" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Categoría</label>
                   <input required type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Ropa" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Precio Base</label>
                   <input required type="number" step="0.01" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="0.00" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Stock Inicial</label>
                   <input required type="number" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="0" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Descripción</label>
                 <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all h-24" placeholder="Detalles del producto..."></textarea>
               </div>
               <div className="pt-6">
                 <button disabled={isUpdating} type="submit" className="w-full py-5 bg-on-surface text-surface rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-2xl disabled:opacity-50">
                    {isUpdating ? 'CREANDO...' : 'REGISTRAR PRODUCTO'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-8 duration-500">
          <div className={`px-8 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 border-2 ${toast.type === 'success' ? 'bg-primary text-on-primary border-primary/20 shadow-primary/20' : 'bg-error text-on-error border-error/20 shadow-error/20'}`}>
            <span className="material-symbols-outlined text-2xl">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            <p className="text-sm font-black tracking-tight uppercase leading-none">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
