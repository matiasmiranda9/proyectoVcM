# Revisión del login y funciones nuevas

Se comparó AquaEval con el proyecto de referencia AquaSelect para revisar el acceso por roles, la edición de candidatos y el registro de evaluaciones. Se mantuvieron la interfaz y el responsive de AquaEval; no se copiaron sus estilos ni sus pruebas.

## Qué se agregó

- Login de demostración con analista de reclutamiento y profesionales evaluadores.
- El analista registra y edita candidatos, crea solicitudes y consulta evaluaciones.
- El evaluador consulta sus solicitudes asignadas y registra la evaluación y los cambios de estado.
- Teléfono y familia de cargo en candidatos, y familia de cargo en solicitudes.
- Edición de candidatos sin reescribir el cargo ni la familia de las solicitudes anteriores.
- Evaluación asociada a una solicitud: fecha de evaluación, resultado u observaciones generales y estado.

El teléfono es opcional y se valida cuando se ingresa. La familia comienza en “Por definir” para conservar los registros anteriores. Al completar un proceso con evaluación registrada, esta queda solo para consulta. Una solicitud antigua completada sin evaluación permite registrarla una vez sin cambiar su estado.

No se agregaron eliminación de registros ni reasignaciones que borren o reescriban el historial.

## Cuentas de prueba

Todas usan la contraseña pública `Demo1234`:

| Correo                 | Perfil                                |
| ---------------------- | ------------------------------------- |
| `analista@example.com` | Analista de reclutamiento             |
| `daniela@example.com`  | Profesional evaluador: Daniela Pérez  |
| `martin@example.com`   | Profesional evaluador: Martín Herrera |

Es una simulación del frontend. Las cuentas están definidas en el código y no sirven para proteger datos reales. La sesión de cada pestaña guarda solo el id en `sessionStorage`. Los datos de candidatos y solicitudes se conservan en `localStorage` del mismo navegador y origen. No hay autenticación de servidor ni base de datos.

## Cómo revisar ambos perfiles

1. Ejecutar `npm.cmd run dev` y abrir la aplicación.
2. Intentar ingresar con un correo o contraseña incorrectos y comprobar el mensaje.
3. Entrar como analista. Registrar un candidato ficticio con correo `example.com`, teléfono y familia de cargo. Abrir su ficha y editarlo.
4. Crear una solicitud para ese candidato, elegir su familia de cargo y asignarla a Daniela Pérez. Revisar que figure en el listado y en el detalle.
5. Cerrar sesión e ingresar como Daniela. Buscar esa solicitud dentro de las que tiene asignadas.
6. Registrar la evaluación con una fecha válida y un resultado u observaciones ficticias. Revisar la información guardada y el historial.
7. Actualizar la evaluación o el estado y completar el proceso. Comprobar que la evaluación registrada quede solo para consulta.
8. Cerrar sesión e ingresar como Martín. Comprobar que la solicitud asignada a Daniela no aparezca entre sus registros.
9. Volver al analista y consultar el proceso y sus indicadores.
10. Recargar para revisar la persistencia y probar el menú, formularios y tablas en un ancho de celular.

## Comprobaciones

Los archivos de las 32 pruebas originales se conservaron sin modificaciones. En la revisión actual, `npm.cmd test` terminó con **32 pruebas aprobadas** y `npm.cmd run build` terminó correctamente.

Las pruebas originales comprueban el alcance anterior. Los pasos de navegador de arriba permiten revisar específicamente el nuevo acceso, los roles, la edición y las evaluaciones. No se cambió la evidencia anterior de `docs/PRUEBAS.md` ni el reporte de `artifacts/`.

La revisión adicional en Chromium completó 12 escenarios de acceso, permisos, edición y evaluación. También se comprobaron 115 combinaciones de rutas, perfiles y anchos (320, 390, 768, 1024 y 1440 píxeles), sin errores JavaScript ni desbordamiento horizontal de la página.

Se comprobó por separado la carga de registros antiguos sin teléfono ni familia, conservando sus datos e historial, y el rechazo de una sesión inexistente. Los resultados están en `artifacts/revision-navegador.json`, `artifacts/revision-responsive.json` y `artifacts/revision-migracion.json`. La integridad de los archivos originales de pruebas y configuración se registra en `artifacts/revision-tests-originales.json`.
