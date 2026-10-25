import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UsersRound,
  ClipboardList,
  ChartNoAxesCombined,
  Menu,
  X,
  Waves,
  ArrowUpRight,
  Check,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const navigation = [
  { to: '/', label: 'Resumen general', icon: LayoutDashboard, end: true },
  { to: '/candidatos', label: 'Candidatos', icon: UsersRound },
  { to: '/solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { to: '/indicadores', label: 'Indicadores', icon: ChartNoAxesCombined },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notice, setNotice, storageWarning } = useProject();
  const location = useLocation();
  const section =
    navigation.find(
      (item) => item.to !== '/' && location.pathname.startsWith(item.to),
    )?.label || 'Resumen general';
  return (
    <div className="app-layout">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-symbol">
            <Waves size={26} />
          </span>
          <span>
            Aqua<span className="brand-light">Eval</span>
            <small>PERSONAS & TALENTO</small>
          </span>
        </Link>
        <button
          className="sidebar-close icon-button"
          aria-label="Cerrar navegación"
          onClick={() => setMenuOpen(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-label">ESPACIO DE TRABAJO</div>
        <nav aria-label="Navegación principal">
          {navigation.map(({ icon: Icon, ...item }) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {item.to === '/solicitudes' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="project-note">
            <span className="project-note-icon">
              <ShieldCheck size={20} />
            </span>
            <strong>Un proceso más claro.</strong>
            <p>Conecta cada etapa de la evaluación de talento.</p>
            <Link to="/solicitudes" onClick={() => setMenuOpen(false)}>
              Explorar solicitudes <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="sidebar-footer">
            <span className="connection-dot" /> Entorno de demostración{' '}
            <span>v1.0</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu icon-button"
              aria-label="Abrir navegación"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb-root">Espacio de trabajo</span>
            <ChevronRight size={14} />
            <span>{section}</span>
          </div>
          <div className="topbar-right">
            <span className="academic-tag">PROYECTO VcM</span>
            <div className="user-divider" />
            <span className="user-avatar">EC</span>
            <div className="user-info">
              <strong>Equipo de selección</strong>
              <span>Vista de coordinación · Demo</span>
            </div>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {storageWarning && (
            <div className="alert alert-warning" role="alert">
              {storageWarning}
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              <Check size={18} />
              <span>{notice}</span>
              <button
                className="icon-button"
                aria-label="Cerrar confirmación"
                onClick={() => setNotice('')}
              >
                <X size={17} />
              </button>
            </div>
          )}
          <Outlet />
          <footer className="content-footer">
            <span>
              AquaEval <span>·</span> Vinculación con el Medio
            </span>
            <span>
              Prototipo académico para el caso AquaChile. Datos ficticios ·
              guardado local.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
