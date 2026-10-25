# Guion de presentación — AquaEval

Duración aproximada: 23 minutos entre Crisobal Valenzuela, Joaquin Caceres y Matias Miranda. Los tiempos incluyen hablar, escribir en los formularios, cambiar de pantalla y mostrar código. Ensayen con cronómetro: no son 23 minutos de lectura seguida.

Este es un reparto para exponer. Cuando expliquen sus aportes personales, mencionen solamente el trabajo que efectivamente realizó cada uno. La rúbrica evalúa individualmente, así que los tres deben entender el recorrido completo.

## Reparto

| Tiempo      | Integrante | Tema                                                     |
| ----------- | ---------- | -------------------------------------------------------- |
| 0:00–6:00   | Crisobal   | Problema, candidatos, componentes y formulario           |
| 6:00–12:00  | Joaquin    | Solicitudes, búsqueda, filtros y seguimiento             |
| 12:00–18:00 | Matias     | Indicadores, integración, navegación y diseño responsive |
| 18:00–21:00 | Los tres   | Ejecutar Vitest y explicar cinco casos                   |
| 21:00–23:00 | Los tres   | Cierre breve y preguntas                                 |

## Antes de empezar

- Abrir el proyecto en VS Code y ejecutar `npm.cmd run dev`.
- Abrir la aplicación y dejar una segunda terminal disponible para `npm.cmd test`.
- Dejar abiertos `src/pages/Candidates.jsx`, `src/pages/Requests.jsx`, `src/components/UI.jsx`, `src/context/ProjectContext.jsx`, `src/pages/Indicators.jsx`, `src/App.jsx`, `src/lib/domain.test.js` y `src/App.test.jsx`.
- Aumentar el tamaño de letra de VS Code y del navegador para que el profesor pueda leer.
- Preparar estos datos ficticios: Sofía Demo, `sofia.exposicion@example.com`, Analista de calidad, Puerto Montt. Si ya usaron ese correo en un ensayo, cambien a uno nuevo.
- Para la solicitud, usar Daniela Pérez como evaluadora ficticia, una fecha de la semana siguiente y prioridad Alta.
- No memorizar cantidades ni identificadores: pueden cambiar al repetir la demostración.

## 0:00–6:00 · Crisobal

### 0:00–1:30 · Presentar el problema y el alcance

**Mostrar:** resumen general de la aplicación.

**Crisobal:**

> Buenos días, profesor. Somos Crisobal Valenzuela, Joaquin Caceres y Matias Miranda. Vamos a mostrar AquaEval, que es nuestro avance del proyecto VcM con AquaChile.
>
> El problema que buscamos abordar es la organización de las evaluaciones psicolaborales. En este proceso hace falta saber quién es el candidato, para qué cargo se está evaluando, quién está a cargo y en qué estado va la solicitud.
>
> La idea de la aplicación es reunir esa información y poder seguir el proceso desde el registro del candidato hasta el cierre de su solicitud. Primero voy a mostrar el registro de candidatos, después Joaquin seguirá con una solicitud y Matias mostrará los indicadores y cómo se conectan las pantallas.
>
> Esta entrega está hecha en React y todavía funciona solo como frontend. Los datos que van a ver son ficticios y se guardan en este navegador. No tenemos conectado un backend ni una base de datos, y tampoco estamos realizando una evaluación psicológica real.

### 1:30–3:30 · Registrar un candidato

**Hacer:** entrar a Candidatos y luego a Nuevo candidato. Enviar el formulario vacío y mostrar los errores. Completar los datos ficticios y registrarlo. Mostrar su ficha.

**Crisobal:**

> En Candidatos aparecen las personas registradas. Podemos buscarlas por nombre, correo o cargo, y también filtrar por sede. Esto sirve para encontrar a una persona antes de iniciar otra solicitud para ella.
>
> Voy a entrar al formulario de registro. Si intento enviarlo sin completar los datos, aparecen mensajes en los campos que faltan. También se revisa que el correo tenga un formato válido y que no esté repetido.
>
> Estas validaciones ayudan a que después no creemos una solicitud con un candidato incompleto o registremos dos veces el mismo correo. Se hacen en el frontend; cuando exista el backend, también habrá que validar ahí.
>
> Ahora completo el nombre, el correo ficticio, el cargo y la sede. Al registrar, la aplicación abre la ficha de esta persona. Desde aquí podemos revisar sus datos y crear una solicitud asociada a ella.

