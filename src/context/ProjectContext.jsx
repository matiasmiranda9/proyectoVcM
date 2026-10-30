import { createContext, useContext, useEffect, useState } from 'react';
import { demoCandidates, demoRequests } from '../data/demoData';
import { ALL_PERMISSIONS, EVALUATORS } from '../lib/auth';
import {
  allowedTransitions,
  validateCandidate,
  validateCandidateExtras,
  validateRequest,
  validateEvaluation,
  JOB_FAMILIES,
  STATUSES,
} from '../lib/domain';

const ProjectContext = createContext(null);
export const STORAGE_KEY = 'aquaeval-demo-v1';

function normalizeData(data) {
  const candidates = data.candidates.map((candidate) => ({
    phone: '',
    family: 'Por definir',
    ...candidate,
  }));
  const requests = data.requests.map((request) => ({
    family:
      candidates.find((candidate) => candidate.id === request.candidateId)
        ?.family || 'Por definir',
    notes: '',
    ...request,
  }));
  return { candidates, requests };
}
const freshData = () =>
  normalizeData(
    structuredClone({ candidates: demoCandidates, requests: demoRequests }),
  );

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { data: freshData(), warning: '' };
    const parsed = JSON.parse(saved);
    const validCandidates =
      Array.isArray(parsed.candidates) &&
      parsed.candidates.every(
        (candidate) =>
          candidate &&
          [
            'id',
            'fullName',
            'email',
            'position',
            'location',
            'createdAt',
          ].every((key) => typeof candidate[key] === 'string') &&
          ['phone', 'family'].every(
            (key) =>
              candidate[key] === undefined ||
              typeof candidate[key] === 'string',
          ),
      );
    const validRequests =
      Array.isArray(parsed.requests) &&
      parsed.requests.every(
        (request) =>
          request &&
          [
            'id',
            'candidateId',
            'position',
            'evaluator',
            'dueDate',
            'priority',
            'createdAt',
          ].every((key) => typeof request[key] === 'string') &&
          STATUSES.includes(request.status) &&
          parsed.candidates?.some(
            (candidate) => candidate.id === request.candidateId,
          ) &&
          ['family', 'notes'].every(
            (key) =>
              request[key] === undefined || typeof request[key] === 'string',
          ) &&
          Array.isArray(request.history) &&
          request.history.every(
            (entry) =>
              entry &&
              typeof entry.at === 'string' &&
              typeof entry.note === 'string' &&
              STATUSES.includes(entry.status),
          ) &&
          (!request.evaluation ||
            (typeof request.evaluation === 'object' &&
              !Object.keys(
                validateEvaluation(request.evaluation, {
                  allowCancelled: true,
                }),
              ).length &&
              request.evaluation.status === request.status)),
      );
    if (parsed.version !== 1 || !validCandidates || !validRequests)
      throw new Error('Datos incompatibles');
    return { data: normalizeData(parsed), warning: '' };
  } catch {
    return {
      data: freshData(),
      warning:
        'No se pudieron leer los datos locales. Se cargó nuevamente la demostración.',
    };
  }
}

const nextId = (items, prefix) =>
  `${prefix}-${String(Math.max(0, ...items.map((item) => Number(item.id.split('-')[1]) || 0)) + 1).padStart(3, '0')}`;
const trimmed = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  );
const denied = () => ({
  errors: { _form: 'Tu rol no permite realizar esta acción.' },
});

