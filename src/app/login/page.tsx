"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"distribuidor" | "admin">("distribuidor");
  const [email, setEmail] = useState("root@superozono.com");
  const [password, setPassword] = useState("SuperOzono2026!");
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRoleSwitch = (newRole: "distribuidor" | "admin") => {
    setRole(newRole);
    if (newRole === "admin") {
      setEmail("root@superozono.com");
      setPassword("SuperOzono2026!");
    } else {
      setEmail("distribuidor@example.com");
      setPassword("yourpassword");
    }
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleAuth = await login(email, password);
      if (!roleAuth) {
        setError("Credenciales inválidas. Verifica tu correo y contraseña.");
        setIsRedirecting(false);
      } else {
        router.push(roleAuth === 'ROOT_ADMIN' ? '/admin' : '/distribuidor');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al conectar con el servidor.";
      setError(errorMessage);
      setIsRedirecting(false);
    }
  };

  // Only hide the form briefly on initial app load if detecting session to avoid flicker
  if (isLoading || (user && !isRedirecting)) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
       <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-surface">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-fixed rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] right-[2%] w-[30%] h-[30%] bg-secondary-fixed rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 primary-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">SuperOzono</h1>
          <p className="text-on-surface-variant font-medium mt-2">Portal de Acceso</p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-xl shadow-on-surface/[0.03] border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-1">Acceso a Plataforma</h2>
            <p className="text-sm text-on-surface-variant">Ingresa tus credenciales para gestionar tu cuenta.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex p-1 bg-surface-container-low rounded-lg mb-6">
              <button 
                type="button"
                onClick={() => handleRoleSwitch("distribuidor")}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${role === "distribuidor" ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/10" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Distribuidor
              </button>
              <button 
                type="button"
                onClick={() => handleRoleSwitch("admin")}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${role === "admin" ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/10" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Admin (Root)
              </button>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">mail</span>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest text-sm transition-all placeholder:text-outline/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Contraseña</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="block w-full pl-11 pr-12 py-3 bg-surface-container-low border-transparent rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest text-sm transition-all placeholder:text-outline/50" 
                />
              </div>
            </div>

            <button disabled={isRedirecting} type="submit" className="w-full primary-gradient text-on-primary font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none">
              {isRedirecting ? "Accediendo..." : "Confirmar Identidad"}
              {!isRedirecting && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-xs text-on-surface-variant">
              Asegurado por Superozono
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
