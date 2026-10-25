import { useState } from 'react';
import { Waves } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';

const navigation = [
  { to: '/', label: 'Resumen general', end: true },
  { to: '/candidatos', label: 'Candidatos' },
  { to: '/solicitudes', label: 'Solicitudes' },
  { to: '/indicadores', label: 'Indicadores' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notice, setNotice, storageWarning } = useProject();

  return (
    <div className="app-layout">
      <header className="navbar navbar-expand-md navbar-dark app-navbar">
        <div className="container">
          <Link
            className="navbar-brand"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-icon" aria-hidden="true">
              <Waves size={20} />
            </span>
            AquaEval
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir navegación"
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <nav
            id="main-navigation"
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
            aria-label="Navegación principal"
          >
            <div className="navbar-nav me-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <span className="navbar-text small">Proyecto VcM · Demo</span>
          </nav>
        </div>
      </header>
      <main id="main-content" className="container main-content">
        {storageWarning && (
          <div className="alert alert-warning" role="alert">
            {storageWarning}
          </div>
        )}
        {notice && (
          <div
            className="alert alert-success d-flex align-items-center gap-3"
            role="status"
          >
            <span>{notice}</span>
            <button
              className="btn-close ms-auto"
              aria-label="Cerrar confirmación"
              onClick={() => setNotice('')}
            />
          </div>
        )}
        <Outlet />
        <footer className="content-footer">
          <span>AquaEval · Proyecto de Vinculación con el Medio</span>
          <span>
            Prototipo académico para el caso AquaChile. Datos ficticios ·
            guardado local.
          </span>
        </footer>
      </main>
    </div>
  );
}
