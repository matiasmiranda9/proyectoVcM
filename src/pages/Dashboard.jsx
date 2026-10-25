import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock3,
  Activity,
  CircleCheck,
  Waves,
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
      tone: 'teal',
      icon: ClipboardList,
      detail: 'Todas las evaluaciones',
      to: '/solicitudes',
    },
    {
      label: 'Pendientes',
      value: metrics.pending,
      tone: 'amber',
      icon: Clock3,
      detail: 'Por iniciar evaluación',
      to: '/solicitudes?estado=Pendiente',
    },
    {
      label: 'En evaluación',
      value: metrics.inProgress,
      tone: 'blue',
      icon: Activity,
      detail: 'Procesos en curso',
      to: '/solicitudes?estado=En%20evaluaci%C3%B3n',
    },
    {
      label: 'Completadas',
      value: metrics.completed,
      tone: 'green',
      icon: CircleCheck,
      detail: 'Procesos finalizados',
      to: '/solicitudes?estado=Completada',
    },
  ];

  return (
    <div className="row g-3 metric-grid">
      {cards.map(({ icon: Icon, ...card }) => (
        <div className="col-6 col-xl-3" key={card.label}>
          <Link
            className={`card metric-card metric-${card.tone} h-100 text-decoration-none`}
            to={card.to}
          >
            <div className="card-body">
              <div className="metric-heading">
                <p className="card-title mb-0">{card.label}</p>
                <span className="metric-symbol" aria-hidden="true">
                  <Icon size={20} />
                </span>
              </div>
              <strong className="fs-3">{card.value}</strong>
              <p className="card-text small text-secondary mt-2 mb-0">
                {card.detail}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export function Distribution({ requests }) {
  const barColors = [
    'state-pending',
    'state-in-progress',
    'state-completed',
    'state-cancelled',
  ];

  return (
    <div className="distribution p-3">
      <p className="text-secondary small mb-3">
        Total: {requests.length} solicitudes
      </p>
      {STATUSES.map((status, index) => {
        const count = requests.filter(
          (request) => request.status === status,
        ).length;
        const percentage = requests.length
          ? Math.round((count / requests.length) * 100)
          : 0;

        return (
          <div className="mb-3" key={status}>
            <div className="d-flex justify-content-between gap-2 small mb-1">
              <Link to={`/solicitudes?estado=${encodeURIComponent(status)}`}>
                {status}
              </Link>
              <span>
                {count} ({percentage}%)
              </span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label={status}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`progress-bar ${barColors[index]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
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
        title="Resumen general"
        description="Consulta candidatos y solicitudes de evaluación."
      >
        <Link className="btn btn-primary" to="/solicitudes/nueva">
          Nueva solicitud
        </Link>
      </PageHeading>

      <div className="welcome-panel">
        <span className="welcome-symbol" aria-hidden="true">
          <Waves size={28} />
        </span>
        <div>
          <h2 className="h6">Proyecto VcM · AquaChile</h2>
          <p className="mb-0">
            Demostración con datos ficticios. Los cambios se guardan solo en
            este navegador.
          </p>
        </div>
      </div>

      <h2 className="h5 mb-3">Resumen de solicitudes</h2>
      <MetricCards requests={requests} />

      <div className="row g-4 dashboard-lower mt-1">
        <div className="col-12 col-xl-8">
          <section className="surface recent-panel">
            <div className="panel-heading">
              <div>
                <h2>Solicitudes recientes</h2>
                <p>Últimos procesos registrados.</p>
              </div>
              <Link className="text-link" to="/solicitudes">
                Ver todas
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
              solicitudes
            </div>
          </section>
        </div>
        <div className="col-12 col-xl-4">
          <section className="surface distribution-panel">
            <div className="panel-heading">
              <div>
                <h2>Estado de los procesos</h2>
                <p>Cantidad de solicitudes por estado.</p>
              </div>
            </div>
            <Distribution requests={requests} />
          </section>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <Link className="btn btn-outline-primary" to="/candidatos/nuevo">
          Nuevo candidato
        </Link>
        <Link className="btn btn-outline-secondary" to="/indicadores">
          Ver indicadores
        </Link>
      </div>
    </>
  );
}
