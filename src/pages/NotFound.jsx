import { Link } from 'react-router-dom';
import { EmptyState } from '../components/UI';
export default function NotFound() {
  return (
    <section className="surface">
      <EmptyState
        title="No encontramos esta página"
        description="La ruta o el registro solicitado no existe en esta demostración."
      >
        <Link className="btn btn-primary" to="/">
          Volver al resumen
        </Link>
      </EmptyState>
    </section>
  );
}
