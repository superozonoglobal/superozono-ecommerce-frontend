"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Dashboards and Auth pages should not have the public Store Header/Footer
  const isAppView = pathname?.startsWith('/admin') || 
                    pathname?.startsWith('/distribuidor') || 
                    pathname?.startsWith('/login') || 
                    pathname?.startsWith('/registro') ||
                    pathname?.startsWith('/auth') ||
                    pathname?.startsWith('/invitacion');

  return (
    <>
      {!isAppView && <Header />}
      <div className={isAppView ? "" : "flex-grow"}>
        {children}
      </div>
      {!isAppView && <Footer />}
    </>
  );
}