**Pausa:** dejar que se vea la ficha antes de cambiar a VS Code.

### 3:30–6:00 · Explicar el código del formulario y del listado

**Mostrar:** `CandidateForm` en `src/pages/Candidates.jsx`. Señalar `useState`, `change` y `submit`. Después mostrar `filtered.map` en el mismo archivo y el componente `Field` de `src/components/UI.jsx`.

**Crisobal:**

> En el código, este componente se llama CandidateForm. Aquí usamos useState para guardar lo que se escribe en el formulario. Tenemos un estado para los valores y otro para los errores.
>
> El value del campo muestra lo que está guardado en ese estado. Cuando escribimos, se ejecuta onChange y se actualiza el valor. Cuando enviamos el formulario, se ejecuta onSubmit.
>
> En submit aparece preventDefault. Eso evita el envío normal del formulario, que recargaría la página. Después se llama a addCandidate. Si la validación encuentra errores, los mostramos; si el registro es correcto, navegamos a la ficha del candidato.
>
> Este Field es un componente que se usa para distintos campos. Recibe datos como el nombre de la etiqueta y el error que debe mostrar. Esos datos que recibe son las props. Esto permite usar la misma estructura en varios formularios.
>
> En el listado usamos un arreglo de candidatos. Primero se filtran los que coinciden con la búsqueda y después map genera una fila por cada candidato. El id se usa como key para que React identifique cada fila.
>
> Con esto ya tenemos al candidato registrado y listo para continuar. Ahora Joaquin va a crear una solicitud para esta misma persona.

## 6:00–12:00 · Joaquin

### 6:00–8:00 · Crear una solicitud desde la ficha

**Hacer:** desde la ficha recién creada, pulsar Crear solicitud. Mostrar el candidato y el cargo precargados. Intentar enviar sin evaluador ni fecha; luego completarlos y crear la solicitud con prioridad Alta.

**Joaquin:**

> Voy a continuar desde la ficha que acabamos de crear. Al entrar a Crear solicitud, el candidato y el cargo ya aparecen seleccionados. Esto conecta las pantallas y evita tener que volver a escribir todos sus datos.
>
> La solicitud tiene un evaluador responsable, una fecha objetivo y una prioridad. La fecha es una referencia para organizar el proceso; no significa que la aplicación vaya a realizar la evaluación automáticamente.
>
> Si intento crearla sin el evaluador o sin una fecha válida, aparecen los mensajes y no se guarda. Ahora completo esos campos y la creo.
>
> La nueva solicitud comienza en Pendiente. En este detalle podemos consultar el candidato, el cargo, la persona responsable y el historial. Todo corresponde a la solicitud que acabamos de registrar.

**Mostrar:** `RequestForm` en `src/pages/Requests.jsx`, especialmente `candidateId`, los valores iniciales y las clases `col-md-6` de los campos.

**Joaquin:**

> En RequestForm se guarda el candidateId, que identifica al candidato asociado. Así la solicitud queda relacionada con esa persona mediante su id.
>
> Igual que en el formulario anterior, los campos usan estado y eventos. Aquí también usamos columnas de Bootstrap: col-md-6 permite que dos campos se muestren lado a lado desde el tamaño mediano. En una pantalla pequeña quedan uno debajo del otro.

### 8:00–9:30 · Buscar y filtrar la solicitud

**Hacer:** ir a Solicitudes. Buscar “sofia”, elegir estado Pendiente y prioridad Alta. Después escribir un texto sin coincidencias para mostrar el estado vacío. Volver a buscar a Sofía y abrir su solicitud.

**Joaquin:**

