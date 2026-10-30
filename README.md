# AquaEval

Proyecto de Desarrollo Full Stack II (DSY1104), segunda entrega de VcM con AquaChile.

La aplicación permite registrar candidatos y organizar sus solicitudes de evaluación psicolaboral. La idea es poder revisar quién está pendiente, quién está en evaluación y qué procesos ya terminaron, junto con el responsable de cada solicitud.

Por ahora funciona solo el frontend. Los datos son ficticios y los cambios se guardan en el navegador con `localStorage`.

## Integrantes

- Crisobal Valenzuela
- Joaquin Caceres
- Matias Miranda

## Funciones de esta entrega

- Registrar, editar y consultar candidatos, incluyendo teléfono y familia de cargo.
- Crear solicitudes con candidato, cargo, familia de cargo, evaluador, fecha y prioridad.
- Buscar candidatos y filtrar solicitudes por estado y prioridad.
- Registrar la fecha, el resultado u observaciones y el estado de una evaluación.
- Cambiar el estado de una solicitud y guardar una observación en su historial.
- Ver las cantidades por estado y las solicitudes que tiene cada evaluador.

Los formularios revisan los campos obligatorios, los correos repetidos y las fechas válidas. El teléfono se valida si se completa; puede quedar pendiente. La familia de cargo comienza en “Por definir” para mantener los registros anteriores. Editar un candidato no cambia el cargo ni la familia de sus solicitudes históricas.

El recorrido principal es registrar un candidato, crear su solicitud, registrar la evaluación y seguir el estado hasta terminar el proceso o cancelarlo. Una evaluación registrada en una solicitud completada queda solo para consulta. Si una solicitud antigua ya estaba completada y no tenía evaluación, permite agregarla una vez sin reabrir el proceso.

## Acceso de demostración

Al abrir la aplicación aparece el login. Todas estas cuentas usan la contraseña pública **`Demo1234`**:

- `analista@example.com`: analista de reclutamiento. Registra y edita candidatos, crea solicitudes y consulta las evaluaciones.
- `daniela@example.com`: profesional evaluador, Daniela Pérez.
- `martin@example.com`: profesional evaluador, Martín Herrera.

Cada evaluador ve solo sus solicitudes asignadas y puede registrar su evaluación y actualizar el estado. Para cambiar de perfil, usar **Cerrar sesión**.

Es un login simulado en el frontend, no una autenticación segura de producción. No usen contraseñas ni datos personales reales. La sesión guarda solo el identificador de la cuenta en `sessionStorage` de la pestaña; los candidatos y las solicitudes siguen en `localStorage`.

## Tecnologías

React con Vite, Bootstrap 5, React Router y Vitest.

## Contenidos de la entrega

- ✔️ Frontend desarrollado en React.
- ✔️ Diseño responsivo utilizando Bootstrap 5.
- ✔️ Componentes reutilizables, props, arrays y `.map()`.
- ✔️ Gestión de estados con `useState`.
- ✔️ Eventos, filtros y renderizado condicional.
- ✔️ Formularios funcionales con validaciones.
- ✔️ Navegación entre interfaces mediante React Router.
- ✔️ Integración y funcionamiento coherente de las interfaces.
- ✔️ Pruebas unitarias utilizando Vitest.
- ✔️ Avances funcionales que responden a la problemática de AquaChile.

**Importante:** Cada funcionalidad debe tener sentido dentro del proyecto y contribuir a resolver la problemática planteada.

En esta entrega, los contenidos se aplican al mismo recorrido: registrar un candidato, crear su solicitud y seguir su evaluación. Los filtros permiten encontrar los procesos y los indicadores muestran cuántos están pendientes, en evaluación o completados.

## Cómo ejecutar

Se necesita Node.js 24 LTS, desde la versión 24.15.

1. Descargar o clonar el repositorio.
2. Abrir en VS Code la carpeta que contiene `package.json`.
3. Ejecutar en la terminal:

```powershell
npm.cmd ci
npm.cmd run dev
```

Después, abrir la dirección que aparece en la terminal. Para detenerlo, usar `Ctrl+C`.

En otras terminales también se pueden usar `npm ci` y `npm run dev`.

## Pruebas

Para ejecutar las pruebas con Vitest:

```powershell
npm.cmd test
```

Hay pruebas de validación, búsqueda, filtros, estados y del recorrido completo de candidato a solicitud. En la última ejecución pasaron las 32 pruebas.

Los casos y resultados están en [Pruebas](docs/PRUEBAS.md), y el reporte de esa ejecución está en [vitest-results.json](artifacts/vitest-results.json).

Para generar la versión de producción se usa `npm.cmd run build`. La comparación con el proyecto de referencia y los pasos para revisar los nuevos roles están en [Revisión del login](docs/REVISION_LOGIN.md).

## Qué falta

Falta conectar el frontend a un backend y una base de datos, validar las cuentas y los permisos en el servidor e implementar los informes y las notificaciones. Esta entrega no realiza evaluaciones psicológicas reales.

El alcance implementado y los requisitos pendientes están en [Requisitos](docs/REQUISITOS.md).
