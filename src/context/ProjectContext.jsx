import { createContext, useContext, useEffect, useState } from 'react';
import { demoCandidates, demoRequests } from '../data/demoData';
import {
  allowedTransitions,
  validateCandidate,
  validateRequest,
  STATUSES,
} from '../lib/domain';

const ProjectContext = createContext(null);
export const STORAGE_KEY = 'aquaeval-demo-v1';
const freshData = () =>
  structuredClone({ candidates: demoCandidates, requests: demoRequests });

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { data: freshData(), warning: '' };
    const parsed = JSON.parse(saved);
    const validCandidates =
      Array.isArray(parsed.candidates) &&
      parsed.candidates.every((c) =>
        ['id', 'fullName', 'email', 'position', 'location', 'createdAt'].every(
          (key) => typeof c[key] === 'string',
        ),
      );
    const validRequests =
      Array.isArray(parsed.requests) &&
      parsed.requests.every(
        (r) =>
          [
            'id',
            'candidateId',
            'position',
            'evaluator',
            'dueDate',
            'priority',
            'createdAt',
          ].every((key) => typeof r[key] === 'string') &&
          STATUSES.includes(r.status) &&
          parsed.candidates?.some((c) => c.id === r.candidateId) &&
          Array.isArray(r.history) &&
          r.history.every(
            (h) =>
              typeof h.at === 'string' &&
              typeof h.note === 'string' &&
              STATUSES.includes(h.status),
          ),
      );
    if (parsed.version !== 1 || !validCandidates || !validRequests)
      throw new Error('Datos incompatibles');
    return {
      data: { candidates: parsed.candidates, requests: parsed.requests },
      warning: '',
    };
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

export function ProjectProvider({ children }) {
  const [initial] = useState(loadData);
  const [data, setData] = useState(initial.data);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [notice, setNotice] = useState('');

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
    const clean = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );
    const errors = validateCandidate(clean, data.candidates);
    if (Object.keys(errors).length) return { errors };
    const candidate = {
      ...clean,
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

  function addRequest(values) {
    const clean = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );
    const errors = validateRequest(clean, data.candidates);
    if (Object.keys(errors).length) return { errors };
    const at = new Date().toISOString();
    const request = {
      ...clean,
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
    if (!request || !allowedTransitions(request.status).includes(status))
      return 'El cambio de estado no está permitido.';
    if (!note.trim() || note.trim().length < 5)
      return 'Escribe una observación de al menos 5 caracteres para dejar trazabilidad.';
    const entry = { status, at: new Date().toISOString(), note: note.trim() };
    setData((current) => ({
      ...current,
      requests: current.requests.map((item) =>
        item.id === id
          ? { ...item, status, history: [...item.history, entry] }
          : item,
      ),
    }));
    setNotice(`Solicitud actualizada a «${status}» en la demostración local.`);
    return '';
  }

  return (
    <ProjectContext.Provider
      value={{
        ...data,
        addCandidate,
        addRequest,
        updateStatus,
        notice,
        setNotice,
        storageWarning,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