> En Solicitudes podemos buscar por candidato, identificador, cargo o evaluador. También se pueden combinar los filtros de estado y prioridad.
>
> Aquí busco a la persona que acabamos de registrar y selecciono Pendiente y Alta. La lista muestra los registros que cumplen esas condiciones al mismo tiempo. Esto ayuda a revisar un grupo de solicitudes sin recorrer toda la tabla.
>
> Si escribo algo que no existe, aparece el mensaje de que no hay resultados. Ese es un ejemplo de renderizado condicional: según los datos, mostramos la tabla o el mensaje.
>
> La tabla es el componente RequestsTable. Recibe las solicitudes y los candidatos por props, y también se usa en otras pantallas. Se reutiliza el componente, pero recibe los datos que corresponden a cada vista.

**Mostrar brevemente:** llamada a `RequestsTable` y condición `filtered.length` en `src/pages/Requests.jsx`.

### 9:30–12:00 · Cambiar el estado y revisar el historial

**Hacer:** abrir la solicitud. Elegir En evaluación e intentar guardar sin observación. Escribir “Entrevista de demostración coordinada” y guardar. Luego elegir Completada, escribir “Seguimiento de demostración finalizado” y guardar.

**Joaquin:**

> Ahora voy a pasar la solicitud de Pendiente a En evaluación. Para guardar el cambio se pide una observación. Si no la escribo, aparece el error. Esto permite dejar una explicación del paso que se está registrando.
>
> Al guardar, cambia el estado y se agrega una entrada al historial con la fecha y la observación. La entrada anterior se conserva, así podemos revisar cómo fue avanzando el proceso.
>
> Ahora la marco como Completada y agrego otra observación. El formulario de actualización deja de aparecer porque el proceso ya está cerrado. Completada significa que terminó el seguimiento; no significa que el candidato sea apto o no apto.

**Mostrar:** `allowedTransitions` en `src/lib/domain.js` y la función `updateStatus` en `src/context/ProjectContext.jsx`.

**Joaquin:**

> En allowedTransitions se definen los cambios permitidos. Desde Pendiente se puede pasar a En evaluación o Cancelada. Desde En evaluación se puede pasar a Completada o Cancelada. Los estados finales ya no tienen otro paso disponible.
>
> En updateStatus se comprueba esa regla y se agrega el nuevo registro al historial. Estas son reglas de nuestro prototipo y tendrían que revisarse con los responsables del proceso para una versión real.
>
> Con esto ya vimos el recorrido desde el candidato hasta el cierre de la solicitud. Matias va a mostrar cómo se refleja en el resto de la aplicación.

## 12:00–18:00 · Matias

### 12:00–14:00 · Indicadores e integración

**Hacer:** volver al Resumen general y abrir Indicadores. Mostrar que las cantidades incluyen la solicitud que se acaba de completar. Señalar la carga de evaluadores.

**Matias:**

> En el resumen aparecen el total de solicitudes y las cantidades por estado. Estos números se calculan desde las solicitudes que tiene guardadas la aplicación. Al crear una solicitud o cambiar su estado, se vuelve a mostrar el cálculo con esos datos.
>
> Por eso la solicitud que acabamos de completar también se refleja aquí. La idea es poder revisar cuántos procesos faltan por iniciar, cuáles están en evaluación y cuáles terminaron, sin tener que contarlos a mano.
>
> En Indicadores también mostramos la carga por evaluador. Se cuentan como activas las solicitudes pendientes y las que están en evaluación. Esto permite ver cómo están distribuidas las solicitudes; no se está midiendo el desempeño del profesional.

**Mostrar:** `src/pages/Indicators.jsx`, el uso de `<MetricCards requests={requests} />` y el `.map()` de evaluadores. Mostrar `getMetrics` en `src/lib/domain.js`.

**Matias:**

> MetricCards recibe las solicitudes por props y se usa tanto en el resumen como en indicadores. Así mostramos las mismas tarjetas sin copiar todo el componente.
>
> En este map se arma la lista de evaluadores y, para cada uno, se cuentan sus solicitudes activas. En getMetrics se calculan los totales por estado. Son cálculos sobre los datos actuales, no números escritos directamente en la pantalla.

### 14:00–16:00 · Estado compartido y guardado local

**Mostrar:** `ProjectProvider`, el `useState` de `data` y el `useEffect` que guarda en `localStorage`, en `src/context/ProjectContext.jsx`. Volver al navegador y recargar. Si hace falta, buscar nuevamente a Sofía con los filtros limpios.

