export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <span className="text-2xl font-black text-emerald-900 font-headline mb-8 block uppercase tracking-tight">Verdant Modernist</span>
          <p className="text-on-surface-variant text-base max-w-md leading-relaxed">
            Pioneros en la intersección de la tecnología de ozono y el crecimiento orgánico. Liderando el cambio global hacia una agricultura sostenible impulsada por la precisión.
          </p>
          <div className="flex gap-6 mt-10">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">facebook</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">group</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">movie</span></a>
          </div>
        </div>
        <div>
          <h5 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-on-surface/50 mb-8">Colección</h5>
          <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Tratamiento de Agua</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Nutrición del Suelo</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Sensores y Sondas</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Venta por Mayor</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-on-surface/50 mb-8">Recursos</h5>
          <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Casos de Estudio</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Artículos de Investigación</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Informe de Sostenibilidad</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Soporte Experto</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-surface-container-low flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-outline">
        <p>© 2024 Verdant Modernist Solutions. (Superozono) Todos los derechos reservados.</p>
        <div className="flex gap-10">
          <a className="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Ajustes de Cookies</a>
        </div>
      </div>
    </footer>
  );
}
