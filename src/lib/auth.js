// Cuentas públicas y ficticias para mostrar los dos roles, sin backend.
export const DEMO_USERS = [
  {
    id: 'USR-001',
    name: 'Analista Demo',
    email: 'analista@example.com',
    password: 'Demo1234',
    role: 'analyst',
  },
  {
    id: 'USR-002',
    name: 'Daniela Pérez',
    email: 'daniela@example.com',
    password: 'Demo1234',
    role: 'evaluator',
  },
  {
    id: 'USR-003',
    name: 'Martín Herrera',
    email: 'martin@example.com',
    password: 'Demo1234',
    role: 'evaluator',
  },
];

export const ROLE_LABELS = {
  analyst: 'Analista de reclutamiento',
  evaluator: 'Profesional evaluador',
};
export const SESSION_KEY = 'aquaeval-session-v1';
export const publicUser = ({ password, ...user }) => user;
export const EVALUATORS = DEMO_USERS.filter(
  (user) => user.role === 'evaluator',
).map(publicUser);

export const ALL_PERMISSIONS = {
  manageCandidates: true,
  manageRequests: true,
  evaluate: true,
  updateStatus: true,
};
export function permissionsFor(user) {
  return {
    manageCandidates: user?.role === 'analyst',
    manageRequests: user?.role === 'analyst',
    evaluate: user?.role === 'evaluator',
    updateStatus: user?.role === 'evaluator',
  };
}

export function authenticate(email, password) {
  const user = DEMO_USERS.find(
    (item) =>
      item.email === email.trim().toLowerCase() && item.password === password,
  );
  return user ? publicUser(user) : null;
}

export function readSession() {
  try {
    const id = sessionStorage.getItem(SESSION_KEY);
    const user = DEMO_USERS.find((item) => item.id === id);
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}
