import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  Mail,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  UsersRound,
  Pencil,
  Phone,
  FolderOpen,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { matchesSearch, JOB_FAMILIES } from '../lib/domain';
import {
  PageHeading,
  SearchInput,
  EmptyState,
  Field,
  RequestsTable,
  formatDate,
} from '../components/UI';
import NotFound from './NotFound';

export default function Candidates() {
  const { candidates, requests, permissions } = useProject();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const locations = [
    ...new Set(candidates.map((candidate) => candidate.location)),
  ].sort();
  const filtered = candidates.filter(
    (candidate) =>
      matchesSearch(
        `${candidate.fullName} ${candidate.email} ${candidate.position} ${candidate.id}`,
        search,
      ) &&
      (!location || candidate.location === location),
  );
  return (
    <>
      <PageHeading
        title="Candidatos"
        description="Cada persona, conectada con su proceso de evaluación."
      >
        {permissions.manageCandidates && (
          <Link className="btn btn-primary" to="/candidatos/nuevo">
            <Plus size={18} /> Nuevo candidato
          </Link>
        )}
      </PageHeading>
      <section className="surface">
        <div className="panel-heading">
          <div>
            <h2>
              Base de talento{' '}
              <span className="count-pill">{candidates.length}</span>
            </h2>
            <p>Información ficticia de los candidatos registrados.</p>
          </div>
          <UsersRound size={22} className="muted-icon" />
        </div>
        <div className="filter-toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, correo o cargo…"
            label="Buscar candidatos"
          />
          <select
            className="form-select filter-select"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            aria-label="Filtrar por sede"
          >
            <option value="">Todas las sedes</option>
            {locations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          {(search || location) && (
            <button
              className="btn btn-link clear-filters"
              onClick={() => {
                setSearch('');
                setLocation('');
              }}
            >
              Limpiar
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="table-responsive">
            <table className="table align-middle candidates-table mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cargo de interés</th>
                  <th>Sede</th>
                  <th>Solicitudes</th>
                  <th>
                    <span className="visually-hidden">Ver ficha</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="person-cell">
                        <div>
                          <Link
                            className="person-name"
                            to={`/candidatos/${candidate.id}`}
                          >
                            {candidate.fullName}
                          </Link>
                          <span className="person-meta">{candidate.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="secondary-cell">{candidate.position}</td>
                    <td className="secondary-cell">{candidate.location}</td>
                    <td>
                      <span className="count-pill">
                        {
                          requests.filter(
                            (request) => request.candidateId === candidate.id,
                          ).length
                        }
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link
                          className="row-action"
                          to={`/candidatos/${candidate.id}`}
                          aria-label={`Ver ficha de ${candidate.fullName}`}
                        >
                          <ArrowRight size={17} />
                        </Link>
                        {permissions.manageCandidates && (
                          <Link
                            className="row-action"
                            to={`/candidatos/${candidate.id}/editar`}
                            aria-label={`Editar a ${candidate.fullName}`}
                          >
                            <Pencil size={16} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
        <div className="table-footer">
          {filtered.length} de {candidates.length} candidatos
          <span>Datos de demostración</span>
        </div>
      </section>
    </>
  );
}

export function CandidateForm() {
  return <CandidateEditor />;
}

export function CandidateEdit() {
  const { id } = useParams();
  const { candidates } = useProject();
  const candidate = candidates.find((item) => item.id === id);
  if (!candidate) return <NotFound />;
  return <CandidateEditor key={candidate.id} candidate={candidate} />;
}

function CandidateEditor({ candidate }) {
  const { addCandidate, updateCandidate, permissions } = useProject();
  const navigate = useNavigate();
  const editing = Boolean(candidate);
  const [values, setValues] = useState({
    fullName: candidate?.fullName || '',
    email: candidate?.email || '',
    position: candidate?.position || '',
    location: candidate?.location || '',
    phone: candidate?.phone || '',
    family: candidate?.family || 'Por definir',
  });
  const [errors, setErrors] = useState({});
  const change = (event) =>
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = (event) => {
    event.preventDefault();
    const result = editing
      ? updateCandidate(candidate.id, values)
      : addCandidate(values);
    if (result.errors) {
      setErrors(result.errors);
      document.getElementById(Object.keys(result.errors)[0])?.focus();
    } else navigate(`/candidatos/${result.id}`);
  };
  if (!permissions.manageCandidates) {
    return (
      <section className="surface p-4">
        <h1>Registro no disponible</h1>
        <p>Tu perfil permite consultar los candidatos de tus solicitudes.</p>
        <Link to="/candidatos">Volver a candidatos</Link>
      </section>
    );
  }
  return (
    <>
      <PageHeading
        title={editing ? 'Editar candidato' : 'Nuevo candidato'}
        description={
          editing
            ? 'Actualiza los datos del candidato sin cambiar sus solicitudes anteriores.'
            : 'El primer paso para un proceso de selección ordenado.'
        }
        back={{
          to: editing ? `/candidatos/${candidate.id}` : '/candidatos',
          label: editing ? 'Volver a la ficha' : 'Volver a candidatos',
        }}
      />
      <div className="row g-4">
        <div className="col-lg-8">
          <form className="surface form-panel" onSubmit={submit} noValidate>
            <div className="panel-heading">
              <div>
                <h2>Información del candidato</h2>
                <p>Los campos con * son obligatorios.</p>
              </div>
              <span className="step-label">
                {editing ? 'DATOS DEL CANDIDATO' : '01 / REGISTRO'}
              </span>
            </div>
            <div className="form-body">
              {errors._form && (
                <div className="alert alert-danger" role="alert">
                  {errors._form}
                </div>
              )}
              <div className="row g-4">
                <div className="col-md-6">
                  <Field
                    label="Nombre completo"
                    name="fullName"
                    error={errors.fullName}
                  >
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        value={values.fullName}
                        onChange={change}
                        maxLength={100}
                        placeholder="Ej. Andrea Lagos (ficticio)"
                        autoComplete="off"
                      />
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    label="Correo electrónico"
                    name="email"
                    error={errors.email}
                    hint="Usa un correo ficticio, por ejemplo nombre@example.com."
                  >
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={values.email}
                        onChange={change}
                        type="email"
                        maxLength={150}
                        placeholder="andrea@example.com"
                        autoComplete="off"
                      />
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    label="Teléfono"
                    name="phone"
                    error={errors.phone}
                    required={false}
                    hint="Puedes completarlo al editar. Usa solo un teléfono ficticio."
                  >
                    {(props) => (
                      <input
                        {...props}
                        type="tel"
                        inputMode="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={values.phone}
                        onChange={change}
                        maxLength={25}
                        placeholder="Ej. +56 9 0000 0000"
                        autoComplete="off"
                      />
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    label="Familia de cargo"
                    name="family"
                    error={errors.family}
                  >
                    {(props) => (
                      <select
                        {...props}
                        className={`form-select ${errors.family ? 'is-invalid' : ''}`}
                        value={values.family}
                        onChange={change}
                      >
                        {JOB_FAMILIES.map((family) => (
                          <option key={family}>{family}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    label="Cargo de interés"
                    name="position"
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
                  <Field label="Sede" name="location" error={errors.location}>
                    {(props) => (
                      <input
                        {...props}
                        className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                        value={values.location}
                        onChange={change}
                        maxLength={80}
                        placeholder="Ej. Puerto Montt"
                        list="locations"
                      />
                    )}
                  </Field>
                  <datalist id="locations">
                    <option value="Puerto Montt" />
                    <option value="Puerto Varas" />
                    <option value="Quellón" />
                    <option value="Calbuco" />
                  </datalist>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <span>Guardado en este navegador</span>
              <Link
                className="btn btn-light"
                to={editing ? `/candidatos/${candidate.id}` : '/candidatos'}
              >
                Cancelar
              </Link>
              <button className="btn btn-primary" type="submit">
                {editing ? 'Guardar cambios' : 'Registrar candidato'}{' '}
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-4">
          <aside className="info-card">
            <ShieldCheck size={27} />
            <h2>Personas primero</h2>
            <p>
              Registra únicamente información ficticia. Este prototipo no está
              preparado para almacenar datos personales reales.
            </p>
            <hr />
            <h3>¿Qué sigue?</h3>
            <p>
              Desde la ficha podrás crear una solicitud, asignar un evaluador y
              seguir el estado de la evaluación. Los datos del candidato se
              pueden actualizar sin borrar el historial de sus solicitudes.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

export function CandidateDetail() {
  const { id } = useParams();
  const { candidates, requests, permissions } = useProject();
  const candidate = candidates.find((item) => item.id === id);
  if (!candidate) return <NotFound />;
  const related = requests.filter((request) => request.candidateId === id);
  return (
    <>
      <PageHeading
        eyebrow={`FICHA DE CANDIDATO · ${candidate.id}`}
        title={candidate.fullName}
        description={`Registrado el ${formatDate(candidate.createdAt)} · Información ficticia`}
        back={{ to: '/candidatos', label: 'Volver a candidatos' }}
      >
        <div className="d-flex flex-wrap gap-2">
          {permissions.manageCandidates && (
            <Link
              className="btn btn-light"
              to={`/candidatos/${candidate.id}/editar`}
            >
              <Pencil size={16} /> Editar candidato
            </Link>
          )}
          {permissions.manageRequests && (
            <Link
              className="btn btn-primary"
              to={`/solicitudes/nueva?candidato=${candidate.id}`}
            >
              <Plus size={18} /> Crear solicitud
            </Link>
          )}
        </div>
      </PageHeading>
      <section className="surface candidate-profile">
        <div>
          <span className="detail-label">
            <Phone size={15} /> Teléfono
          </span>
          <strong>{candidate.phone || 'Sin registrar'}</strong>
        </div>
        <div>
          <span className="detail-label">
            <FolderOpen size={15} /> Familia de cargo
          </span>
          <strong>{candidate.family || 'Por definir'}</strong>
        </div>
        <div>
          <span className="detail-label">
            <Mail size={15} /> Correo electrónico
          </span>
          <strong>{candidate.email}</strong>
        </div>
        <div>
          <span className="detail-label">
            <BriefcaseBusiness size={15} /> Cargo de interés
          </span>
          <strong>{candidate.position}</strong>
        </div>
        <div>
          <span className="detail-label">
            <MapPin size={15} /> Sede
          </span>
          <strong>{candidate.location}</strong>
        </div>
      </section>
      <section className="surface">
        <div className="panel-heading">
          <div>
            <h2>
              Solicitudes asociadas{' '}
              <span className="count-pill">{related.length}</span>
            </h2>
            <p>Consulta la trazabilidad de cada proceso de esta persona.</p>
          </div>
        </div>
        {related.length ? (
          <RequestsTable requests={related} candidates={candidates} />
        ) : (
          <EmptyState
            title="Este candidato aún no tiene solicitudes"
            description="Crea su primera solicitud para iniciar el seguimiento."
          >
            {permissions.manageRequests && (
              <Link
                className="btn btn-primary"
                to={`/solicitudes/nueva?candidato=${id}`}
              >
                Crear solicitud
              </Link>
            )}
          </EmptyState>
        )}
      </section>
    </>
  );
}