export function ProjectProvider({
  children,
  session = null,
  permissions = ALL_PERMISSIONS,
}) {
  const [initial] = useState(loadData);
  const [data, setData] = useState(initial.data);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [notice, setNotice] = useState('');
  const isEvaluator = session?.role === 'evaluator';
  const canView = (request) =>
    Boolean(request) && (!isEvaluator || request.evaluator === session.name);
  const requests = data.requests.filter(canView);
  const candidates = isEvaluator
    ? data.candidates.filter((candidate) =>
        requests.some((request) => request.candidateId === candidate.id),
      )
    : data.candidates;

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, ...data }),
      );
    } catch {
      setStorageWarning(
        'El navegador no permite guardar. Los cambios estarán disponibles solo durante esta sesión.',
      );
    }
  }, [data]);

  function addCandidate(values) {
    if (!permissions.manageCandidates) return denied();
    const clean = trimmed(values);
    const errors = {
      ...validateCandidate(clean, data.candidates),
      ...validateCandidateExtras(clean),
    };
    if (Object.keys(errors).length) return { errors };
    const candidate = {
      ...clean,
      phone: clean.phone || '',
      family: clean.family || 'Por definir',
      id: nextId(data.candidates, 'CAN'),
      createdAt: new Date().toISOString(),
    };
    setData((current) => ({
      ...current,
      candidates: [...current.candidates, candidate],
    }));
    setNotice('Candidato registrado en la demostración local.');
    return { id: candidate.id };
  }

  function updateCandidate(id, values) {
    if (!permissions.manageCandidates) return denied();
    const existing = data.candidates.find((candidate) => candidate.id === id);
    if (!existing) return { errors: { _form: 'No encontramos al candidato.' } };
    const clean = trimmed(values);
    const errors = {
      ...validateCandidate({ ...clean, id }, data.candidates),
      ...validateCandidateExtras(clean),
    };
    if (Object.keys(errors).length) return { errors };
    const candidate = {
      ...existing,
      fullName: clean.fullName,
      email: clean.email,
      position: clean.position,
      location: clean.location,
      phone: clean.phone || '',
      family: clean.family || 'Por definir',
      updatedAt: new Date().toISOString(),
    };
    setData((current) => ({
      ...current,
      candidates: current.candidates.map((item) =>
        item.id === id ? candidate : item,
      ),
    }));
    setNotice('Datos del candidato actualizados en la demostración local.');
    return { id };
  }

  function addRequest(values) {
    if (!permissions.manageRequests) return denied();
    const clean = trimmed(values);
    const errors = validateRequest(clean, data.candidates);
    if (clean.family && !JOB_FAMILIES.includes(clean.family))
      errors.family = 'Selecciona una familia de cargo válida.';
    if (
      session &&
      clean.evaluator &&
      !EVALUATORS.some((evaluator) => evaluator.name === clean.evaluator)
    )
      errors.evaluator = 'Selecciona uno de los evaluadores de demostración.';
    if (Object.keys(errors).length) return { errors };
    const at = new Date().toISOString();
    const candidate = data.candidates.find(
      (item) => item.id === clean.candidateId,
    );
    const request = {
      ...clean,
      family: clean.family || candidate.family || 'Por definir',
      id: nextId(data.requests, 'SOL'),
      status: 'Pendiente',
      createdAt: at,
      history: [
        {
          status: 'Pendiente',
          at,
          note: clean.notes || 'Solicitud creada en la demostración.',
        },
      ],
    };
    setData((current) => ({
      ...current,
      requests: [request, ...current.requests],
    }));
    setNotice('Solicitud creada. Puedes seguir su avance desde esta ficha.');
    return { id: request.id };
  }

  function updateStatus(id, status, note) {
    const request = data.requests.find((item) => item.id === id);
    if (!permissions.updateStatus || !canView(request))
      return 'Tu rol no permite actualizar esta solicitud.';
    if (!allowedTransitions(request.status).includes(status))
      return 'El cambio de estado no está permitido.';
    if (!note.trim() || note.trim().length < 5)
      return 'Escribe una observación de al menos 5 caracteres para dejar trazabilidad.';
    const entry = { status, at: new Date().toISOString(), note: note.trim() };
    setData((current) => ({
      ...current,
      requests: current.requests.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              evaluation: item.evaluation
                ? { ...item.evaluation, status, updatedAt: entry.at }
                : undefined,
              history: [...item.history, entry],
            }
          : item,
      ),
    }));
    setNotice(`Solicitud actualizada a «${status}» en la demostración local.`);
    return '';
  }

  function saveEvaluation(id, values) {
    const request = data.requests.find((item) => item.id === id);
    if (!permissions.evaluate || !canView(request)) return denied();
    if (
      request.status === 'Cancelada' ||
      (request.status === 'Completada' && request.evaluation)
    )
      return {
        errors: {
          _form: 'El proceso está cerrado y su evaluación es de consulta.',
        },
      };
    const clean = trimmed(values);
    const errors = validateEvaluation(clean);
    if (
      clean.status !== request.status &&
      !allowedTransitions(request.status).includes(clean.status)
    )
      errors.status =
        'Primero inicia la evaluación antes de completar el proceso.';
    if (Object.keys(errors).length) return { errors };
    const at = new Date().toISOString();
    const evaluation = {
      evaluatedAt: clean.evaluatedAt,
      result: clean.result || '',
      observations: clean.observations || '',
      status: clean.status,
      evaluator: session?.name || request.evaluator,
      createdAt: request.evaluation?.createdAt || at,
      updatedAt: at,
    };
    const entry = {
      status: clean.status,
      at,
      note: request.evaluation
        ? 'Información de evaluación actualizada (demostración).'
        : 'Evaluación registrada con fecha y observaciones (demostración).',
    };
    setData((current) => ({
      ...current,
      requests: current.requests.map((item) =>
        item.id === id
          ? {
              ...item,
              evaluation,
              status: clean.status,
              history: [...item.history, entry],
            }
          : item,
      ),
    }));
    setNotice('Evaluación guardada en la demostración local.');
    return { id };
  }

  return (
    <ProjectContext.Provider
      value={{
        candidates,
        requests,
        addCandidate,
        updateCandidate,
        addRequest,
        updateStatus,
        saveEvaluation,
        notice,
        setNotice,
        storageWarning,
        permissions,
        session,
        evaluators: EVALUATORS,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