**Matias:**

> En ProjectContext está el estado que comparten las pantallas. Allí se guardan los candidatos y las solicitudes, y también están las funciones para crear registros y cambiar estados.
>
> El Provider permite que las vistas usen esos mismos datos. Cuando agregamos una solicitud desde el formulario, después podemos verla en el listado, en el detalle y en los indicadores.
>
> Con useState manejamos los datos mientras la aplicación está abierta. Este useEffect los guarda en localStorage cuando cambian. Al volver a abrir la aplicación, se intenta leer ese guardado.
>
> Voy a recargar para mostrar que el registro sigue disponible. Esto funciona en este navegador y esta misma dirección. No es una base de datos compartida: si abro la aplicación en otro computador, esos cambios no van a aparecer. Para eso falta conectar el backend y la base de datos.

### 16:00–18:00 · Navegación y diseño responsive

**Mostrar:** rutas en `src/App.jsx` y `BrowserRouter` en `src/main.jsx`. En el navegador, reducir el ancho y abrir el menú móvil; mostrar un formulario y el desplazamiento de la tabla.

**Matias:**

> La navegación está hecha con React Router. En App.jsx están las rutas para los candidatos, las solicitudes y los indicadores. Las rutas con dos puntos, como candidatos/:id, permiten abrir el detalle de un registro concreto.
>
> Los enlaces entre estas vistas usan Link y, después de guardar un formulario, usamos useNavigate. Eso permite cambiar de pantalla dentro de la aplicación sin recargar toda la página como ocurriría con una navegación normal del navegador.
>
> Para el diseño usamos Bootstrap 5 y algunos estilos propios para los colores y la distribución. Al reducir la pantalla, el menú se puede abrir con este botón y las columnas de los formularios se apilan.
>
> En las tablas mantenemos el desplazamiento horizontal cuando no caben todas las columnas. Así se puede consultar la información desde una pantalla pequeña sin que se desordene toda la página.
>
> Ahora vamos a ejecutar las pruebas. Entre los tres vamos a explicar cinco casos para mostrar qué revisan y por qué sirven dentro de este flujo.

## 18:00–21:00 · Pruebas entre los tres

**Hacer:** volver al ancho normal. En una segunda terminal, desde la carpeta que contiene `package.json`, ejecutar:

```powershell
npm.cmd test
```

Esperar el resultado antes de decir cuántas pasaron. La versión revisada tiene 32 casos en dos archivos. Si el resultado del día es distinto, expliquen lo que realmente aparece.

### Crisobal · Correo inválido y duplicado

**Mostrar:** en `src/lib/domain.test.js`, los casos “rechaza un nombre demasiado corto y un correo inválido” y “evita duplicados de correo con mayúsculas y espacios”.

**Crisobal:**

> Primero tenemos este caso que envía un correo sin un formato válido y comprueba que se devuelva un error. El expect es la comprobación: indica el resultado que esperamos de la función.
>
> El segundo intenta usar un correo que ya existe, pero con mayúsculas y espacios. Se espera que también lo detecte como repetido. Esto sirve para evitar que pequeñas diferencias al escribir permitan duplicar el mismo correo.

### Joaquin · Fecha inválida y filtros combinados

**Mostrar:** en el mismo archivo, los casos “rechaza la fecha inválida” y “combina búsqueda, estado y prioridad sin modificar el arreglo original”.

**Joaquin:**

> Este caso prueba fechas que no son válidas, como el 30 de febrero, y espera que aparezca un error. Está hecho para comprobar la regla de validación, además de lo que permite ingresar el campo de fecha en la pantalla.
>
> Este otro combina búsqueda, estado y prioridad y revisa qué solicitudes devuelve. También comprueba que el arreglo original siga igual. Esto ayuda a detectar un filtro que muestre registros que no corresponden o modifique los datos al buscar.

### Matias · Recorrido completo y resultado

**Mostrar:** en `src/App.test.jsx`, el caso “registra, solicita, actualiza con trazabilidad y recupera el proceso al volver a abrir la aplicación”. Volver al resultado de la terminal.

**Matias:**

