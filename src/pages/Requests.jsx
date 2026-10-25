import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Plus,
  SlidersHorizontal,
  ArrowRight,
  ClipboardCheck,
  Info,
  UserRound,
  CalendarDays,
  BriefcaseBusiness,
  Flag,
  Check,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import {
  filterRequests,
  STATUSES,
  PRIORITIES,
  allowedTransitions,
} from '../lib/domain';
import {
  PageHeading,
  RequestsTable,
  SearchInput,
  EmptyState,
  Field,
  StatusBadge,
  formatDate,
} from '../components/UI';
import NotFound from './NotFound';

export default function Requests() {
  const { requests, candidates } = useProject();
  const [params, setParams] = useSearchParams();
  const search = params.get('buscar') || '';
  const status = params.get('estado') || '';
  const priority = params.get('prioridad') || '';
  const setFilter = (key, value) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  const filtered = filterRequests(requests, candidates, {
    search,
    status,
    priority,
  });
  return (
    <>
      <PageHeading
        title="Solicitudes de evaluación"
        description="Coordina cada proceso, desde la solicitud hasta su cierre."
      >
        <Link className="btn btn-primary" to="/solicitudes/nueva">
          <Plus size={18} /> Nueva solicitud
        </Link>
      </PageHeading>
      <section className="surface">
        <div className="panel-heading">
          <div>
            <h2>
              Todos los procesos{' '}
              <span className="count-pill">{requests.length}</span>
            </h2>
            <p>Consulta candidatos, responsables y estados en un solo lugar.</p>
          </div>
          <SlidersHorizontal size={20} className="muted-icon" />
        </div>
        <div className="filter-toolbar">
          <SearchInput
            value={search}
            onChange={(value) => setFilter('buscar', value)}
          />
          <select
            className="form-select filter-select"
            aria-label="Filtrar por estado"
            value={status}
            onChange={(event) => setFilter('estado', event.target.value)}
          >
            <option value="">Todos los estados</option>
            {STATUSES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            className="form-select filter-select"
            aria-label="Filtrar por prioridad"
            value={priority}
            onChange={(event) => setFilter('prioridad', event.target.value)}
          >
            <option value="">Todas las prioridades</option>
            {PRIORITIES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          {(search || status || priority) && (
            <button
              className="btn btn-link clear-filters"
              onClick={() => setParams({})}
            >
              Limpiar
            </button>
          )}
        </div>
        {filtered.length ? (
          <RequestsTable requests={filtered} candidates={candidates} />
        ) : (
          <EmptyState />
        )}
        <div className="table-footer" aria-live="polite">
          Mostrando {filtered.length} de {requests.length} solicitudes
          <span>Seguimiento de demostración</span>
        </div>
      </section>
      <div className="inline-note">
        <Info size={17} />
        <span>
          Los cambios se conservan en este navegador. No se envían correos ni se
          generan informes psicolaborales reales.
        </span>
      </div>
    </>
  );
}

export function RequestForm() {
  const { candidates, addRequest } = useProject();
  const [params] = useSearchParams();
  const selected = candidates.find(
    (candidate) => candidate.id === params.get('candidato'),
  );
  const [values, setValues] = useState({
    candidateId: selected?.id || '',
    position: selected?.position || '',
    evaluator: '',
    dueDate: '',
    priority: 'Normal',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === 'candidateId'
        ? {
            position:
              candidates.find((candidate) => candidate.id === value)
                ?.position || '',
          }
        : {}),
    }));
  };
  const submit = (event) => {
    event.preventDefault();
    const result = addRequest(values);
    if (result.errors) {
      setErrors(result.errors);
      document.getElementById(Object.keys(result.errors)[0])?.focus();
    } else navigate(`/solicitudes/${result.id}`);
  };
  return (
    <>
      <PageHeading
        title="Nueva solicitud"
        description="Define quién será evaluado y cómo se coordinará el proceso."
        back={{ to: '/solicitudes', label: 'Volver a solicitudes' }}
      />
      <div className="row g-4">
        <div className="col-lg-8">
          <form className="surface form-panel" onSubmit={submit} noValidate>
            <div className="panel-heading">
              <div>
                <h2>Datos de la evaluación</h2>
                <p>Los campos con * son obligatorios.</p>
              </div>
              <span className="step-label">02 / SOLICITUD</span>
            </div>
            <div className="form-body">
              <div className="row g-4">
                <div className="col-12">
                  <Field
                    name="candidateId"
                    label="Candidato"
                    error={errors.candidateId}
                  >
                    {(props) => (
                      <select
                        {...props}
                        className={`form-select ${errors.candidateId ? 'is-invalid' : ''}`}
                        value={values.candidateId}
                        onChange={change}
                      >
                        <option value="">
                          Selecciona un candidato registrado
                        </option>
                        {candidates.map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>
                            {candidate.fullName} · {candidate.id}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Link className="field-link" to="/candidatos/nuevo">
                    ¿Aún no está registrado? Crear candidato{' '}
                    <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="col-md-6">
                  <Field
                    name="position"
                    label="Cargo a evaluar"
                    error={errors.position}
                  >
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                        value={values.position}
                        onChange={change}
                        maxLength={100}
                        placeholder="Ej. Analista de calidad"
                      />
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    name="evaluator"
                    label="Evaluador responsable"
                    error={errors.evaluator}
                  >
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.evaluator ? 'is-invalid' : ''}`}
                        value={values.evaluator}
                        onChange={change}
                        maxLength={100}
                        placeholder="Nombre ficticio del profesional"
                        list="evaluators"
                      />
                    )}
                  </Field>
                  <datalist id="evaluators">
                    <option value="Daniela Pérez" />
                    <option value="Martín Herrera" />
                  </datalist>
                </div>
                <div className="col-md-6">
                  <Field
                    name="dueDate"
                    label="Fecha objetivo"
                    error={errors.dueDate}
                    hint="Fecha prevista para finalizar el proceso."
                  >
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                        value={values.dueDate}
                        onChange={change}
                        type="date"
                      />
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    name="priority"
                    label="Prioridad"
                    error={errors.priority}
                  >
                    {(props) => (
                      <select
                        {...props}
                        className="form-select"
                        value={values.priority}
                        onChange={change}
                      >
                        {PRIORITIES.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                <div className="col-12">
                  <Field
                    name="notes"
                    label="Observaciones de coordinación"
                    required={false}
                    hint="Solo información del proceso. No incluyas antecedentes personales ni resultados clínicos."
                  >
                    {(props) => (
                      <textarea
                        {...props}
                        className="form-control"
                        rows={3}
                        value={values.notes}
                        onChange={change}
                        maxLength={500}
                        placeholder="Ej. Coordinar entrevista durante la mañana."
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <span>Estado inicial: Pendiente</span>
              <Link className="btn btn-light" to="/solicitudes">
                Cancelar
              </Link>
              <button className="btn btn-primary" type="submit">
                Crear solicitud <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-4">
          <aside className="info-card">
            <ClipboardCheck size={28} />
            <h2>Un proceso trazable</h2>
            <p>
              La solicitud conecta al candidato con su evaluador y una fecha
              objetivo.
            </p>
            <ol className="process-mini">
              <li>
                <span>1</span>
                <div>
                  <strong>Pendiente</strong>
                  <small>Solicitud registrada</small>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>En evaluación</strong>
                  <small>Entrevista y seguimiento</small>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Completada</strong>
                  <small>Cierre del proceso</small>
                </div>
              </li>
            </ol>
            <p className="small mb-0">
              Esta operación es simulada y se guarda localmente. No asigna
              tareas ni notifica al profesional.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

export function RequestDetail() {
  const { id } = useParams();
  const { requests, candidates, updateStatus } = useProject();
  const request = requests.find((item) => item.id === id);
  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  if (!request) return <NotFound />;
  const candidate = candidates.find((item) => item.id === request.candidateId);
  const transitions = allowedTransitions(request.status);
  const submit = (event) => {
    event.preventDefault();
    if (!nextStatus) {
      setError('Selecciona el nuevo estado.');
      return;
    }
    const message = updateStatus(id, nextStatus, note);
    setError(message);
    if (!message) {
      setNextStatus('');
      setNote('');
    }
  };
  const details = [
    {
      label: 'Cargo a evaluar',
      value: request.position,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Evaluador responsable',
      value: request.evaluator,
      icon: UserRound,
    },
    {
      label: 'Fecha objetivo',
      value: formatDate(request.dueDate),
      icon: CalendarDays,
    },
    { label: 'Prioridad', value: request.priority, icon: Flag },
  ];
  return (
    <>
      <PageHeading
        eyebrow={`SEGUIMIENTO · ${request.id}`}
        title="Detalle de solicitud"
        description={`Creada el ${formatDate(request.createdAt)} · Proceso de demostración`}
        back={{ to: '/solicitudes', label: 'Volver a solicitudes' }}
      >
        <StatusBadge status={request.status} />
      </PageHeading>
      <div className="row g-4">
        <div className="col-lg-8">
          <section className="surface detail-summary">
            <div className="panel-heading">
              <div>
                <h2>{candidate?.fullName}</h2>
                <p>
                  {candidate?.id} · {candidate?.location}
                </p>
              </div>
              <Link
                className="text-link"
                to={`/candidatos/${request.candidateId}`}
              >
                Ver candidato <ArrowRight size={15} />
              </Link>
            </div>
            <div className="row g-4 detail-grid">
              {details.map(({ icon: Icon, ...detail }) => (
                <div className="col-sm-6" key={detail.label}>
                  <span className="detail-label">
                    <Icon size={16} />
                    {detail.label}
                  </span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="surface timeline-panel">
            <div className="panel-heading">
              <div>
                <h2>Historial del proceso</h2>
                <p>Cada cambio conserva su fecha y observación.</p>
              </div>
              <span className="count-pill">
                {request.history.length} eventos
              </span>
            </div>
            <ol className="timeline">
              {[...request.history].reverse().map((entry, index) => (
                <li key={`${entry.at}-${index}`}>
                  <span
                    className={`timeline-marker ${index === 0 ? 'current' : ''}`}
                  >
                    <Check size={13} />
                  </span>
                  <div className="timeline-heading">
                    <strong>{entry.status}</strong>
                    <time dateTime={entry.at}>
                      {formatDate(entry.at)} ·{' '}
                      {new Date(entry.at).toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Santiago',
                      })}{' '}
                      (Chile)
                    </time>
                  </div>
                  <p>{entry.note}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <div className="col-lg-4">
          <section className="surface status-form">
            <div className="panel-heading">
              <div>
                <h2>Actualizar estado</h2>
                <p>Registra el siguiente paso del proceso.</p>
              </div>
            </div>
            {transitions.length ? (
              <form onSubmit={submit} className="form-body" noValidate>
                <Field name="nextStatus" label="Nuevo estado">
                  {(props) => (
                    <select
                      {...props}
                      className="form-select"
                      value={nextStatus}
                      onChange={(event) => {
                        setNextStatus(event.target.value);
                        setError('');
                      }}
                    >
                      <option value="">Seleccionar estado</option>
                      {transitions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field
                  name="statusNote"
                  label="Observación"
                  hint="Deja una nota de al menos 5 caracteres."
                >
                  {(props) => (
                    <textarea
                      {...props}
                      className="form-control"
                      rows={4}
                      value={note}
                      maxLength={500}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="¿Qué cambió en este proceso?"
                    />
                  )}
                </Field>
                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}
                <button className="btn btn-primary w-100" type="submit">
                  Guardar cambio <ArrowRight size={17} />
                </button>
                <p className="local-save-note">
                  Actualización simulada · guardado local
                </p>
              </form>
            ) : (
              <div className="closed-state">
                <span>
                  <ClipboardCheck size={27} />
                </span>
                <h3>Proceso cerrado</h3>
                <p>
                  Esta solicitud está {request.status.toLowerCase()}. Su
                  historial se conserva para consulta.
                </p>
                <Link
                  className="text-link"
                  to={`/solicitudes/nueva?candidato=${request.candidateId}`}
                >
                  Crear otro proceso <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </section>
          <div className="inline-note">
            <Info size={18} />
            <span>
              El estado describe el avance del proceso; no representa un
              resultado de aptitud laboral.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
