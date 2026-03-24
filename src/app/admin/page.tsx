"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { storeService } from "@/services/store.service";
import { Store, User } from "@/types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showDistroModal, setShowDistroModal] = useState(false);
  const [showAdminOnlyModal, setShowAdminOnlyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  const [admins, setAdmins] = useState<User[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const totalGlobalRevenue = stores.length * 12500;

  const chartData = [
    { name: 'ENE', revenue: 4000 },
    { name: 'FEB', revenue: 3000 },
    { name: 'MAR', revenue: 5000 },
    { name: 'ABR', revenue: 4500 },
    { name: 'MAY', revenue: 6000 },
    { name: 'JUN', revenue: 5500 },
    { name: 'JUL', revenue: totalGlobalRevenue },
  ];

  const pieData = [
    { name: 'Norte', value: 400 },
    { name: 'Sur', value: 300 },
    { name: 'Centro', value: 300 },
    { name: 'Otros', value: 200 },
  ];

  const COLORS = ['#286652', '#515f74', '#8a9a5b', '#adc178'];
  
  // Combined Distributor + Store data
  const [newDistro, setNewDistro] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'ADMIN',
    storeName: '',
    subdomain: '',
    address: '',
    phone: ''
  });

  // Admin Only data (Intermediate Administrator, no store)
  const [newAdmin, setNewAdmin] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'ADMIN' 
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStoresAndAdmins = () => {
    setLoadingStores(true);
    setLoadingAdmins(true);
    
    storeService.listMyStores()
      .then(data => {
        setStores(data || []);
        setLoadingStores(false);
      })
      .catch(err => {
        console.error("Error al obtener tiendas:", err);
        setLoadingStores(false);
      });

    authService.getAdmins()
      .then(data => {
        setAdmins(data || []);
        setLoadingAdmins(false);
      })
      .catch(err => {
        console.error("Error al obtener administradores:", err);
        setLoadingAdmins(false);
      });
  };

  useEffect(() => {
    if (user?.rol === 'ROOT_ADMIN') {
      fetchStoresAndAdmins();
    }
  }, [user]);

  if (!user || user.rol !== 'ROOT_ADMIN') return null;

  const totalStores = stores.length;
  const totalAdminsCount = admins.filter(a => a.role === 'ADMIN').length;

  const handleCreateDistroWithStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      // 1. Create User Profile
      const adminResp = await authService.createAdmin({
        firstName: newDistro.firstName,
        lastName: newDistro.lastName,
        email: newDistro.email,
        password: newDistro.password,
        role: 'ADMIN' 
      });

      // 2. Create Store for the Distributor
      await storeService.createStore({
        name: newDistro.storeName,
        subdomain: newDistro.subdomain,
        address: newDistro.address,
        phone: newDistro.phone
      });

      const token = adminResp?.id || "token-" + Math.random().toString(36).substr(2, 5);
      const link = `${window.location.origin}/auth/invitation?token=${token}`;
      
      setGeneratedLink(link);
      setSuccessTitle("¡Distribuidor y Tienda Creados!");
      setShowDistroModal(false);
      setShowSuccessModal(true);
      showToast("Distribuidor con tienda registrado", "success");
      
      setNewDistro({ 
        firstName: '', lastName: '', email: '', password: '', role: 'ADMIN',
        storeName: '', subdomain: '', address: '', phone: ''
      });
      fetchStoresAndAdmins();
    } catch (error: any) {
      console.error("Error creating distro/store:", error);
      const errorMsg = error.response?.data?.message || "Error al procesar el registro del distribuidor";
      showToast(errorMsg, "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAdminOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const resp = await authService.createAdmin(newAdmin as {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
        role: 'ADMIN';
      });
      const token = resp?.id || "admin-token-" + Math.random().toString(36).substr(2, 5);
      const link = `${window.location.origin}/auth/invitation?token=${token}`;
      
      setGeneratedLink(link);
      setSuccessTitle("¡Administrador Creado!");
      setShowAdminOnlyModal(false);
      setShowSuccessModal(true);
      showToast("Nuevo nivel administrativo registrado", "success");
      
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '', role: 'ADMIN' });
      fetchStoresAndAdmins();
    } catch (error: any) {
      console.error("Error creating admin only:", error);
      const errorMsg = error.response?.data?.message || "Error al crear administrador";
      showToast(errorMsg, "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface relative overflow-hidden font-sans text-on-surface">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col shadow-2xl z-50 transition-transform duration-500 ease-spring lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            <Link href="/">
              <h1 className="font-headline text-2xl font-black text-primary tracking-tighter">SuperOzono</h1>
            </Link>
            <p className="text-[10px] text-on-surface-variant mt-1 font-black tracking-[0.2em] uppercase opacity-70">Control Global</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <button onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === "overview" ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}>
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-sm font-black tracking-tight">Vista Global</span>
          </button>
        </nav>
        <div className="p-6 border-t border-outline-variant/10">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-surface-container-low mb-4 shadow-sm border border-outline-variant/5">
            <div className="w-12 h-12 rounded-2xl bg-error text-on-error flex items-center justify-center font-black text-xl shadow-inner">
              {user.nombre.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-on-surface leading-tight truncate">{user.nombre}</p>
              <p className="text-[10px] text-error font-black tracking-widest uppercase opacity-80 truncate">{user.rol === 'ROOT_ADMIN' ? 'SUPER ADMIN' : 'ADMINISTRADOR'}</p>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 py-4 bg-surface-container-lowest text-error rounded-2xl font-black text-[10px] tracking-widest uppercase border border-error/20 hover:bg-error/5 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 space-y-12 bg-surface">
        <header className="flex flex-col gap-8 relative z-10">
          <div className="flex justify-between items-center w-full">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl text-on-surface shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
               <span className="text-[10px] font-black text-primary tracking-widest uppercase">Sistema en TIEMPO REAL</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
              <h2 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter leading-[0.9]">Panel de Control.</h2>
              <p className="text-on-surface-variant text-lg font-medium opacity-60">Gestión de la red jerárquica de tiendas y administradores.</p>
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <button onClick={() => setShowAdminOnlyModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-3xl text-xs font-black tracking-widest uppercase shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">key</span> NUEVO ADMIN
              </button>
              <button onClick={() => setShowDistroModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-on-surface text-surface rounded-3xl text-xs font-black tracking-widest uppercase shadow-2xl hover:scale-105 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">person_add</span> DISTRIBUIDOR
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative group">
            <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-60">Ventas Proyectadas</p>
            <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">$37,500</h3>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative group">
            <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">storefront</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-60">Tiendas Activas</p>
            <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">{totalStores}</h3>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative group">
            <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-tertiary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">group</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-60">Distribuidores</p>
            <h3 className="font-headline text-4xl font-black text-on-surface tracking-tighter">{totalAdminsCount}</h3>
          </div>
        </div>

        {/* Futuristic Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Main Sales Area Chart */}
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-xl font-black text-on-surface uppercase tracking-tight">Crecimiento de Red</h4>
                <p className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase mt-1">Estimado de Ventas Brutas Mensuales</p>
              </div>
              <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">+12.5%</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="revenue" 
                    stroke="#286652" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden relative">
             <div className="mb-10">
                <h4 className="text-xl font-black text-on-surface uppercase tracking-tight">Distribución Geográfica/Roles</h4>
                <p className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase mt-1">Balance de Jerarquía Administrativa</p>
             </div>
             <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-8 mt-4">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Global Stores Table */}
        <section className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-lg overflow-hidden relative z-10">
          <div className="p-8 border-b border-outline-variant/5">
            <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight uppercase">Distribuidores & Tiendas Públicas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                <tr>
                  <th className="px-8 py-5 text-left font-black">Identidad</th>
                  <th className="px-8 py-5 text-left font-black">Contacto</th>
                  <th className="px-8 py-5 text-left font-black">Estado</th>
                  <th className="px-8 py-5 text-right font-black">Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {loadingStores ? (
                  <tr><td colSpan={4} className="p-20 text-center text-on-surface-variant font-bold">Cargando red...</td></tr>
                ) : stores.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-on-surface-variant font-bold opacity-50">No hay tiendas bajo este mando.</td></tr>
                ) : stores.map(store => (
                  <tr key={store.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shadow-inner">
                          <span className="material-symbols-outlined text-primary">store</span>
                        </div>
                        <div>
                          <p className="font-black text-on-surface text-lg leading-tight">{store.name}</p>
                          <p className="text-xs text-on-surface-variant font-bold opacity-60 italic">{store.subdomain}.superozono.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-on-surface">{store.phone || 'N/A'}</p>
                      <p className="text-[10px] text-on-surface-variant opacity-40 font-bold truncate max-w-[150px]">{store.address}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${store.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant/60'}`}>
                        {store.status === 'ACTIVE' ? 'Activa' : 'Pausada'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => {
                          const link = `https://${store.subdomain}.superozono.com`;
                          navigator.clipboard.writeText(link);
                          showToast("Link de tienda copiado", "success");
                        }}
                        className="p-3 text-primary hover:bg-primary/10 rounded-2xl transition-all"
                        title="Copiar Link Público"
                      >
                        <span className="material-symbols-outlined text-xl">link</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Directory Table */}
        <section className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-lg overflow-hidden relative z-10">
          <div className="p-8 border-b border-outline-variant/5">
            <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight uppercase">Jerarquía Administrativa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-outline-variant/5">
                {loadingAdmins ? (
                  <tr><td className="p-20 text-center text-on-surface-variant font-bold">Consultando red...</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td className="p-20 text-center text-on-surface-variant font-bold opacity-50">Sin administradores registrados.</td></tr>
                ) : admins.map(adm => (
                  <tr key={adm.id} className="hover:bg-secondary/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant/10 flex items-center justify-center font-black text-xl text-on-surface shadow-md">
                          {adm.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black text-on-surface text-lg leading-tight">{adm.firstName} {adm.lastName}</p>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] ${adm.role === 'ROOT_ADMIN' ? 'bg-error text-on-error' : 'bg-on-surface text-surface'}`}>
                              {adm.role === 'ROOT_ADMIN' ? 'SUPER ADMIN' : 'ADMINISTRADOR'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant font-bold opacity-40">{adm.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${adm.active ? 'border-primary/20 text-primary' : 'border-error/20 text-error animate-pulse'}`}>
                         {adm.active ? 'Verificado' : 'Invitación Enviada'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {!adm.active && (
                        <button 
                          onClick={() => {
                            const link = `${window.location.origin}/auth/invitation?token=${adm.id}`;
                            navigator.clipboard.writeText(link);
                            showToast("Invitación copiada", "success");
                          }}
                          className="px-4 py-2 bg-on-surface/5 hover:bg-on-surface hover:text-surface rounded-xl text-[10px] font-black tracking-widest uppercase transition-all"
                        >
                          Recuperar Link
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[48px] shadow-2xl overflow-hidden border border-outline-variant/30 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-8">
              <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto ring-8 ring-primary/5">
                <span className="material-symbols-outlined text-primary text-5xl">verified</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-headline text-3xl font-black text-on-surface tracking-tighter leading-none uppercase">{successTitle}</h4>
                <p className="text-sm text-on-surface-variant font-bold opacity-60">Operación completada con éxito.</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 text-left px-2">Link de Invitación / Acceso</p>
                <div className="bg-surface-container rounded-[24px] p-5 flex items-center gap-4 border-2 border-primary/10 shadow-inner">
                  <p className="text-xs font-mono font-black text-primary truncate flex-1 tracking-tight">{generatedLink}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      showToast("Enlace copiado", "success");
                    }}
                    className="p-4 bg-on-surface text-surface rounded-2xl hover:bg-primary transition-all active:scale-90 shadow-lg"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => { setShowSuccessModal(false); setGeneratedLink(""); }}
                className="w-full py-5 bg-on-surface text-surface rounded-[24px] font-black text-sm tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-95"
              >
                FINALIZAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL: NUEVO ADMIN SOLAMENTE */}
      {showAdminOnlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden border border-outline-variant/10 animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-outline-variant/10 flex justify-between items-center bg-primary/[0.02]">
              <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Crear Administrador</h3>
              <button onClick={() => setShowAdminOnlyModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 hover:text-error transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateAdminOnly} className="p-10 space-y-6">
               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-[10px] font-bold text-primary opacity-80 leading-tight uppercase tracking-tight">Este usuario no gestiona tiendas directamente. Su rol es la supervisión y creación de su propia red de distribuidores.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Nombre</label>
                    <input required type="text" value={newAdmin.firstName} onChange={e => setNewAdmin({...newAdmin, firstName: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Apellido</label>
                    <input required type="text" value={newAdmin.lastName} onChange={e => setNewAdmin({...newAdmin, lastName: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="..." />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Email Profesional</label>
                  <input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="admin@ozono.com" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Pass Provisional</label>
                  <input required type="text" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Admin2026!" />
               </div>
               <div className="pt-6">
                 <button disabled={isCreating} type="submit" className="w-full py-5 bg-on-surface text-surface rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-2xl disabled:opacity-50">
                    {isCreating ? 'Sincronizando...' : 'Confirmar Alta'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: NUEVO DISTRIBUIDOR + TIENDA (Unified) */}
      {showDistroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-outline-variant/10">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">Alta de Distribuidor con Tienda</h3>
              <button onClick={() => setShowDistroModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 hover:text-error transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateDistroWithStore} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* User Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Perfil del Distribuidor</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Nombre</label>
                      <input required type="text" value={newDistro.firstName} onChange={e => setNewDistro({...newDistro, firstName: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Apellido</label>
                      <input type="text" value={newDistro.lastName} onChange={e => setNewDistro({...newDistro, lastName: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Email Corporativo</label>
                    <input required type="email" value={newDistro.email} onChange={e => setNewDistro({...newDistro, email: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="distro@tienda.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Password Provisional</label>
                    <input required type="text" value={newDistro.password} onChange={e => setNewDistro({...newDistro, password: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Global2026!" />
                  </div>
                </div>

                {/* Store Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary">storefront</span>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Configuración de Tienda</h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Nombre Comercial</label>
                    <input required type="text" value={newDistro.storeName} onChange={e => setNewDistro({...newDistro, storeName: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all" placeholder="Ej: SuperOzono Cali" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Subdominio Único</label>
                    <div className="relative">
                      <input required type="text" value={newDistro.subdomain} onChange={e => setNewDistro({...newDistro, subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all pr-32" placeholder="cali-centro" />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-secondary opacity-40 uppercase tracking-widest">.superozono</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Dirección</label>
                      <input required type="text" value={newDistro.address} onChange={e => setNewDistro({...newDistro, address: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all" placeholder="Av 5..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Teléfono</label>
                      <input required type="tel" value={newDistro.phone} onChange={e => setNewDistro({...newDistro, phone: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all" placeholder="300..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-outline-variant/5 flex justify-end gap-6">
                <button type="button" onClick={() => setShowDistroModal(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-2xl transition-all">Cancelar</button>
                <button disabled={isCreating} type="submit" className="px-12 py-5 bg-on-surface text-surface rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                  {isCreating ? 'ASIGNANDO...' : 'REGISTRAR DISTRIBUIDOR'}
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
