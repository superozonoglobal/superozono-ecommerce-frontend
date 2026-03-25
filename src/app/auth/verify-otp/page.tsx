"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Por favor, ingresa el código completo de 6 dígitos.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.verifyInvitationEmail(emailParam, code);
      alert("¡Cuenta activada con éxito!");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Código de verificación incorrecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-outline-variant/10">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-secondary text-3xl">mark_email_read</span>
            </div>
          </div>
          <h1 className="font-headline text-2xl font-black text-on-surface text-center tracking-tighter mb-2">
            Verifica tu correo
          </h1>
          <p className="text-on-surface-variant text-center text-sm font-medium mb-8">
            Ingresa el código de 6 dígitos enviado a {emailParam || "tu correo"}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 px-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 bg-surface-container-low border border-outline-variant/30 rounded-xl text-center text-xl font-black text-primary focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-error text-[20px]">error_outline</span>
                <p className="text-xs text-error font-bold">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  Verificar Código
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
            <p className="text-xs text-on-surface-variant font-medium">
              ¿No recibiste nada?{" "}
              <button className="text-primary font-bold hover:underline">Reenviar código</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center p-4">Cargando verificación...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
