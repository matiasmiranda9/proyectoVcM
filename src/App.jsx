import { Route, Routes } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { ALL_PERMISSIONS } from './lib/auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates, {
  CandidateForm,
  CandidateEdit,
  CandidateDetail,
} from './pages/Candidates';
import Requests, { RequestForm, RequestDetail } from './pages/Requests';
import Indicators from './pages/Indicators';
import NotFound from './pages/NotFound';
import EvaluationForm from './pages/EvaluationForm';
import { EmptyState } from './components/UI';
import { Link } from 'react-router-dom';

function Access({ allowed, children }) {
  return allowed ? (
    children
  ) : (
    <section className="surface">
      <EmptyState
        title="Acceso restringido"
        description="Tu rol no permite realizar esta acción."
      >
        <Link className="btn btn-primary" to="/">
          Volver al resumen
        </Link>
      </EmptyState>
    </section>
  );
}

export default function App({
  session = null,
  permissions = ALL_PERMISSIONS,
  onLogout,
}) {
  return (
    <ProjectProvider session={session} permissions={permissions}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Routes>
        <Route element={<Layout onLogout={onLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="candidatos" element={<Candidates />} />
          <Route
            path="candidatos/nuevo"
            element={
              <Access allowed={permissions.manageCandidates}>
                <CandidateForm />
              </Access>
            }
          />
          <Route
            path="candidatos/:id/editar"
            element={
              <Access allowed={permissions.manageCandidates}>
                <CandidateEdit />
              </Access>
            }
          />
          <Route path="candidatos/:id" element={<CandidateDetail />} />
          <Route path="solicitudes" element={<Requests />} />
          <Route
            path="solicitudes/nueva"
            element={
              <Access allowed={permissions.manageRequests}>
                <RequestForm />
              </Access>
            }
          />
          <Route path="solicitudes/:id" element={<RequestDetail />} />
          <Route
            path="solicitudes/:id/evaluacion"
            element={
              <Access allowed={permissions.evaluate}>
                <EvaluationForm />
              </Access>
            }
          />
          <Route path="indicadores" element={<Indicators />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProjectProvider>
  );
}
