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

  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  const openInvoiceDrawer = (order: any) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceDrawerOpen(true);
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceError, setEditPriceError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    basePrice: 0,
    quantity: 0
  });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [newStore, setNewStore] = useState({ name: '', subdomain: '', address: '', phone: '' });
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const salesData = [
    { name: 'Lun', sales: 400, target: 500 },
    { name: 'Mar', sales: 700, target: 400 },
    { name: 'Mié', sales: 600, target: 650 },
    { name: 'Jue', sales: 900, target: 800 },
    { name: 'Vie', sales: 1200, target: 950 },
    { name: 'Sáb', sales: 850, target: 750 },
    { name: 'Dom', sales: 1450, target: 1100 },
  ];

  // Logic for Top Products by Revenue
  const getTopProductsByRevenue = () => {
    const revenueMap: Record<string, { name: string, revenue: number, quantity: number, stock: number }> = {};
    
    // Map existing products to have stock info ready
    products.forEach(p => {
      revenueMap[p.id] = { name: p.name, revenue: 0, quantity: 0, stock: p.quantity };
    });

    // Accumulate revenue from orders
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (revenueMap[item.productId]) {
          revenueMap[item.productId].revenue += (item.price || 0) * (item.quantity || 0);
          revenueMap[item.productId].quantity += (item.quantity || 0);
        }
      });
    });

    return Object.values(revenueMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  };

  const topProducts = getTopProductsByRevenue();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStore(true);
    try {
      await storeService.createStore(newStore);
      showToast("¡Tienda creada exitosamente!", "success");
      fetchStores();
    } catch (error: any) {
      console.error("Error al crear tienda", error);
      showToast(error.response?.data?.message || "Error al crear la tienda", "error");
    } finally {
      setIsCreatingStore(false);
    }
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
        if (activeTab === 'inventory' || activeTab === 'overview') fetchProducts(store.id);
        if (activeTab === 'orders' || activeTab === 'overview') fetchOrders(store.id);
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
      if (activeTab === 'inventory' || activeTab === 'overview') fetchProducts(activeStore.id);
      if (activeTab === 'orders' || activeTab === 'overview') fetchOrders(activeStore.id);
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

  const handleEditProductPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    // Validate bounds
    if (editingProduct.minPrice && editingProduct.basePrice < editingProduct.minPrice) {
      setEditPriceError(`El precio no puede ser menor a $${editingProduct.minPrice}`);
      return;
    }
    if (editingProduct.maxPrice && editingProduct.basePrice > editingProduct.maxPrice) {
      setEditPriceError(`El precio no puede exceder $${editingProduct.maxPrice}`);
      return;
    }

    setEditPriceError("");
    setIsUpdating(true);
    try {
      await productService.updateProduct(editingProduct.id, {
        basePrice: editingProduct.basePrice
      });
      showToast("Precio actualizado correctamente", "success");
      setShowEditProductModal(false);
      if (activeStore) fetchProducts(activeStore.id);
    } catch (error) {
      console.error("Error updating price", error);
      showToast("Error al actualizar precio", "error");
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
          <div className="min-h-full p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="bg-surface-container-lowest p-10 rounded-[40px] border border-outline-variant/10 shadow-xl space-y-8 mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-4xl">storefront</span>
                </div>
                <h2 className="font-headline text-3xl font-black text-on-surface tracking-tighter">Activa tu Tienda</h2>
                <p className="text-on-surface-variant font-medium mt-2 leading-relaxed text-sm">Configura la información inicial y elige tu subdominio para comenzar a vender inmediatamente.</p>
              </div>

              <form onSubmit={handleCreateStore} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 border-l-2 border-primary pl-2">Información Básica</label>
                  <div className="grid gap-4">
                    <input 
                      required
                      type="text" 
                      value={newStore.name} 
                      onChange={e => setNewStore({...newStore, name: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Nombre de la Tienda (Ej: EcoTienda)"
                    />
                    <input 
                      required
                      type="text" 
                      value={newStore.phone} 
                      onChange={e => setNewStore({...newStore, phone: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Teléfono de Contacto"
                    />
                    <input 
                      required
                      type="text" 
                      value={newStore.address} 
                      onChange={e => setNewStore({...newStore, address: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Dirección Física"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 border-l-2 border-primary pl-2">Enlace de tu Tienda</label>
                  <div className="flex items-center gap-0">
                    <input 
                      required
                      type="text" 
                      value={newStore.subdomain} 
                      onChange={e => setNewStore({...newStore, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                      className="flex-1 bg-surface-container border border-outline-variant/20 rounded-l-2xl py-4 px-6 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="mi-tienda-genial"
                    />
                    <div className="bg-surface-container-high border-y border-r border-outline-variant/20 rounded-r-2xl py-4 px-6 text-xs font-black text-on-surface-variant/40">
                      .superozono.com
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-bold opacity-60 ml-2">Solo letras, números y guiones. Sin espacios ni tildes.</p>
                </div>

                <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
                  <button 
                    disabled={isCreatingStore}
                    type="submit"
                    className="w-full py-5 bg-on-surface text-surface rounded-[24px] font-black text-sm tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-xl disabled:opacity-50"
                  >
                    {isCreatingStore ? 'CREANDO...' : 'ACTIVAR TIENDA AHORA'}
                  </button>
                  <button 
                    type="button"
                    onClick={logout} 
                    className="w-full py-4 text-on-surface-variant font-black text-xs tracking-widest uppercase hover:bg-error/10 hover:text-error rounded-2xl transition-colors"
                  >
                    CERRAR SESIÓN POR AHORA
                  </button>
                </div>
              </form>
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
                {/* Hero Header */}
                <section className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-headline text-on-surface">Panel de Control</h2>
                    <p className="text-sm text-on-surface-variant font-body">Eficiencia: 94% • Órdenes Activas: {orders.filter(o => o.status === 'PAID').length} • 2 Alertas Críticas</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-shopify bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-semibold text-xs flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      Hoy
                    </button>
                    <button className="px-3 py-1.5 rounded-shopify bg-[#1a1c1d] text-white font-semibold text-xs flex items-center gap-2 hover:bg-black transition-colors">
                      <span className="material-symbols-outlined text-base">download</span>
                      Exportar Datos
                    </button>
                  </div>
                </section>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-surface-container-lowest p-6 rounded-shopify border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ingresos Totales</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">${orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toFixed(2)}</h3>
                    <p className="text-[11px] text-on-surface-variant mt-1">vs. mes anterior</p>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-shopify border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ticket Promedio</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+5.2%</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">
                      ${orders.length > 0 ? (orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0) / orders.length).toFixed(2) : '0.00'}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant mt-1">Crecimiento estable</p>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-shopify border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Tasa de Conversión</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">-1.2%</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">3.42%</h3>
                    <p className="text-[11px] text-on-surface-variant mt-1">Requiere atención</p>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-shopify border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Órdenes Pendientes</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">4 Urgentes</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">{orders.filter(o => o.status === 'PAID').length}</h3>
                    <p className="text-[11px] text-on-surface-variant mt-1">Próximo despacho: 2h</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Sales Trend Chart */}
                  <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-shopify border border-outline-variant/10 shadow-sm relative group">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">Tendencia de Ventas</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Comparativa diaria: Ingresos vs Meta</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          <span className="text-[10px] font-medium">Ingresos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-medium">Meta</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#286652" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#286652" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 500}} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9E9E9E', fontSize: 10, fontWeight: 500}} 
                          />
                          <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontWeight: 'bold'}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#286652" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#CBD5E1" 
                            strokeDasharray="5 5"
                            strokeWidth={2} 
                            fill="transparent" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-surface-container-lowest p-8 rounded-shopify border border-outline-variant/10 shadow-sm relative group">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">Top Productos</h4>
                      <button onClick={() => setActiveTab('inventory')} className="text-xs text-primary font-bold hover:underline">Ver Todos</button>
                    </div>
                    <div className="space-y-6">
                      {topProducts.length === 0 ? (
                        <p className="text-center text-xs text-on-surface-variant opacity-50 py-10">Sin datos de ventas aún.</p>
                      ) : topProducts.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-surface-container-low rounded border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-outline-variant">eco</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{p.name}</p>
                            <div className="w-full bg-surface-container-low h-1 rounded-full mt-2">
                              <div 
                                className={`${p.stock < 50 ? 'bg-rose-500' : 'bg-emerald-500'} h-1 rounded-full transition-all duration-1000`} 
                                style={{ width: `${Math.min((p.stock/200)*100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-[10px] font-bold ${p.stock < 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                               ${p.revenue.toLocaleString()}
                             </p>
                             <p className="text-[10px] text-on-surface-variant">{p.stock} unidades</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-primary text-white text-xs font-bold rounded-shopify hover:opacity-90 transition-all shadow-md shadow-primary/10">
                      Generar Orden de Compra
                    </button>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <section className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-shopify overflow-hidden">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/5">
                    <h3 className="text-sm font-bold text-on-surface">Órdenes Recientes</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-primary font-bold hover:underline">Ver Historial Completo</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                        <tr>
                          <th className="px-6 py-3 border-b border-outline-variant/10">Orden</th>
                          <th className="px-6 py-3 border-b border-outline-variant/10">Fecha</th>
                          <th className="px-6 py-3 border-b border-outline-variant/10">Cliente</th>
                          <th className="px-6 py-3 border-b border-outline-variant/10">Estado</th>
                          <th className="px-6 py-3 border-b border-outline-variant/10 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {loadingOrders ? (
                          <tr><td colSpan={5} className="py-10 text-center font-bold">Cargando órdenes...</td></tr>
                        ) : orders.length === 0 ? (
                          <tr><td colSpan={5} className="py-10 text-center text-on-surface-variant opacity-50">Sin órdenes recientes.</td></tr>
                        ) : orders.slice(0, 5).map(order => (
                          <tr key={order.id} onClick={() => openInvoiceDrawer(order)} className="hover:bg-surface-container-low cursor-pointer transition-colors group">
                            <td className="px-6 py-4 font-bold">#ORD-{order.id.toString().split('-')[0].padStart(4, '0')}</td>
                            <td className="px-6 py-4 text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{order.customerName || order.buyerEmail || 'Invitado'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {order.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold">${order.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto space-y-8">
                {/* Header & Search */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Matriz de Inventario</h1>
                    <p className="text-on-surface-variant max-w-md">Supervisión en tiempo real de los niveles de stock y precios de tu tienda.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-80 group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
                      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm outline-none" placeholder="Buscar producto en el catálogo..." type="text"/>
                    </div>
                  </div>
                </section>

                {/* Inventory Table (High-End Editorial Style) */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Detalles del Producto</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Stock Disponible</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Precio (Unidad)</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {loadingProducts ? (
                          <tr><td colSpan={5} className="py-20 text-center text-on-surface-variant font-bold">Cargando matriz de inventario...</td></tr>
                        ) : products.length === 0 ? (
                          <tr><td colSpan={5} className="py-20 text-center text-on-surface-variant font-bold opacity-50">Inventario vacío.</td></tr>
                        ) : products.map(product => {
                          const isLowStock = product.quantity <= (product.minStockAlert || 5);
                          return (
                            <tr key={product.id} className="group hover:bg-surface-container-low transition-colors">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 flex items-center justify-center text-on-surface-variant">
                                    {product.imageUrl ? (
                                      <img alt={product.name} className="w-full h-full object-cover" src={product.imageUrl} />
                                    ) : (
                                       <span className="material-symbols-outlined opacity-50">shopping_bag</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-on-surface">{product.name}</p>
                                    <p className="text-xs text-on-surface-variant font-mono">SKU: {product.sku}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                {isLowStock ? (
                                  <div className="inline-flex flex-col items-end">
                                    <span className="font-headline font-semibold text-error">{product.quantity} Unidades</span>
                                    <span className="bg-error-container text-on-error-container text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1">Alerta Restock</span>
                                  </div>
                                ) : (
                                  <span className="font-headline font-semibold text-on-surface">{product.quantity} Unidades</span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-right font-body text-on-surface-variant">
                                ${product.basePrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${product.status === 'ACTIVE' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant/60'}`}>
                                  {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingProduct(product);
                                      setShowEditProductModal(true);
                                      setEditPriceError("");
                                    }}
                                    className="p-2 hover:bg-surface-container-highest rounded-lg transition-all text-on-surface-variant" 
                                    title="Fijar Precio"
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                  </button>
                                  <button className="p-2 hover:bg-error-container/50 rounded-lg transition-all text-error" title="Desactivar">
                                    <span className="material-symbols-outlined text-sm">block</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Footnote */}
                  <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant font-medium">
                    <span>Mostrando {products.length} productos en catálogo</span>
                    <div className="flex gap-4">
                      <button className="hover:text-primary transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="material-symbols-outlined text-sm">chevron_left</span> Anterior
                      </button>
                      <button className="hover:text-primary transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed">
                        Siguiente <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Action Button for New Product */}
                <button 
                  onClick={() => setShowProductModal(true)}
                  className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-50 group"
                >
                  <span className="material-symbols-outlined font-bold">add</span>
                  <span className="absolute right-[calc(100%+1rem)] mr-0 bg-on-background text-background px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Nuevo Producto</span>
                </button>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto space-y-8">
                {/* Header & Search */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Historial de Órdenes</h1>
                    <p className="text-on-surface-variant max-w-md">Registro completo de las ventas y transacciones generadas en tu tienda.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-80 group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
                      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm outline-none" placeholder="Buscar orden por #ID o cliente..." type="text"/>
                    </div>
                  </div>
                </section>
                
                <section className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-shopify overflow-hidden">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                    <h3 className="text-sm font-bold text-on-surface">Todas las Órdenes ({orders.length})</h3>
                    <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-surface-container-high rounded-shopify transition-colors text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                      </button>
                      <button className="px-3 py-1.5 rounded-shopify bg-[#1a1c1d] text-white font-semibold text-xs flex items-center gap-2 hover:bg-black transition-colors">
                        <span className="material-symbols-outlined text-base">download</span> Exportar CSV
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                        <tr>
                          <th className="px-6 py-4 border-b border-outline-variant/10">Orden #</th>
                          <th className="px-6 py-4 border-b border-outline-variant/10">Fecha</th>
                          <th className="px-6 py-4 border-b border-outline-variant/10">Cliente</th>
                          <th className="px-6 py-4 border-b border-outline-variant/10">Estado</th>
                          <th className="px-6 py-4 border-b border-outline-variant/10 text-right">Total</th>
                          <th className="px-6 py-4 border-b border-outline-variant/10 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {loadingOrders ? (
                          <tr><td colSpan={6} className="py-20 text-center text-on-surface-variant font-bold">Consultando registros...</td></tr>
                        ) : orders.length === 0 ? (
                          <tr><td colSpan={6} className="py-20 text-center text-on-surface-variant font-bold opacity-50">Sin actividad de ventas aún.</td></tr>
                        ) : orders.map(order => {
                           const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                           const isDelivered = order.status === 'DELIVERED';
                           const isProcessing = order.status === 'PROCESSING';
                           return (
                              <tr key={order.id} className="hover:bg-surface-container-low cursor-pointer transition-colors group">
                                <td className="px-6 py-5 font-bold">#ORD-{order.id.toString().split('-')[0].padStart(4, '0')}</td>
                                <td className="px-6 py-5 text-on-surface-variant">{date}</td>
                                <td className="px-6 py-5">
                                  <p className="font-bold text-on-surface">{order.customerName || order.buyerEmail || 'Invitado'}</p>
                                  {(order.customerEmail || order.buyerEmail) && <p className="text-[10px] text-on-surface-variant opacity-70">{order.customerEmail || order.buyerEmail}</p>}
                                </td>
                                <td className="px-6 py-5">
                                  {isDelivered && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Entregado</span>}
                                  {isProcessing && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">Procesando</span>}
                                  {!isDelivered && !isProcessing && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{order.status || 'PENDIENTE'}</span>}
                                </td>
                                <td className="px-6 py-5 text-right font-bold">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                                <td className="px-6 py-5 text-right flex justify-end gap-2">
                                  <button title="Ver Factura" onClick={() => openInvoiceDrawer(order)} className="p-2 border border-outline-variant/20 hover:bg-surface-container-highest rounded-md text-on-surface-variant transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                  </button>
                                  <button title="Gestionar Envío" className="p-2 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                                  </button>
                                </td>
                              </tr>
                           );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant font-medium">
                    <span>Mostrando {orders.length} órdenes registradas</span>
                    <div className="flex gap-4">
                      <button className="hover:text-primary transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="material-symbols-outlined text-sm">chevron_left</span> Anterior
                      </button>
                      <button className="hover:text-primary transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed">
                        Siguiente <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "personalization" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                  <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 uppercase">Storefront Customization</h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl">Define your brand identity and preview how your distributors will experience your digital storefront.</p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Settings */}
                  <div className="col-span-12 lg:col-span-5 space-y-8">
                    
                    {/* Branding Card */}
                    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-transparent">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary">palette</span>
                        <h3 className="text-xl font-bold tracking-tight">Brand Identity</h3>
                      </div>

                      {/* Color Pickers */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">Primary Branding Color</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="color" 
                              value={branding.primaryColor} 
                              onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                              className="w-12 h-12 rounded-lg cursor-pointer border-4 border-surface shadow-md p-0 flex-shrink-0"
                            />
                            <input 
                              type="text" 
                              value={branding.primaryColor} 
                              onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                              className="flex-1 bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">Secondary Accent Color</label>
                          <div className="flex items-center gap-4">
                             <input 
                              type="color" 
                              value={branding.secondaryColor} 
                              onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                              className="w-12 h-12 rounded-lg cursor-pointer border-4 border-surface shadow-md p-0 flex-shrink-0"
                            />
                            <input 
                              type="text" 
                              value={branding.secondaryColor} 
                              onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                              className="flex-1 bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Store Details Input */}
                      <div className="mt-8 space-y-6">
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">Subdominio de la Tienda</label>
                           <div className="flex items-center gap-0">
                             <input 
                               type="text" 
                               value={branding.subdomain} 
                               onChange={e => setBranding({...branding, subdomain: e.target.value})}
                               className="flex-1 bg-surface-container-low border-none rounded-l-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                               placeholder="mi-tienda"
                             />
                             <div className="bg-surface-container border-y border-r border-transparent rounded-r-lg px-4 py-3 text-xs font-bold text-on-surface-variant/60">
                               .superozono.com
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Logo Upload */}
                      <div className="mt-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">Brand Logo</label>
                        <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer group">
                          <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary transition-colors mb-2">upload_file</span>
                          <p className="text-sm font-medium text-on-surface">Drag and drop your logo here</p>
                          <p className="text-xs text-on-surface-variant mt-1">PNG, SVG or WEBP (Max 2MB)</p>
                        </div>
                         <input 
                            type="text" 
                            value={branding.logoUrl} 
                            onChange={e => setBranding({...branding, logoUrl: e.target.value})}
                            className="w-full mt-4 bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="o pega la URL de tu logo aquí"
                          />
                      </div>
                    </section>

                    {/* Banner Customization */}
                    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary">image</span>
                        <h3 className="text-xl font-bold tracking-tight">Banner Image</h3>
                      </div>
                      <div className="relative group overflow-hidden rounded-xl aspect-[21/9] mb-4">
                        <img 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWg94njWrjlhJZPpOAXxT5ZSZikI7Ak9rjyfbBA39lK6QYo6_ZSlkWvI9FZOIZtgKsRcrQhshRwa_zUpQfhW2sAxCNjk0KQBigZR2bDRb7fc4QhaWlzQbXTDYcalDXN2gPX-njLdpsi3n1EiJ5gN0oKDQ3yy-kbIUPoxpuSZHhh7PhQdIF2QVtZB7zpfUMorO_9bSnLme9T1LjGcZOFMzBI58sKksXUdVq4PhHl4lB0NPuLn3O4-i0Wx1ogm4-9pLzgVgMnAB35XI"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold text-sm border border-white/30 hover:bg-white/40 transition-all">Replace Image</button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-12 w-12 rounded-lg bg-surface-container-high animate-pulse"></div>
                        <div className="h-12 w-12 rounded-lg bg-surface-container-high animate-pulse"></div>
                        <div className="h-12 w-12 rounded-lg bg-surface-container-high animate-pulse"></div>
                        <button className="h-12 px-4 rounded-lg bg-surface-container-low text-xs font-bold text-outline hover:bg-surface-container transition-colors">Browse Stock</button>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Live Preview & Save */}
                  <div className="col-span-12 lg:col-span-7">
                    <div className="sticky top-28">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Live Store Preview</h3>
                        <div className="flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-error/40"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-tertiary/40"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-primary/40"></span>
                        </div>
                      </div>

                      {/* Embedded Mini-Mockup (Glassmorphism + Editorial) */}
                      <div className="bg-surface-container-highest rounded-2xl p-1 shadow-2xl overflow-hidden border border-white/20">
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden min-h-[600px] flex flex-col">
                          {/* Mockup Nav */}
                          <div className="px-6 py-4 flex justify-between items-center border-b border-surface-container">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: branding.primaryColor }}></div>
                              <span className="font-headline font-bold text-xs tracking-tight uppercase" style={{ color: branding.primaryColor }}>{activeStore?.name || 'VERDANT DISTRO'}</span>
                            </div>
                            <div className="flex gap-4 text-[10px] font-bold text-outline uppercase tracking-tighter">
                              <span>Products</span>
                              <span>Orders</span>
                              <span>Support</span>
                            </div>
                          </div>

                          {/* Mockup Hero */}
                          <div className="relative h-48">
                            <img 
                              alt="Banner Preview Small" 
                              className="w-full h-full object-cover" 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzhZe7DzageO5npT5nVTOfp9fcuuy63jbbRP22oA8v4oBVr_b6KM1InOB6afuQN4pap6L-Ds4QdAFE4yTZ6dt1Ckfa095FSSTAKaktaiwmMKUQ6h6bH7VZyG3XkBItqQj5ZeowIyPULT738bP3AFr4MEbBKJnb87s6lWIb3EAM7a1jhKXIjSC1DbURubqB7tGVEmWX7ZXSe_TiKco4J-iT5hDY6bUHWizkMCyc-F6aSN3AuFCDvA_bHbBuUGHqYQ0GIjimWHy0wK4"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6" style={{ background: `linear-gradient(to top, ${branding.primaryColor}E6, transparent)`}}>
                              <div className="text-white">
                                <h4 className="text-2xl font-extrabold leading-tight">Nature's Precision,<br/>Delivered.</h4>
                                <button className="mt-3 px-4 py-1.5 bg-white rounded-sm font-bold text-[10px] uppercase shadow-sm" style={{ color: branding.primaryColor }}>Shop Catalog</button>
                              </div>
                            </div>
                          </div>

                          {/* Mockup Content */}
                          <div className="p-6 flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden group">
                                  <img alt="Product 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWiqcH4Mh_2oeZrTQ3EUAQhPisaJZsuDjPYp77Y03c8gG5cgAPMPqHfV4tuL_6vgjI98_apOnqG4jq3-Xk_iR6LmGoX_kPekA1JTvwcTX2wcW6vF40APkaxQYfkc1z5tTJZyPymG0t_kNcyuMY8xq7ns5wR7r5ZxBPM5FodT6zUJXB_woRc_Kf-RfEEhCbjgXssTT5PI9TZv5_cvZkGKi7AqCfBa-ELrrLDLIeG2gbSd_DIIi92yxc3fddmCtKwrgBl27ppOs_ZE"/>
                                </div>
                                <div className="h-2 w-3/4 bg-surface-container rounded-full"></div>
                                <div className="h-2 w-1/2 bg-surface-container-low rounded-full"></div>
                              </div>
                              <div className="space-y-2">
                                <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden">
                                  <img alt="Product 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj5MF_E27NRDsCiyDdtQWoBfIdUs2HIoG0c-9znDkjb--EsMR-Rx91a53IaMq_y3kezRBdIz0ts7pC72ehYhv8VW8Ue2o_A6Spq-uyYcWGw48kvZcz-jub9Eh_wqQOMep_bcb2pAX7qPCN9JdiYNDj82sCOsfokeX2DFId9JJOy_IojvxygYyDOkYUQgsAt1czk0pggm5CcM14j3MjpQFQjWorBRbM5K_OG0FhqVMDi_J6-EZs8jVGWVytN3ZBc_o-61zHp1B98eQ"/>
                                </div>
                                <div className="h-2 w-3/4 bg-surface-container rounded-full"></div>
                                <div className="h-2 w-1/2 bg-surface-container-low rounded-full"></div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${branding.primaryColor}1A`, border: `1px solid ${branding.primaryColor}33` }}>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${branding.primaryColor}33` }}>
                                <span className="material-symbols-outlined text-sm" style={{ color: branding.primaryColor }}>bolt</span>
                              </div>
                              <div className="flex-1">
                                <div className="h-2 w-1/2 rounded-full mb-1" style={{ backgroundColor: `${branding.primaryColor}33` }}></div>
                                <div className="h-2 w-full rounded-full" style={{ backgroundColor: `${branding.primaryColor}1A` }}></div>
                              </div>
                            </div>
                          </div>

                          {/* Preview Badge */}
                          <div className="bg-surface-container text-center py-2">
                            <p className="text-[9px] font-bold text-outline uppercase tracking-widest">Interactive Preview Mode</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex items-center justify-end gap-4">
                        <button className="px-6 py-3 text-sm font-bold text-outline hover:text-on-surface transition-colors uppercase tracking-widest">Descargar Cambios</button>
                        <button 
                          onClick={handleUpdateBranding} 
                          disabled={isUpdating}
                          className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-md font-bold text-sm shadow-xl hover:opacity-90 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
                        >
                          {isUpdating ? 'Actualizando...' : 'Publicar Tienda'}
                        </button>
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

      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm text-white animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-[#286652]' : 'bg-error'}`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.message}
        </div>
      )}

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
      {/* EDIT PRICE MODAL */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/10 animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-primary/[0.02]">
              <h3 className="font-headline text-xl font-black text-on-surface tracking-tighter uppercase">Fijar Precio</h3>
              <button onClick={() => setShowEditProductModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 hover:text-error transition-all">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleEditProductPrice} className="p-8 space-y-6">
               <div className="space-y-4 text-center">
                 <p className="font-black text-on-surface text-lg">{editingProduct.name}</p>
                 <div className="flex items-center justify-center gap-4 text-xs font-bold text-on-surface-variant/60 bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                   {editingProduct.minPrice && <span>Mínimo: ${editingProduct.minPrice}</span>}
                   {editingProduct.maxPrice && <span>Máximo: ${editingProduct.maxPrice}</span>}
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Precio de Venta (Público)</label>
                 <div className="relative">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-on-surface-variant/40">$</span>
                   <input 
                     required 
                     type="number" 
                     step="0.01" 
                     value={editingProduct.basePrice} 
                     onChange={e => setEditingProduct({...editingProduct, basePrice: parseFloat(e.target.value)})} 
                     className={`w-full bg-surface-container border pl-10 pr-5 py-4 ${editPriceError ? 'border-error/50 focus:ring-error/20' : 'border-outline-variant/30 focus:ring-primary/10'} rounded-2xl text-lg font-black text-primary focus:ring-4 outline-none transition-all`} 
                     placeholder="0.00" 
                   />
                 </div>
                 {editPriceError && <p className="text-[10px] font-bold text-error px-1 mt-1">{editPriceError}</p>}
               </div>
               
               <div className="pt-4">
                 <button disabled={isUpdating} type="submit" className="w-full py-4 bg-on-surface text-surface rounded-[20px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-xl disabled:opacity-50">
                    {isUpdating ? 'GUARDANDO...' : 'GUARDAR PRECIO'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Drawer */}
      {isInvoiceDrawerOpen && selectedInvoiceOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsInvoiceDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest h-full shadow-2xl animate-in fade-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Factura de Orden</h3>
                <p className="text-xs text-on-surface-variant font-mono mt-1">#ORD-{selectedInvoiceOrder.id.toString().padStart(4, '0')}</p>
              </div>
              <button onClick={() => setIsInvoiceDrawerOpen(false)} className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Company Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold text-lg">{activeStore?.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{activeStore?.subdomain}.superozono.com</p>
                </div>
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">store</span>
                  </div>
                )}
              </div>

              <div className="h-px w-full bg-outline-variant/10"></div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Facturado a:</p>
                  <p className="font-bold text-on-surface">{selectedInvoiceOrder.buyerEmail || 'Invitado'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Fecha:</p>
                  <p className="font-medium text-on-surface">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Detalle de Compra</p>
                <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-4 py-2 font-bold text-on-surface-variant">Producto</th>
                        <th className="px-4 py-2 font-bold text-on-surface-variant text-right">Cant.</th>
                        <th className="px-4 py-2 font-bold text-on-surface-variant text-right">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {selectedInvoiceOrder.items?.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-medium text-on-surface">{item.productName || `Item #${item.productId}`}</td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-mono">${item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      {(!selectedInvoiceOrder.items || selectedInvoiceOrder.items.length === 0) && (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-on-surface-variant opacity-60">Detalles no disponibles en esta orden.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-4 border-t border-outline-variant/10">
                <div className="w-1/2 space-y-2 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${(selectedInvoiceOrder.totalPrice * 0.84).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>IVA (16%)</span>
                    <span>${(selectedInvoiceOrder.totalPrice * 0.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-on-surface pt-2 border-t border-outline-variant/10">
                    <span>Total</span>
                    <span>${selectedInvoiceOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low">
              <button 
                onClick={() => {
                  showToast("Descargando PDF...", "success");
                  // PDF downloading logic goes here
                  window.print(); // Quick hack for PDF download dialog
                }} 
                className="w-full py-3 bg-[#1a1c1d] hover:bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
