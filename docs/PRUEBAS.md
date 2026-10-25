# Evidencia de pruebas

Ejecución real del **25 de octubre de 2026 (America/Santiago)** con Node.js 24.19.0 y Vitest 5.0.5. La evidencia corresponde al frontend académico y sus datos ficticios. El JSON registra la hora exacta de la última ejecución.

## Resultado automatizado

```text
Test Files  2 passed (2)
     Tests  32 passed (32)
```

**32 aprobadas, 0 fallidas, 0 pendientes.** No se midió cobertura; no se afirma un porcentaje de cobertura.

| Archivo                  | Casos | Qué comprueban y qué fallo detectarían                                                                                                                                                                                                                                           |
| ------------------------ | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/domain.test.js` |    22 | Campos obligatorios, correo inválido/duplicado, candidato existente, fechas válidas, búsquedas sin tildes, filtros combinados, métricas y transiciones. Detectan registros incompletos, resultados incoherentes y avance de estados no permitido.                                |
| `src/App.test.jsx`       |    10 | Registro → ficha → solicitud precargada → cambio de estado con nota → cierre e historial; recuperación al volver a abrir; filtros, estados vacíos, rutas inexistentes, correo duplicado y almacenamiento corrupto. Detectan pantallas desconectadas y pérdida del proceso local. |

La evidencia del runner está en [artifacts/vitest-results.json](../artifacts/vitest-results.json). El archivo conserva los nombres y resultados de cada caso. Las pruebas de componentes utilizan Testing Library, `userEvent`, jsdom y `MemoryRouter`; no se conectan a servicios externos.

## Reproducir en VS Code

Desde la carpeta que contiene `package.json`:

```bash
npm ci
npm test
npm run build
```

Para actualizar el reporte después de un cambio:

```bash
npm run test:evidence
```

No edites manualmente el JSON para aparentar resultados. Durante la presentación ejecuta `npm test` y espera su resultado actual.

## Instalación, compilación y navegador

- `npm ci --no-fund --no-audit`: instalación reproducible verificada desde `package-lock.json`.
- `npm run build`: compilación de producción completada con Vite 8.3.5.
- Chromium: recorrido funcional con registro ficticio, solicitud precargada, estados Pendiente → En evaluación → Completada, historial y persistencia después de recargar. Sin errores JavaScript observados. Se comprobó tanto el servidor de desarrollo como la versión compilada servida con `npm run preview`.
- Navegación y adaptación: 45 combinaciones comprobadas en Chromium, con nueve rutas y anchos de 320, 390, 768, 1024 y 1440 píxeles. Sin desbordamiento horizontal de la página. Las tablas extensas tienen su propio desplazamiento horizontal en móvil.

Las nueve rutas revisadas fueron `/`, `/candidatos`, `/candidatos/nuevo`, `/candidatos/CAN-001`, `/solicitudes`, `/solicitudes/nueva`, `/solicitudes/SOL-008`, `/indicadores` y una ruta inexistente. La comprobación en navegador complementa las 32 pruebas de Vitest y no se cuenta como parte de ellas.

## Comprobación manual para la presentación

1. Inicia `npm run dev` y abre la dirección indicada por Vite.
2. Registra un candidato con un correo ficticio `example.com`. Antes, envía el formulario vacío para mostrar sus errores.
3. Desde la ficha crea una solicitud; comprueba que el candidato y el cargo ya están seleccionados.
4. Completa evaluador y fecha; encuentra la solicitud mediante búsqueda y filtros.
5. Intenta cambiar el estado sin observación; después escribe una nota y avanza a En evaluación.
6. Completa el proceso con otra nota. Comprueba el historial y que el proceso cerrado no permite nuevos cambios.
7. Recarga; consulta la misma solicitud y los indicadores.
8. En las herramientas del navegador, prueba un ancho móvil y el menú de navegación.

## Límites de esta evidencia

No valida backend, autenticación, base de datos, correos, resultados psicológicos, seguridad productiva ni concurrencia entre usuarios. No es una auditoría completa de accesibilidad o de compatibilidad entre navegadores. `localStorage` sirve solo para la demostración en el mismo navegador y origen.
