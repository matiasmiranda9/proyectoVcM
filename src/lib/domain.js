export const STATUSES = [
  'Pendiente',
  'En evaluación',
  'Completada',
  'Cancelada',
];
export const PRIORITIES = ['Normal', 'Alta'];

const clean = (value) => String(value ?? '').trim();
const normalized = (value) =>
  clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

/** Validación compartida por el formulario y las pruebas. No utiliza datos reales. */
export function validateCandidate(values, candidates = []) {
  const errors = {};
  const name = clean(values.fullName);
  const email = clean(values.email);

  if (name.length < 3)
    errors.fullName = 'Ingresa un nombre de al menos 3 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  } else if (
    candidates.some(
      (candidate) =>
        normalized(candidate.email) === normalized(email) &&
        candidate.id !== values.id,
    )
  ) {
    errors.email = 'Ya existe un candidato con este correo.';
  }
  if (!clean(values.position))
    errors.position = 'Indica el cargo al que postula.';
  if (!clean(values.location)) errors.location = 'Indica la sede o ubicación.';
  return errors;
}

function isISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validateRequest(values, candidates = []) {
  const errors = {};
  if (!candidates.some((candidate) => candidate.id === values.candidateId)) {
    errors.candidateId = 'Selecciona un candidato registrado.';
  }
  if (!clean(values.position))
    errors.position = 'Indica el cargo de la solicitud.';
  if (!clean(values.evaluator))
    errors.evaluator = 'Indica el profesional responsable.';
  if (!isISODate(clean(values.dueDate)))
    errors.dueDate = 'Selecciona una fecha válida.';
  if (!PRIORITIES.includes(values.priority))
    errors.priority = 'Selecciona una prioridad válida.';
  return errors;
}

export function matchesSearch(text, query) {
  return normalized(text).includes(normalized(query));
}

export function filterRequests(
  requests,
  candidates,
  { search = '', status = '', priority = '' } = {},
) {
  const candidatesById = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  );
  return requests.filter((request) => {
    const candidate = candidatesById.get(request.candidateId);
    const searchable = [
      request.id,
      candidate?.fullName,
      request.position,
      request.evaluator,
    ].join(' ');
    return (
      matchesSearch(searchable, search) &&
      (!status || request.status === status) &&
      (!priority || request.priority === priority)
    );
  });
}

export function getMetrics(requests) {
  return {
    total: requests.length,
    pending: requests.filter(({ status }) => status === 'Pendiente').length,
    inProgress: requests.filter(({ status }) => status === 'En evaluación')
      .length,
    completed: requests.filter(({ status }) => status === 'Completada').length,
  };
}

/** Un proceso cerrado conserva su trazabilidad: no se reabre desde el frontend. */
export function allowedTransitions(status) {
  if (status === 'Pendiente') return ['En evaluación', 'Cancelada'];
  if (status === 'En evaluación') return ['Completada', 'Cancelada'];
  return [];
}
