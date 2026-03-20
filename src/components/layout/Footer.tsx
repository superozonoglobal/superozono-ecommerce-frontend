import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Superozono</h3>
          <p>Innovación en cada producto.</p>
        </div>
        <div className="footer-links">
          <h4>Secciones</h4>
          <Link href="/productos">Catálogo</Link>
          <Link href="/login">Acceso Distribuidores</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Superozono. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
