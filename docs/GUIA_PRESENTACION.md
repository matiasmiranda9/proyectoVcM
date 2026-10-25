# Guía de presentación individual

Recorrido sugerido de **5 a 7 minutos**. Ensaya con la aplicación abierta y una terminal en la carpeta del proyecto. Utiliza solo datos ficticios y explica cada acción con tus propias palabras.

## Antes de presentar

- Ejecuta `npm ci`, `npm test` y `npm run build` para comprobar tu copia del proyecto.
- Inicia `npm run dev` y abre la aplicación.
- Revisa que GitHub contenga la versión que mostrarás y los aportes reales de cada integrante.
- Ten a mano `src/App.jsx`, las vistas en `src/pages/`, los componentes de `src/components/`, el estado compartido en `src/context/` y `src/lib/domain.js` con sus pruebas.
- Consulta [PRUEBAS.md](PRUEBAS.md) para distinguir casos ejecutados, resultados y limitaciones.

## 0:00–0:45 · Explicar el problema y el alcance

Explica que el prototipo organiza el recorrido de un candidato, la creación de su solicitud y el seguimiento de la evaluación. Muestra el panel y relaciona los indicadores con la necesidad de conocer el avance de las solicitudes.

Aclara que es un frontend académico: los datos son ficticios, los cambios viven en el navegador y todavía no hay backend, autenticación ni una evaluación psicológica real. No presentes `Completada` como una decisión sobre la aptitud de una persona.

## 0:45–2:00 · Registrar y consultar un candidato

Abre el formulario y envíalo incompleto para mostrar validaciones observables. Registra después una persona ficticia, por ejemplo con correo del dominio `example.com`, y localízala en el listado.

En el código, señala cómo `useState` conserva los valores, cómo `onChange` y `onSubmit` reaccionan a los eventos y cómo los errores se muestran condicionalmente. Explica qué información recibe un componente mediante props y dónde se usa `.map()` para construir la lista.

## 2:00–3:30 · Crear y seguir una solicitud

Crea una solicitud para el candidato que acabas de registrar. Muestra el responsable, la fecha, la prioridad y el estado inicial. Busca el registro y combina filtros de estado y prioridad.

Abre el detalle, cambia de `Pendiente` a `En evaluación` y luego a `Completada`. Muestra el historial, la ausencia de nuevas transiciones en el estado final y el efecto en los indicadores. Recarga para demostrar la persistencia local.

Explica por qué la solicitud referencia al candidato y qué problema producirían datos duplicados o un estado que cambiara sin conservar el historial.

## 3:30–4:30 · Explicar navegación y responsive

Señala las rutas en `src/App.jsx` y explica cómo React Router permite conectar listados, formularios y detalles. Muestra un componente compartido y sus props concretas.

Reduce el ancho de la ventana o usa la vista de dispositivos del navegador. Señala las clases Bootstrap 5 que permiten adaptar la distribución. Explica una decisión de diseño, por ejemplo cómo se mantiene accesible un formulario o un listado en una pantalla pequeña.

## 4:30–6:00 · Ejecutar y explicar Vitest

En la terminal, ejecuta:

```bash
npm test
```

Espera a que termine y lee el resultado real. Abre una prueba y explica sus datos de entrada, la acción y la expectativa. Puedes elegir un correo duplicado, filtros combinados, un indicador o una transición de estado no permitida.

Explica qué fallo detectaría ese caso y por qué ayuda al flujo VcM. No confundas una compilación exitosa con pruebas de comportamiento. Si hay un caso fallido, identifica qué está fallando; no describas como aprobadas pruebas que no se ejecutaron.

## 6:00–7:00 · Aporte propio y siguiente etapa

Muestra tu contribución real y explica una decisión que hayas implementado o comprendido. Describe qué requeriría pasar de datos locales a una API con base de datos, autenticación y controles de acceso. Relaciona las limitaciones con el alcance de la entrega parcial.

## Preguntas para practicar

| Pregunta                                                      | Qué debes poder explicar con código                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ¿Qué diferencia hay entre props y estado?                     | Un dato recibido por un componente y un valor que cambia mediante `useState`. |
| ¿Por qué `.map()` necesita una clave estable?                 | Cómo React identifica cada candidato o solicitud por su `id`.                 |
| ¿Qué ocurre cuando no hay coincidencias?                      | El renderizado condicional del estado vacío.                                  |
| ¿Dónde se valida el formulario?                               | Las reglas del dominio y cómo se traducen en errores visibles.                |
| ¿Por qué no se puede cambiar una solicitud completada?        | La regla de estados finales y las transiciones disponibles.                   |
| ¿Por qué los indicadores cambian al actualizar una solicitud? | La colección compartida y los cálculos derivados de ella.                     |
| ¿Qué cubren las pruebas y qué queda fuera?                    | Casos comprobados y ausencia de integración con backend real.                 |
| ¿Dónde quedan los datos al recargar?                          | `localStorage`, su alcance por navegador/origen y sus límites.                |

La rúbrica asigna **40% al encargo grupal y 60% a la presentación individual**. Repartir tareas no sustituye conocer el recorrido completo; cada integrante debe poder ejecutarlo y justificar su propio aporte.
