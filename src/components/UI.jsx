import { ArrowLeft, ArrowRight, Search, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export const formatDate = (value) => {
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);
  return Number.isNaN(date.getTime())
    ? 'Sin fecha'
    : new Intl.DateTimeFormat('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Santiago',
      }).format(date);
};
export function StatusBadge({ status }) {
  const variants = {
    Pendiente: 'pending',
    'En evaluación': 'in-progress',
    Completada: 'completed',
    Cancelada: 'cancelled',
  };
  return (
    <span className={`status-badge ${variants[status] || ''}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export function PageHeading({ eyebrow, title, description, children, back }) {
  return (
    <div className="page-heading">
      <div>
        {back && (
          <Link className="back-link" to={back.to}>
            <ArrowLeft size={15} /> {back.label}
          </Link>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}

export function EmptyState({
  title = 'No encontramos resultados',
  description = 'Prueba con otra búsqueda o cambia los filtros.',
  children,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Inbox size={27} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar por nombre, cargo o solicitud…',
  label = 'Buscar solicitudes',
}) {
  return (
    <div className="search-input">
      <Search size={18} aria-hidden="true" />
      <input
        className="form-control"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
      />
    </div>
  );
}

export function Field({ label, name, error, children, hint, required = true }) {
  return (
    <div className="field-group">
      <label className="form-label" htmlFor={name}>
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id: name,
        name,
        'aria-invalid': Boolean(error),
        'aria-describedby': error
          ? `${name}-error`
          : hint
            ? `${name}-hint`
            : undefined,
        required,
      })}
      {error && (
        <div className="field-error" id={`${name}-error`}>
          {error}
        </div>
      )}
      {!error && hint && (
        <div className="form-text" id={`${name}-hint`}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function RequestsTable({ requests, candidates, compact = false }) {
  return (
    <div className="table-responsive">
      <table className="table requests-table align-middle mb-0">
        <thead>
          <tr>
            <th>Candidato / cargo</th>
            <th>Estado</th>
            {!compact && <th>Evaluador</th>}
            <th>Fecha objetivo</th>
            <th>Prioridad</th>
            <th>
              <span className="visually-hidden">Ver solicitud</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const candidate = candidates.find(
              (item) => item.id === request.candidateId,
            );
            return (
              <tr key={request.id}>
                <td>
                  <div className="person-cell">
                    <div>
                      <Link
                        className="person-name"
                        to={`/solicitudes/${request.id}`}
                      >
                        {candidate?.fullName || 'Candidato no disponible'}
                      </Link>
                      <span className="person-meta">
                        {request.position}{' '}
                        <span className="meta-divider">·</span> {request.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <StatusBadge status={request.status} />
                </td>
                {!compact && (
                  <td className="secondary-cell">{request.evaluator}</td>
                )}
                <td className="date-cell">{formatDate(request.dueDate)}</td>
                <td>
                  <span
                    className={`priority ${request.priority === 'Alta' ? 'high' : ''}`}
                  >
                    <span />
                    {request.priority}
                  </span>
                </td>
                <td>
                  <Link
                    className="row-action"
                    to={`/solicitudes/${request.id}`}
                    aria-label={`Ver solicitud ${request.id}`}
                  >
                    <ArrowRight size={17} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
