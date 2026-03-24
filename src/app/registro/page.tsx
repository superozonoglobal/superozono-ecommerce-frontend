"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Registro() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    router.push("/distribuidor");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-surface">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-tertiary-fixed rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary-fixed rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-surface-container-highest rounded-xl flex items-center justify-center shadow-sm mb-6 border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Crear Cuenta</h1>
          <p className="text-on-surface-variant font-medium mt-2">Únete a la red de Superozono</p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-xl shadow-on-surface/[0.03] border border-outline-variant/10">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">badge</span>
                </div>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  placeholder="Juan Pérez" 
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest text-sm transition-all placeholder:text-outline/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">mail</span>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  placeholder="nombre@empresa.com" 
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest text-sm transition-all placeholder:text-outline/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  required 
                  placeholder="••••••••" 
                  className="block w-full pl-11 pr-12 py-3 bg-surface-container-low border-transparent rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest text-sm transition-all placeholder:text-outline/50" 
                />
              </div>
            </div>

            <button type="submit" className="w-full primary-gradient text-on-primary font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
              Registrarse
            </button>
            
            <p className="text-xs text-center text-on-surface-variant mt-4">
              Al registrarte, aceptas nuestros <a href="#" className="text-primary hover:underline">Términos de Servicio</a> y <a href="#" className="text-primary hover:underline">Política de Privacidad</a>.
            </p>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          ¿Ya tienes cuenta? <Link href="/login" className="font-bold text-primary hover:text-primary-container transition-colors">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
