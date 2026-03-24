import type { Metadata } from "next";
import "./globals.css";
import RouteLayout from "@/components/layout/RouteLayout";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Initializer from "@/components/providers/Initializer";

export const metadata: Metadata = {
  title: "SuperOzono - Tienda Oficial",
  description: "La mejor tecnología en ozono para tu hogar y negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..900&family=Manrope:wght@400..800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface">
        <AuthProvider>
          <CartProvider>
            <Initializer />
            <RouteLayout>
              {children}
            </RouteLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
