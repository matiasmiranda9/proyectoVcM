# Requisitos y alcance · Entrega parcial 2

## Problema y propósito

El proyecto VcM necesita representar un proceso coherente para registrar candidatos, solicitar evaluaciones psicolaborales y consultar su seguimiento. El frontend reúne esa información y permite visualizar el avance del proceso sin depender de planillas o pantallas desconectadas durante la demostración.

Este documento describe el alcance académico de la segunda entrega para el caso AquaChile. Las reglas son decisiones del prototipo y deberán validarse con los responsables del proceso antes de una implementación real.

## Alcance de la entrega

Aplicación React con Vite, Bootstrap 5, React Router y Vitest. Un usuario de demostración puede consultar y registrar candidatos ficticios, crear solicitudes, filtrarlas, actualizar su estado y visualizar indicadores. Los cambios se conservan en el `localStorage` del navegador.

No hay autenticación, autorización, backend ni base de datos. Tampoco se generan diagnósticos, puntajes psicométricos ni decisiones automáticas sobre candidatos. Los datos deben permanecer ficticios o anonimizados y no deben incluir información clínica.

## Requisitos funcionales y criterios de aceptación

| ID    | Requisito                            | Criterio verificable                                                                                                                                                      |
| ----- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | Consultar candidatos.                | El listado presenta los candidatos disponibles y permite acceder al detalle de uno de ellos.                                                                              |
| RF-02 | Registrar un candidato.              | El formulario requiere nombre, correo, cargo y sede; rechaza nombre demasiado corto, correo inválido y correo ya registrado. Un registro válido aparece en el listado.    |
| RF-03 | Crear una solicitud.                 | Se debe seleccionar un candidato existente e indicar cargo, evaluador, fecha válida y prioridad. Una solicitud válida queda en estado `Pendiente`.                        |
| RF-04 | Relacionar candidatos y solicitudes. | El detalle de una solicitud muestra el candidato asociado; los cambios se basan en una única colección compartida.                                                        |
| RF-05 | Buscar y filtrar solicitudes.        | La búsqueda encuentra coincidencias por candidato, identificador, cargo o evaluador, sin depender de mayúsculas ni tildes; los filtros de estado y prioridad se combinan. |
| RF-06 | Actualizar el estado.                | `Pendiente` admite `En evaluación` o `Cancelada`; `En evaluación` admite `Completada` o `Cancelada`. Los estados finales no admiten más cambios.                          |
| RF-07 | Mantener trazabilidad.               | El detalle muestra el historial de estados y la fecha de cada cambio realizado en la demostración.                                                                        |
| RF-08 | Consultar indicadores.               | El total y las cantidades por estado se calculan desde las solicitudes actuales y reflejan los cambios sin recargar manualmente los datos.                                |
| RF-09 | Navegar entre vistas.                | React Router permite ir entre inicio, candidatos, solicitudes, detalles y panel de indicadores. Los enlaces tienen destinos funcionales.                                  |
| RF-10 | Conservar la demostración local.     | Un registro o cambio de estado válido permanece después de recargar en el mismo navegador y origen. La interfaz informa que se trata de almacenamiento local simulado.    |
| RF-11 | Mostrar resultados de interacción.   | Se presentan errores junto a los campos y un estado vacío cuando una búsqueda no encuentra registros.                                                                     |

## Requisitos técnicos y de calidad

| ID    | Requisito                                              | Evidencia                                                                          |
| ----- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| RT-01 | Componentes funcionales React reutilizables con props. | Componentes compartidos usados en más de una vista.                                |
| RT-02 | Datos en arrays y renderizado con `.map()`.            | Listados e historial generados desde las colecciones.                              |
| RT-03 | Estado con `useState`, eventos y condicionales.        | Formularios, filtros y actualización de la interfaz al interactuar.                |
| RT-04 | Bootstrap 5 y diseño responsive.                       | Formularios, navegación y listados utilizables en escritorio y pantalla pequeña.   |
| RT-05 | Pruebas automatizadas con Vitest.                      | `npm test` ejecuta casos pertinentes y produce resultados verificables.            |
| RT-06 | Compilación reproducible.                              | `npm ci` y `npm run build` completan con las versiones del archivo de bloqueo.     |
| RT-07 | Datos ficticios y simulación explícita.                | Correos de ejemplo, aviso en la interfaz y documentación del almacenamiento local. |

## Reglas de negocio del prototipo

1. Una solicitud siempre referencia un candidato existente.
2. El correo de un candidato debe ser válido y único, ignorando mayúsculas y minúsculas.
3. Las prioridades disponibles son `Normal` y `Alta`.
4. Las solicitudes comienzan en `Pendiente` y solo siguen las transiciones definidas en RF-06.
5. Marcar una solicitud `Completada` cierra su seguimiento; no certifica aptitud laboral ni constituye un resultado psicológico.
6. Los indicadores provienen de los registros actuales; no son cifras reales de AquaChile.
7. El historial y los registros locales no constituyen una auditoría de producción: el navegador puede modificarlos o eliminarlos.

## Recorrido de aceptación

1. Abrir la aplicación y comprobar los indicadores con los datos iniciales.
2. Intentar registrar un candidato con campos vacíos o correo inválido y observar los errores.
3. Registrar un candidato ficticio válido y localizarlo en el listado.
4. Crear una solicitud para ese candidato y abrir su detalle.
5. Encontrarla por búsqueda y por filtros de estado y prioridad.
6. Cambiar de `Pendiente` a `En evaluación`; comprobar el historial y los indicadores.
7. Completar la solicitud y comprobar que ya no permite nuevas transiciones.
8. Recargar y verificar la persistencia en ese navegador.
9. Ejecutar `npm test` y `npm run build`; contrastar resultados con la evidencia de [PRUEBAS.md](PRUEBAS.md).

## Fuera de alcance y siguiente etapa

- API y base de datos para persistencia centralizada y acceso concurrente.
- Autenticación, roles y permisos según las funciones reales de la organización.
- Revisión profesional de las reglas y del proceso de evaluación.
- Protección de datos personales, consentimiento, retención, cifrado y auditoría de producción.
- Informes profesionales, archivos adjuntos, notificaciones e integración con otros sistemas.
- Despliegue productivo, recuperación de datos y pruebas de integración con servicios reales.

Estas funciones son pendientes de la etapa Full Stack; no deben presentarse como implementadas en esta entrega.
