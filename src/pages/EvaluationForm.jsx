import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, Info } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Field, PageHeading, StatusBadge } from '../components/UI';
import NotFound from './NotFound';

const todayInChile = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Santiago',
  }).format(new Date());

export default function EvaluationForm() {
  const { id } = useParams();
  const { requests, candidates } = useProject();
  const request = requests.find((item) => item.id === id);
  if (!request) return <NotFound />;
  const candidate = candidates.find((item) => item.id === request.candidateId);
  return (
    <EvaluationEditor
      key={request.id}
      request={request}
      candidate={candidate}
    />
  );
}

function EvaluationEditor({ request, candidate }) {
  const { saveEvaluation, permissions } = useProject();
  const navigate = useNavigate();
  const evaluation = request.evaluation;
  const [values, setValues] = useState({
    evaluatedAt:
      evaluation?.evaluatedAt ||
      (request.status === 'Cancelada' ? '' : todayInChile()),
    result: evaluation?.result || '',
    observations: evaluation?.observations || '',
    status:
      evaluation?.status ||
      (['Completada', 'Cancelada'].includes(request.status)
        ? request.status
        : 'En evaluación'),
  });
  const [errors, setErrors] = useState({});
  const readOnly =
    !permissions.evaluate ||
    request.status === 'Cancelada' ||
    (request.status === 'Completada' && Boolean(evaluation));
  const states = readOnly
    ? [values.status]
    : request.status === 'Completada'
      ? ['Completada']
      : request.status === 'En evaluación'
        ? ['En evaluación', 'Completada']
        : ['En evaluación'];
  const change = (event) =>
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = (event) => {
    event.preventDefault();
    if (readOnly) return;
    const result = saveEvaluation(request.id, values);
    if (result.errors) {
      setErrors(result.errors);
      document.getElementById(Object.keys(result.errors)[0])?.focus();
    } else navigate(`/solicitudes/${request.id}`);
  };

  return (
    <>
      <PageHeading
        eyebrow={`EVALUACIÓN · ${request.id}`}
        title={
          readOnly
            ? evaluation
              ? 'Evaluación registrada'
              : 'Consulta de evaluación'
            : evaluation
              ? 'Actualizar evaluación'
              : 'Registrar evaluación'
        }
        description={`${candidate?.fullName || 'Candidato'} · ${request.position}`}
        back={{
          to: `/solicitudes/${request.id}`,
          label: 'Volver a la solicitud',
        }}
      >
        <StatusBadge status={request.status} />
      </PageHeading>
      <div className="row g-4">
        <div className="col-lg-8">
          <form className="surface form-panel" onSubmit={submit} noValidate>
            <div className="panel-heading">
              <div>
                <h2>Información de la evaluación</h2>
                <p>Registra solo información ficticia y general del proceso.</p>
              </div>
            </div>
            <div className="form-body">
              {errors._form && (
                <div className="alert alert-danger" role="alert">
                  {errors._form}
                </div>
              )}
              {readOnly && (
                <div className="alert alert-info">
                  {request.status === 'Cancelada'
                    ? evaluation
                      ? 'La solicitud está cancelada. Su evaluación no admite cambios.'
                      : 'Esta solicitud está cancelada y no tiene una evaluación registrada.'
                    : !permissions.evaluate
                      ? 'Tu perfil permite consultar los datos de esta evaluación.'
                      : 'La solicitud está cerrada. Los datos quedan disponibles para consulta.'}
                </div>
              )}
              <fieldset disabled={readOnly}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <Field
                      name="evaluatedAt"
                      label="Fecha de evaluación"
                      error={errors.evaluatedAt}
                      hint="Corresponde a la evaluación, no a la fecha objetivo de la solicitud."
                    >
                      {(props) => (
                        <input
                          {...props}
                          className={`form-control ${errors.evaluatedAt ? 'is-invalid' : ''}`}
                          type="date"
                          value={values.evaluatedAt}
                          onChange={change}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <Field
                      name="status"
                      label="Estado de la evaluación"
                      error={errors.status}
                    >
                      {(props) => (
                        <select
                          {...props}
                          className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                          value={values.status}
                          onChange={change}
                        >
                          {states.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>
                  <div className="col-12">
                    <Field
                      name="result"
                      label="Resultado general"
                      required={false}
                      error={errors.result}
                      hint="Completa el resultado o las observaciones con al menos 10 caracteres."
                    >
                      {(props) => (
                        <textarea
                          {...props}
                          className={`form-control ${errors.result ? 'is-invalid' : ''}`}
                          value={values.result}
                          onChange={change}
                          rows={3}
                          maxLength={1000}
                          placeholder="Ej. Entrevista de demostración realizada; antecedentes generales revisados."
                        />
                      )}
                    </Field>
                  </div>
                  <div className="col-12">
                    <Field
                      name="observations"
                      label="Observaciones de evaluación"
                      required={false}
                      error={errors.observations}
                      hint="Evita antecedentes personales reales o información clínica."
                    >
                      {(props) => (
                        <textarea
                          {...props}
                          className={`form-control ${errors.observations ? 'is-invalid' : ''}`}
                          value={values.observations}
                          onChange={change}
                          rows={4}
                          maxLength={1500}
                          placeholder="Observaciones generales de este proceso ficticio."
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="form-actions">
              <span>Guardado local de demostración</span>
              <Link className="btn btn-light" to={`/solicitudes/${request.id}`}>
                {readOnly ? 'Volver' : 'Cancelar'}
              </Link>
              {!readOnly && (
                <button className="btn btn-primary" type="submit">
                  Guardar evaluación <ArrowRight size={17} />
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="col-lg-4">
          <aside className="info-card">
            <ClipboardCheck size={28} />
            <h2>Evaluación y seguimiento</h2>
            <p>
              La evaluación queda vinculada a esta solicitud y al profesional
              asignado. Al guardarla se actualiza su estado y se agrega una
              entrada al historial.
            </p>
            <hr />
            <p>
              Si el proceso ya se había completado sin evaluación, puedes
              registrar sus antecedentes una vez, manteniendo el estado
              Completada.
            </p>
          </aside>
          <div className="inline-note">
            <Info size={18} />
            <span>
              Este prototipo no calcula aptitud laboral ni reemplaza una
              evaluación profesional. Usa exclusivamente datos ficticios.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
