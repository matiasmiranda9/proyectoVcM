import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { STORAGE_KEY } from './context/ProjectContext';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const savedData = () => JSON.parse(localStorage.getItem(STORAGE_KEY));

describe('recorrido de gestión psicolaboral', () => {
  it('registra, solicita, actualiza con trazabilidad y recupera el proceso al volver a abrir la aplicación', async () => {
    const user = userEvent.setup();
    const initial = renderApp('/candidatos/nuevo');

    await user.click(
      screen.getByRole('button', { name: 'Registrar candidato' }),
    );
    expect(screen.getByLabelText(/^Nombre completo/)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText(/^Correo electrónico/)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByText('Indica el cargo al que postula.')).toBeVisible();
    expect(screen.getByText('Indica la sede o ubicación.')).toBeVisible();
    expect(savedData().candidates).toHaveLength(8);

    await user.type(
      screen.getByLabelText(/^Nombre completo/),
      'Andrea Lagos Demo',
    );
    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      'andrea.lagos@example.com',
    );
    await user.type(
      screen.getByLabelText(/^Cargo de interés/),
      'Analista de procesos',
    );
    await user.type(screen.getByLabelText(/^Sede/), 'Puerto Montt');
    await user.click(
      screen.getByRole('button', { name: 'Registrar candidato' }),
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Andrea Lagos Demo' }),
    ).toBeVisible();
    expect(
      screen.getByText('Este candidato aún no tiene solicitudes'),
    ).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Candidato registrado',
    );
    await user.click(
      screen.getAllByRole('link', { name: 'Crear solicitud' })[0],
    );

    expect(screen.getByLabelText(/^Candidato/)).toHaveValue('CAN-009');
    expect(screen.getByLabelText(/^Cargo a evaluar/)).toHaveValue(
      'Analista de procesos',
    );
    await user.type(
      screen.getByLabelText(/^Evaluador responsable/),
      'Profesional Demo',
    );
    fireEvent.change(screen.getByLabelText(/^Fecha objetivo/), {
      target: { value: '2026-11-05' },
    });
    await user.selectOptions(screen.getByLabelText(/^Prioridad/), 'Alta');
    await user.type(
      screen.getByLabelText(/^Observaciones de coordinación/),
      'Coordinar entrevista en la mañana.',
    );
    await user.click(screen.getByRole('button', { name: 'Crear solicitud' }));

    expect(
      screen.getByRole('heading', { name: 'Detalle de solicitud' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Andrea Lagos Demo' }),
    ).toBeVisible();
    expect(screen.getByText('1 eventos')).toBeVisible();
    expect(savedData().requests[0]).toMatchObject({
      id: 'SOL-009',
      candidateId: 'CAN-009',
      status: 'Pendiente',
    });

    // La actualización debe elegir un estado y dejar una observación útil.
    await user.click(screen.getByRole('button', { name: 'Guardar cambio' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Selecciona el nuevo estado.',
    );
    await user.selectOptions(
      screen.getByLabelText(/^Nuevo estado/),
      'En evaluación',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar cambio' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'al menos 5 caracteres',
    );
    expect(savedData().requests[0].history).toHaveLength(1);
    await user.type(
      screen.getByLabelText(/^Observación(?:\s|$)/),
      'Entrevista coordinada con el profesional.',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar cambio' }));
    expect(screen.getByText('2 eventos')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('En evaluación');

    await user.selectOptions(
      screen.getByLabelText(/^Nuevo estado/),
      'Completada',
    );
    await user.type(
      screen.getByLabelText(/^Observación(?:\s|$)/),
      'Evaluación finalizada en la demostración.',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar cambio' }));
    expect(
      screen.getByRole('heading', { name: 'Proceso cerrado' }),
    ).toBeVisible();
    expect(screen.getByText('3 eventos')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Guardar cambio' }),
    ).not.toBeInTheDocument();
    expect(
      savedData().requests[0].history.map((event) => event.status),
    ).toEqual(['Pendiente', 'En evaluación', 'Completada']);

    // Desmontar y volver a montar comprueba la lectura real desde localStorage.
    initial.unmount();
    renderApp('/solicitudes/SOL-009');
    expect(
      screen.getByRole('heading', { name: 'Proceso cerrado' }),
    ).toBeVisible();
    expect(
      screen.getByText('Entrevista coordinada con el profesional.'),
    ).toBeVisible();
    expect(
      screen.getByText('Evaluación finalizada en la demostración.'),
    ).toBeVisible();
    await user.click(
      screen.getByRole('link', { name: 'Resumen general', exact: true }),
    );
    expect(
      screen.getByRole('link', { name: /Solicitudes totales/ }),
    ).toHaveTextContent('09');
    expect(
      screen.getByRole('link', { name: /Completadas.*Procesos finalizados/ }),
    ).toHaveTextContent('03');
  });

  it('no crea una solicitud sin candidato, cargo, responsable y fecha', async () => {
    const user = userEvent.setup();
    renderApp('/solicitudes/nueva');
    await user.click(screen.getByRole('button', { name: 'Crear solicitud' }));
    expect(
      screen.getByText('Selecciona un candidato registrado.'),
    ).toBeVisible();
    expect(screen.getByText('Indica el cargo de la solicitud.')).toBeVisible();
    expect(
      screen.getByText('Indica el profesional responsable.'),
    ).toBeVisible();
    expect(screen.getByText('Selecciona una fecha válida.')).toBeVisible();
    expect(savedData().requests).toHaveLength(8);
  });

  it('rechaza un correo ya registrado sin añadir otro candidato', async () => {
    const user = userEvent.setup();
    renderApp('/candidatos/nuevo');
    await user.type(
      screen.getByLabelText(/^Nombre completo/),
      'Duplicado Demo',
    );
    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      'VALENTINA.SOTO@example.com',
    );
    await user.type(screen.getByLabelText(/^Cargo de interés/), 'Analista');
    await user.type(screen.getByLabelText(/^Sede/), 'Puerto Montt');
    await user.click(
      screen.getByRole('button', { name: 'Registrar candidato' }),
    );
    expect(
      screen.getByText('Ya existe un candidato con este correo.'),
    ).toBeVisible();
    expect(screen.getByLabelText(/^Correo electrónico/)).toHaveFocus();
    expect(savedData().candidates).toHaveLength(8);
  });
});

describe('consulta, filtros y rutas', () => {
  it('combina búsqueda sin tildes, estado y prioridad para encontrar una solicitud', async () => {
    const user = userEvent.setup();
    renderApp('/solicitudes');
    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar solicitudes' }),
      'BENJAMIN',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filtrar por estado' }),
      'En evaluación',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filtrar por prioridad' }),
      'Alta',
    );
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(
      within(table).getByRole('link', { name: 'Benjamín Vera' }),
    ).toBeVisible();
    expect(screen.getByText('Mostrando 1 de 8 solicitudes')).toBeVisible();
    await user.click(
      screen.getByRole('link', { name: 'Ver solicitud SOL-006' }),
    );
    expect(
      screen.getByRole('heading', { name: 'Detalle de solicitud' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Benjamín Vera' }),
    ).toBeVisible();
  });

  it('muestra el estado sin resultados y permite restablecer todos los filtros', async () => {
    const user = userEvent.setup();
    renderApp(
      '/solicitudes?estado=Completada&prioridad=Alta&buscar=inexistente',
    );
    expect(
      screen.getByRole('heading', { name: 'No encontramos resultados' }),
    ).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(
      screen.getByRole('searchbox', { name: 'Buscar solicitudes' }),
    ).toHaveValue('');
    expect(
      screen.getByRole('combobox', { name: 'Filtrar por estado' }),
    ).toHaveValue('');
    expect(
      screen.getByRole('combobox', { name: 'Filtrar por prioridad' }),
    ).toHaveValue('');
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      9,
    );
    expect(screen.getByText('Mostrando 8 de 8 solicitudes')).toBeVisible();
  });

  it('combina búsqueda de candidatos y sede y navega a una ficha real', async () => {
    const user = userEvent.setup();
    renderApp('/candidatos');
    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar candidatos' }),
      'tomas',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filtrar por sede' }),
      'Quellón',
    );
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      2,
    );
    await user.click(
      screen.getByRole('link', { name: 'Ver ficha de Tomás Aguilera' }),
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tomás Aguilera' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Ver solicitud SOL-002' }),
    ).toBeVisible();
  });

  it.each(['/ruta-inexistente', '/candidatos/CAN-999', '/solicitudes/SOL-999'])(
    'resuelve la ruta inexistente %s sin romper la navegación',
    async (path) => {
      const user = userEvent.setup();
      renderApp(path);
      expect(
        screen.getByRole('heading', { name: 'No encontramos esta página' }),
      ).toBeVisible();
      await user.click(screen.getByRole('link', { name: 'Volver al resumen' }));
      expect(
        screen.getByRole('heading', { level: 1, name: 'Resumen general' }),
      ).toBeVisible();
    },
  );

  it('recupera datos de demostración y avisa si el almacenamiento local está dañado', () => {
    localStorage.setItem(STORAGE_KEY, '{json incompleto');
    renderApp('/solicitudes');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron leer los datos locales',
    );
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      9,
    );
    expect(savedData().requests).toHaveLength(8);
  });
});
