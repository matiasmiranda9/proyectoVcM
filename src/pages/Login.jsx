import { useState } from 'react';
import { LogIn, Waves } from 'lucide-react';
import { Field } from '../components/UI';
import { authenticate } from '../lib/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.loginEmail = 'Ingresa un correo válido.';
    if (!password) next.loginPassword = 'Ingresa la contraseña.';
    const user = Object.keys(next).length
      ? null
      : authenticate(email, password);
    if (!Object.keys(next).length && !user)
      next.loginPassword = 'Correo o contraseña incorrectos.';
    setErrors(next);
    if (Object.keys(next).length)
      document.getElementById(Object.keys(next)[0])?.focus();
    else onLogin(user);
  }

  return (
    <main className="login-page container">
      <section className="surface login-card">
        <div className="login-heading">
          <span className="brand-icon">
            <Waves size={25} />
          </span>
          <div>
            <h1>AquaEval</h1>
            <p>Gestión de evaluaciones psicolaborales</p>
          </div>
        </div>
        <form className="form-body" onSubmit={submit} noValidate>
          <h2 className="mb-3">Iniciar sesión</h2>
          <Field
            name="loginEmail"
            label="Correo electrónico"
            error={errors.loginEmail}
          >
            {(props) => (
              <input
                {...props}
                className={`form-control ${errors.loginEmail ? 'is-invalid' : ''}`}
                type="email"
                autoComplete="username"
                maxLength={150}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@ejemplo.com"
              />
            )}
          </Field>
          <Field
            name="loginPassword"
            label="Contraseña"
            error={errors.loginPassword}
          >
            {(props) => (
              <input
                {...props}
                className={`form-control ${errors.loginPassword ? 'is-invalid' : ''}`}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
          </Field>
          <button className="btn btn-primary w-100 mt-3" type="submit">
            <LogIn size={18} /> Ingresar
          </button>
          <p className="local-save-note">
            Acceso de demostración con cuentas ficticias, sin backend.
          </p>
        </form>
      </section>
    </main>
  );
}