> En este archivo hay una prueba del recorrido completo. Simula registrar un candidato, crear su solicitud, cambiar los estados y comprobar el historial. También vuelve a montar la aplicación para revisar que recupere el guardado local.
>
> Las primeras pruebas que mostramos son unitarias: revisan funciones concretas. Esta es de integración, porque comprueba varias partes trabajando juntas. Las dos clases de pruebas se ejecutan con Vitest.
>
> Aquí leemos el resultado de la terminal. Si dice 32 passed, significa que pasaron los 32 casos. Están agrupados en dos archivos; no son solamente dos pruebas. Esto comprueba esos comportamientos, aunque no garantiza que toda la aplicación esté libre de errores.

## 21:00–23:00 · Cierre y preguntas

**Matias:**

> Con esto terminamos la demostración. El avance permite registrar candidatos, crear solicitudes, encontrar los procesos y seguir sus cambios hasta el cierre. Para la siguiente etapa falta el backend, la base de datos y el acceso con usuarios. Gracias, profesor; quedamos atentos a sus preguntas.

El cierre debe ser breve para dejar casi todo este bloque disponible para preguntas. Si el profesor las hace durante la demostración, pueden usar este tiempo como margen. Si no hay preguntas, vuelvan al caso de Sofía y hagan un repaso corto del recorrido.

## Respuestas para practicar

Estas son preguntas posibles, no preguntas confirmadas del profesor. Los tres deben poder responderlas con sus palabras.

**¿Qué diferencia hay entre props y estado?**

> Las props son datos que recibe un componente. El estado son los datos que pueden cambiar, como lo que estamos escribiendo en un formulario. En este proyecto, una tabla recibe solicitudes por props y el formulario usa estado para sus campos.

**¿Para qué usan map y filter?**

> Con filter seleccionamos los registros que coinciden con la búsqueda. Con map convertimos esos registros en las filas que se ven en la tabla.

**¿Qué es renderizado condicional?**

> Mostrar algo dependiendo de una condición. Por ejemplo, si hay resultados mostramos la tabla; si no, mostramos un mensaje. Si una solicitud está cerrada, mostramos esa información en vez del formulario para cambiar su estado.

**¿Por qué usan React Router?**

> Para conectar las pantallas y abrir registros por su id dentro de la misma aplicación. Por ejemplo, pasar del listado a la ficha de un candidato.

**¿Qué pasa si el formulario tiene errores?**

> Se muestran los mensajes y no se crea el registro. Además, el foco pasa al primer campo con error para que se pueda corregir.

**¿Por qué guardan con localStorage y no en una base de datos?**

> En esta entrega se permite trabajar con datos simulados y todavía no está conectado el backend. localStorage permite mantener la demostración al recargar, pero solo guarda en ese navegador y origen.

**¿Qué significa Completada?**

> Que terminó el seguimiento de esa solicitud en el prototipo. No significa que la aplicación haya determinado si una persona es apta para un cargo.

**¿Qué aporta esto al problema de AquaChile?**

> Permite relacionar a cada candidato con sus solicitudes, identificar al responsable y revisar el estado y los cambios del proceso. Los indicadores resumen esa misma información.

**¿Por qué hay 32 pruebas si se pidieron cinco?**

> Hay varios casos para las validaciones, los filtros y la integración. Mostramos cinco ejemplos, pero el comando ejecuta todos. La cantidad por sí sola no asegura calidad; cada prueba debe comprobar un comportamiento útil.

**¿Qué hizo cada integrante?**

Respondan según sus aportes reales y muestren los cambios que correspondan. El reparto de este guion no establece quién programó cada función.

## Recordatorios para el ensayo

- Usar el mismo candidato durante toda la demostración.
- Dejar limpios los filtros al buscar una solicitud cuyo estado ya cambió.
- No decir que guardar una solicitud envía un correo o notifica al evaluador: eso no está implementado.
- Cada uno debe poder explicar también las partes de sus compañeros, porque la presentación se evalúa individualmente.
- Ensayar los cambios entre navegador, VS Code y terminal; son parte del tiempo.
- Hablar con sus palabras. Si una explicación no les queda clara, practiquen con el código abierto antes de memorizarla.
