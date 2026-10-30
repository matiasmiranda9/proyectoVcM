import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import { permissionsFor, readSession, SESSION_KEY } from './lib/auth';

// El acceso se resuelve aquí; App recibe la sesión y los permisos de sus vistas.
export default function Root() {
  const [session, setSession] = useState(readSession);
  const [sessionWarning, setSessionWarning] = useState('');
  const location = useLocation();

  function login(user) {
    try {
      sessionStorage.setItem(SESSION_KEY, user.id);
    } catch {
      setSessionWarning(
        'El navegador no permite conservar la sesión. Tendrás que ingresar otra vez al recargar.',
      );
    }
    setSession(user);
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* La sesión en memoria también se cierra. */
    }
    setSession(null);
    setSessionWarning('');
  }

  if (!session)
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  if (location.pathname === '/login') return <Navigate to="/" replace />;
  return (
    <>
      {sessionWarning && (
        <div className="alert alert-warning mb-0" role="alert">
          {sessionWarning}
        </div>
      )}
      <App
        key={session.id}
        session={session}
        permissions={permissionsFor(session)}
        onLogout={logout}
      />
    </>
  );
}
