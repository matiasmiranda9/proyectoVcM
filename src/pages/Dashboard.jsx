import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Plus,
  ClipboardList,
  Clock3,
  Activity,
  CircleCheck,
  UsersRound,
  Sparkles,
  ArrowUpRight,
  CircleHelp,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { getMetrics, STATUSES } from '../lib/domain';
import { PageHeading, RequestsTable, EmptyState } from '../components/UI';

export function MetricCards({ requests }) {
  const metrics = getMetrics(requests);
  const cards = [
    {
      label: 'Solicitudes totales',
      value: metrics.total,
      icon: ClipboardList,
      color: 'teal',
      detail: 'Todas las evaluaciones',
      to: '/solicitudes',
    },
    {
      label: 'Pendientes',
      value: metrics.pending,
      icon: Clock3,
      color: 'amber',
      detail: 'Por iniciar evaluación',
      to: '/solicitudes?estado=Pendiente',
    },
    {
      label: 'En evaluación',
      value: metrics.inProgress,
      icon: Activity,
      color: 'blue',
      detail: 'Procesos en curso',
      to: '/solicitudes?estado=En%20evaluaci%C3%B3n',
    },
    {
      label: 'Completadas',
      value: metrics.completed,
      icon: CircleCheck,
      color: 'green',
      detail: 'Procesos finalizados',
      to: '/solicitudes?estado=Completada',
    },
  ];
  return (
    <div className="row g-3 metric-grid">
      {cards.map(({ icon: Icon, ...card }) => (
        <div className="col-6 col-xl-3" key={card.label}>
          <Link className="metric-card" to={card.to}>
            <div className="metric-card-top">
              <span>{card.label}</span>
              <span className={`metric-icon ${card.color}`}>
                <Icon size={19} />
              </span>
            </div>
            <strong>{card.value.toString().padStart(2, '0')}</strong>
            <div className="metric-card-bottom">
              <span>{card.detail}</span>
              <ArrowUpRight size={15} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export function Distribution({ requests }) {
  const counts = STATUSES.map(
    (status) => requests.filter((request) => request.status === status).length,
  );
  const colors = ['#e4b76b', '#6187b4', '#318b7c', '#c2cbd0'];
  let cursor = 0;
  const stops = counts.map((count, index) => {
    const start = cursor;
    cursor += requests.length ? (count / requests.length) * 100 : 0;
    return `${colors[index]} ${start}% ${cursor}%`;
  });
  return (
    <div className="distribution">
      <div
        className="donut"
        role="img"
        aria-label={`Distribución: ${STATUSES.map((status, index) => `${counts[index]} ${status.toLowerCase()}`).join(', ')}`}
        style={{
          background: requests.length
            ? `conic-gradient(${stops.join(',')})`
            : '#e8edf0',
        }}
      >
        <div>
          <strong>{requests.length}</strong>
          <span>solicitudes</span>
        </div>
      </div>
      <div className="chart-legend">
        {STATUSES.map((status, index) => (
          <Link
            to={`/solicitudes?estado=${encodeURIComponent(status)}`}
            key={status}
          >
            <span
              className="legend-dot"
              style={{ background: colors[index] }}
            />
            <span>{status}</span>
            <strong>{counts[index]}</strong>
            <span className="legend-percentage">
              {requests.length
                ? Math.round((counts[index] / requests.length) * 100)
                : 0}
              %
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { candidates, requests } = useProject();
  const [tab, setTab] = useState('Todas');
  const displayed = (
    tab === 'Todas'
      ? requests
      : requests.filter((request) => request.status === tab)
  ).slice(0, 5);
  return (
    <>
      <PageHeading
        eyebrow="UNA MIRADA A TU OPERACIÓN"
        title="Resumen general"
        description="Todo lo que necesitas para acompañar cada evaluación."
      >
        <Link className="btn btn-primary" to="/solicitudes/nueva">
          <Plus size={18} /> Nueva solicitud
        </Link>
      </PageHeading>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-label">
            <span /> GESTIÓN DE PERSONAS
          </span>
          <h2>El talento comienza con un buen proceso.</h2>
          <p>
            Organiza candidatos, coordina evaluaciones y da seguimiento en un
            solo lugar.
          </p>
          <Link to="/candidatos">
            Conoce a tus candidatos <ArrowRight size={15} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="art-card">
            <UsersRound size={25} />
            <span>Personas en el centro</span>
            <span className="art-line" />
            <span className="art-line short" />
          </div>
          <span className="art-spark">
            <Sparkles size={21} />
          </span>
          <span className="art-check">
            <CircleCheck size={23} />
          </span>
        </div>
      </div>
      <div className="section-label-row">
        <h2>Tu proceso, en números</h2>
        <span>
          <span className="live-dot" /> Datos de esta demostración
        </span>
      </div>
      <MetricCards requests={requests} />
      <div className="row g-4 dashboard-lower">
        <div className="col-12 col-xl-8">
          <section className="surface recent-panel">
            <div className="panel-heading">
              <div>
                <h2>Solicitudes recientes</h2>
                <p>Una vista rápida de los últimos procesos registrados.</p>
              </div>
              <Link className="text-link" to="/solicitudes">
                Ver todas <ArrowRight size={15} />
              </Link>
            </div>
            <div className="tab-row" aria-label="Filtrar solicitudes recientes">
              {['Todas', 'Pendiente', 'En evaluación'].map((value) => (
                <button
                  key={value}
                  className={`tab-button ${tab === value ? 'selected' : ''}`}
                  aria-pressed={tab === value}
                  onClick={() => setTab(value)}
                >
                  {value === 'Pendiente' ? 'Pendientes' : value}
                </button>
              ))}
            </div>
            {displayed.length ? (
              <RequestsTable
                requests={displayed}
                candidates={candidates}
                compact
              />
            ) : (
              <EmptyState />
            )}
            <div className="table-footer">
              Mostrando {displayed.length} de{' '}
              {
                requests.filter(
                  (request) => tab === 'Todas' || request.status === tab,
                ).length
              }{' '}
              solicitudes <span>Actualización local</span>
            </div>
          </section>
        </div>
        <div className="col-12 col-xl-4">
          <section className="surface distribution-panel">
            <div className="panel-heading">
              <div>
                <h2>Estado de los procesos</h2>
                <p>Distribución de tus solicitudes</p>
              </div>
              <CircleHelp size={17} className="muted-icon" aria-hidden="true" />
            </div>
            <Distribution requests={requests} />
          </section>
        </div>
      </div>
      <div className="row g-3 quick-actions">
        <div className="col-md-6">
          <Link className="quick-card" to="/candidatos/nuevo">
            <span className="quick-icon">
              <UsersRound size={22} />
            </span>
            <div>
              <h3>Construye tu base de talento</h3>
              <p>Registra un candidato para iniciar su proceso.</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="col-md-6">
          <Link className="quick-card" to="/indicadores">
            <span className="quick-icon lavender">
              <Activity size={22} />
            </span>
            <div>
              <h3>Decisiones con más contexto</h3>
              <p>Consulta el avance y la carga de evaluaciones.</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
