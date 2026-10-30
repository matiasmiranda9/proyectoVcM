# AquaEval

Proyecto de Desarrollo Full Stack II (DSY1104), segunda entrega de VcM con AquaChile.

La aplicación permite registrar candidatos y organizar sus solicitudes de evaluación psicolaboral. La idea es poder revisar quién está pendiente, quién está en evaluación y qué procesos ya terminaron, junto con el responsable de cada solicitud.

Por ahora funciona solo el frontend. Los datos son ficticios y los cambios se guardan en el navegador con `localStorage`.

## Integrantes

- Crisobal Valenzuela
- Joaquin Caceres
- Matias Miranda

## Funciones de esta entrega

- Registrar candidatos y consultar sus datos.
- Crear solicitudes con candidato, cargo, evaluador, fecha y prioridad.
- Buscar candidatos y filtrar solicitudes por estado y prioridad.
- Cambiar el estado de una solicitud y guardar una observación en su historial.
- Ver las cantidades por estado y las solicitudes que tiene cada evaluador.

Los formularios revisan los campos obligatorios, los correos repetidos y las fechas válidas. El recorrido principal es registrar un candidato, crear su solicitud y actualizar el estado hasta terminar el proceso o cancelarlo.

## Tecnologías

React con Vite, Bootstrap 5, React Router y Vitest.


## Cómo ejecutar

Se necesita Node.js 24 LTS, desde la versión 24.15.

1. Descargar o clonar el repositorio.
2. Abrir en VS Code la carpeta que contiene `package.json`.
3. Ejecutar en la terminal:

```bash
npm ci
npm run dev
```

Después, abrir la dirección que aparece en la terminal. Para detenerlo, usar `Ctrl+C`.

En PowerShell, si `npm` da problemas con los permisos de scripts, se pueden usar `npm.cmd ci` y `npm.cmd run dev`.

## Pruebas

Para ejecutar las pruebas con Vitest:

```bash
npm test
```

Hay pruebas de validación, búsqueda, filtros, estados y del recorrido completo de candidato a solicitud. En la última ejecución pasaron las 32 pruebas.

Los casos y resultados están en [Pruebas](docs/PRUEBAS.md), y el reporte de esa ejecución está en [vitest-results.json](artifacts/vitest-results.json).

Para generar la versión de producción se usa `npm run build`.

## Qué falta

Falta conectar el frontend a un backend y una base de datos, agregar inicio de sesión y permisos, e implementar los informes y las notificaciones. Esta entrega no realiza evaluaciones psicológicas reales.

El alcance implementado y los requisitos pendientes están en [Requisitos](docs/REQUISITOS.md).
