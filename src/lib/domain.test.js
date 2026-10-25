import { describe, expect, it } from 'vitest';
import { demoCandidates, demoRequests } from '../data/demoData';
import {
  allowedTransitions,
  filterRequests,
  getMetrics,
  matchesSearch,
  validateCandidate,
  validateRequest,
} from './domain';

const candidate = {
  fullName: 'Persona de prueba',
  email: 'persona@example.com',
  position: 'Analista',
  location: 'Puerto Montt',
};
const request = {
  candidateId: 'CAN-001',
  position: 'Analista',
  evaluator: 'Profesional de prueba',
  dueDate: '2026-11-03',
  priority: 'Normal',
};

describe('registro de candidatos', () => {
  it('acepta un candidato completo y un correo que todavía no está registrado', () => {
    expect(validateCandidate(candidate, demoCandidates)).toEqual({});
  });

  it('informa todos los campos obligatorios antes de guardar', () => {
    expect(Object.keys(validateCandidate({})).sort()).toEqual([
      'email',
      'fullName',
      'location',
      'position',
    ]);
  });

  it('rechaza un nombre demasiado corto y un correo inválido', () => {
    const errors = validateCandidate({
      ...candidate,
      fullName: ' A ',
      email: 'sin-arroba',
    });
    expect(errors).toHaveProperty('fullName');
    expect(errors).toHaveProperty('email');
  });

  it('evita duplicados de correo con mayúsculas y espacios', () => {
    const errors = validateCandidate(
      { ...candidate, email: '  VALENTINA.SOTO@example.com  ' },
      demoCandidates,
    );
    expect(errors.email).toMatch(/Ya existe/);
  });

  it('no considera duplicado el propio correo al validar una edición', () => {
    expect(validateCandidate(demoCandidates[0], demoCandidates)).toEqual({});
  });

  it('rechaza los campos con solo espacios', () => {
    expect(
      validateCandidate({ ...candidate, position: '  ', location: '  ' }),
    ).toMatchObject({
      position: expect.any(String),
      location: expect.any(String),
    });
  });
});

describe('creación de solicitudes', () => {
  it('acepta una solicitud asociada a un candidato existente', () => {
    expect(validateRequest(request, demoCandidates)).toEqual({});
  });

  it('impide solicitudes sin candidato o vinculadas a un identificador inexistente', () => {
    expect(
      validateRequest({ ...request, candidateId: '' }, demoCandidates),
    ).toHaveProperty('candidateId');
    expect(
      validateRequest({ ...request, candidateId: 'CAN-999' }, demoCandidates),
    ).toHaveProperty('candidateId');
  });

  it('informa los cinco campos obligatorios', () => {
    expect(Object.keys(validateRequest({})).sort()).toEqual([
      'candidateId',
      'dueDate',
      'evaluator',
      'position',
      'priority',
    ]);
  });

  it.each(['2026-02-30', '2026-13-01', '03/11/2026', 'invalid'])(
    'rechaza la fecha inválida %s',
    (dueDate) => {
      expect(
        validateRequest({ ...request, dueDate }, demoCandidates),
      ).toHaveProperty('dueDate');
    },
  );

  it('permite consultar y validar fechas históricas de la demostración', () => {
    expect(
      validateRequest({ ...request, dueDate: '2020-02-29' }, demoCandidates),
    ).toEqual({});
  });

  it('solo admite prioridades definidas', () => {
    expect(
      validateRequest({ ...request, priority: 'Urgente' }, demoCandidates),
    ).toHaveProperty('priority');
  });
});

describe('búsqueda y seguimiento', () => {
  it('encuentra nombres ignorando tildes, mayúsculas y espacios externos', () => {
    expect(matchesSearch('Benjamín Vera', '  BENJAMIN ')).toBe(true);
    expect(
      filterRequests(demoRequests, demoCandidates, { search: 'tomas' }).map(
        ({ id }) => id,
      ),
    ).toEqual(['SOL-002']);
  });

  it('combina búsqueda, estado y prioridad sin modificar el arreglo original', () => {
    const original = structuredClone(demoRequests);
    const filtered = filterRequests(demoRequests, demoCandidates, {
      search: 'Daniela',
      status: 'En evaluación',
      priority: 'Alta',
    });
    expect(filtered.map(({ id }) => id)).toEqual(['SOL-006']);
    expect(demoRequests).toEqual(original);
  });

  it('busca por identificador y por cargo', () => {
    expect(
      filterRequests(demoRequests, demoCandidates, { search: 'SOL-004' }),
    ).toHaveLength(1);
    expect(
      filterRequests(demoRequests, demoCandidates, {
        search: 'abastecimiento',
      })[0].id,
    ).toBe('SOL-008');
  });

  it('devuelve todos los registros sin filtros y ninguno si no hay coincidencias', () => {
    expect(filterRequests(demoRequests, demoCandidates)).toHaveLength(8);
    expect(
      filterRequests(demoRequests, demoCandidates, { search: 'inexistente' }),
    ).toEqual([]);
  });

  it('calcula indicadores sin contar canceladas como pendientes o completadas', () => {
    expect(getMetrics(demoRequests)).toEqual({
      total: 8,
      pending: 3,
      inProgress: 2,
      completed: 2,
    });
    expect(getMetrics([])).toEqual({
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    });
  });

  it('solo permite transiciones coherentes y mantiene cerrados los estados terminales', () => {
    expect(allowedTransitions('Pendiente')).toEqual([
      'En evaluación',
      'Cancelada',
    ]);
    expect(allowedTransitions('En evaluación')).toEqual([
      'Completada',
      'Cancelada',
    ]);
    expect(allowedTransitions('Completada')).toEqual([]);
    expect(allowedTransitions('Cancelada')).toEqual([]);
    expect(allowedTransitions('Estado desconocido')).toEqual([]);
  });

  it('mantiene integridad referencial y el historial consistente de los datos demo', () => {
    for (const item of demoRequests) {
      expect(demoCandidates.some(({ id }) => id === item.candidateId)).toBe(
        true,
      );
      expect(item.history.at(-1).status).toBe(item.status);
      expect(validateRequest(item, demoCandidates)).toEqual({});
    }
  });
});
