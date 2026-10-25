import { Link } from 'react-router-dom';
import { ArrowRight, ChartNoAxesCombined } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { PageHeading } from '../components/UI';
import { MetricCards, Distribution } from './Dashboard';

export default function Indicators() {
  const { requests } = useProject();
  const evaluators = [...new Set(requests.map((request) => request.evaluator))];
  const completed = requests.filter(
    (request) => request.status === 'Completada',
  ).length;
  const rate = requests.length
    ? Math.round((completed / requests.length) * 100)
    : 0;
  return (
    <>
      <PageHeading
        title="Indicadores"
        description="Consulta el avance de las solicitudes y la carga por evaluador."
      />
      <MetricCards requests={requests} />
      <div className="row g-4 mt-1">
        <div className="col-lg-5">
          <section className="surface">
            <div className="panel-heading">
              <div>
                <h2>Distribución por estado</h2>
                <p>Incluye todos los procesos registrados.</p>
              </div>
              <ChartNoAxesCombined size={20} className="muted-icon" />
            </div>
            <Distribution requests={requests} />
          </section>
        </div>
        <div className="col-lg-7">
          <section className="surface">
            <div className="panel-heading">
              <div>
                <h2>Carga por evaluador</h2>
                <p>Solicitudes pendientes y en evaluación asignadas.</p>
              </div>
            </div>
            <div className="workload-list">
              {evaluators.map((evaluator) => {
                const assigned = requests.filter(
                  (request) => request.evaluator === evaluator,
                );
                const active = assigned.filter((request) =>
                  ['Pendiente', 'En evaluación'].includes(request.status),
                ).length;
                return (
                  <div className="workload-item" key={evaluator}>
                    <div>
                      <strong>{evaluator}</strong>
                      <span>
                        {active} activas <span>·</span> {assigned.length} en
                        total
                      </span>
                    </div>
                    <div
                      className="workload-track"
                      role="img"
                      aria-label={`${evaluator}: ${active} de ${assigned.length} solicitudes activas`}
                    >
                      <span
                        style={{
                          width: `${assigned.length ? (active / assigned.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {!evaluators.length && (
                <p>No hay evaluadores con solicitudes registradas.</p>
              )}
            </div>
            <div className="completion-summary">
              <span className="completion-number">{rate}%</span>
              <div>
                <strong>de solicitudes completadas</strong>
                <p>
                  {completed} de {requests.length} solicitudes. Las canceladas
                  se incluyen en el total.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="indicator-callout">
        <div>
          <h2>Solicitudes pendientes</h2>
          <p>Revisa los procesos pendientes para coordinar su próximo paso.</p>
        </div>
        <Link className="btn btn-light" to="/solicitudes?estado=Pendiente">
          Ver pendientes <ArrowRight size={17} />
        </Link>
      </div>
    </>
  );
}
