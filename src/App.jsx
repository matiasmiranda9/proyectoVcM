import { Route, Routes } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates, { CandidateForm, CandidateDetail } from './pages/Candidates';
import Requests, { RequestForm, RequestDetail } from './pages/Requests';
import Indicators from './pages/Indicators';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ProjectProvider>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidatos" element={<Candidates />} />
          <Route path="candidatos/nuevo" element={<CandidateForm />} />
          <Route path="candidatos/:id" element={<CandidateDetail />} />
          <Route path="solicitudes" element={<Requests />} />
          <Route path="solicitudes/nueva" element={<RequestForm />} />
          <Route path="solicitudes/:id" element={<RequestDetail />} />
          <Route path="indicadores" element={<Indicators />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProjectProvider>
  );
}
