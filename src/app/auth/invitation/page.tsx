"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

function InvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setError("Token de invitación no válido.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authService.activateAccount(token, password);
      // Pass email to verify-otp for the next step.
      // Response from activateAccount is an ApiResponse wrapper, e.g., { data: { email: "..." } }
      const email = response?.data?.email || response?.email || "";
      router.push(`/auth/verify-otp?token=${token}&email=${email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al establecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-outline-variant/10">
        <div className="p-8 pb-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl">lock_open</span>
            </div>
          </div>
          <h1 className="font-headline text-3xl font-black text-on-surface text-center tracking-tighter mb-2">
            SuperOzono
          </h1>
          <p className="text-on-surface-variant text-center text-sm font-medium mb-8">
            Establece la contraseña para tu nueva tienda y activa tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Nueva Contraseña
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline/40"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Confirmar Contraseña
              </label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline/40"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-error text-[20px]">error</span>
                <p className="text-xs text-error font-bold">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-on-surface text-surface py-4 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-on-surface/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">key</span>
                  Confirmar Contraseña
                </>
              )}
            </button>
          </form>
        </div>
        <div className="p-8 pt-0 text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            ¿Ya tienes cuenta? {" "}
            <a href="/login" className="text-primary font-bold hover:underline">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center p-4">Cargando invitación...</div>}>
      <InvitationForm />
    </Suspense>
  );
}
