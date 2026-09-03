## El reto

Magnolia Doors diseña, fabrica, instala y da servicio a puertas, ventanas, portones, barandales y herrería arquitectónica a medida en hierro y aluminio.

Programar una instalación a medida no es una cita de servicio estándar. Antes de asignar una fecha, el equipo debe confirmar que la solicitud está completa, que se identificó el trabajo correcto, que los materiales físicos están listos, que la información de instalación es exacta y que la cita encaja en la programación operativa.

La empresa maneja entre 30 y 40 eventos de instalación por semana. Preparar cada uno tomaba de 23 a 35 minutos de trabajo administrativo entre validación de la solicitud, revisión de materiales, programación, creación del evento en calendario y reportes: de 13 a 17 horas semanales dedicadas a poner trabajos en un calendario.

La calidad de los datos hacía el proceso más riesgoso que lento. Códigos postales contradictorios, direcciones incorrectas e información leída del título equivocado afectan el ruteo y la programación. En un caso representativo, un título mal interpretado habría colocado una instalación a unas 175 millas de la ruta correcta.

Un proceso más rápido no habría bastado. Magnolia Doors también necesitaba la garantía de que un trabajo incompleto no pudiera programarse y de que un asistente de IA no pudiera modificar datos de producción sin autorización de una persona.

## La solución: cinco etapas, con Odoo como sistema de registro

Viewnear rediseñó el proceso como un flujo controlado de cinco etapas sobre Claude y Odoo 18/19.

Un conector Model Context Protocol a la medida le da a Claude acceso estructurado a los datos y las acciones que requiere la programación de instalaciones. Odoo permanece como sistema de registro. Claude coordina la consulta de información, aplica el flujo, explica las excepciones y prepara las acciones que recomienda.

1. **Validación de la solicitud.** Claude verifica que la solicitud de servicio contenga la información requerida de cliente, proyecto, dirección e instalación. Los registros contradictorios o incompletos se marcan antes de continuar.
2. **Verificación de materiales.** El flujo consulta los registros relacionados en Odoo para confirmar que los materiales físicos están listos. Los trabajos que no cumplen las reglas quedan excluidos y se reportan con el motivo.
3. **Generación de programación por lotes.** Los trabajos elegibles se procesan en conjunto. Claude prepara una sola propuesta consolidada para todo el grupo, en lugar de obligar al equipo a programar cada trabajo por separado.
4. **Aprobación humana y ejecución.** Claude presenta las acciones de calendario propuestas para su revisión. Solo después de que un usuario autorizado aprueba, una llamada de ejecución separada crea o actualiza los registros en Odoo.
5. **Reporte semanal de gestión.** Claude genera un resumen operativo de instalaciones programadas, solicitudes bloqueadas, problemas de materiales, excepciones y pendientes.

## Reglas deterministas, y dónde aporta el modelo

El diseño separa las reglas de negocio del razonamiento del modelo. Los campos obligatorios y las condiciones de disponibilidad de materiales se aplican como reglas definidas, no se dejan a interpretación. Claude se encarga de lo que las reglas hacen mal: leer el contexto operativo, organizar resultados, detectar contradicciones y explicar por qué un trabajo puede o no avanzar.

El conector traza la misma línea entre lectura y escritura. Claude puede consultar todo lo necesario para construir una recomendación sin tener autoridad para modificar registros de Odoo.

## Entrega a producción

Viewnear entregó por fases durante agosto de 2026.

La primera fase estableció el conector de solo lectura, el motor de reglas de negocio y la arquitectura de compuerta de aprobación. Claude podía consultar y evaluar datos en vivo de Odoo, y no podía modificar registros de producción.

Las pruebas internas revelaron un problema de escalabilidad. Los trabajos se procesaban uno por uno, lo que produjo una corrida de 20 minutos y una acción duplicada en una prueba representativa. El flujo se rediseñó por lotes, de modo que varias solicitudes se evalúan juntas, se agrupan en una sola propuesta y pasan por una sola aprobación, con verificaciones adicionales contra la ejecución duplicada.

Para la demostración con el cliente, Claude leyó datos en vivo del entorno de producción mientras todas las escrituras se dirigían a un sandbox aislado, de modo que el flujo pudo probarse con registros reales sin tocar los calendarios de producción.

Tras la validación del cliente, Viewnear desplegó una versión hospedada del conector con los controles de autenticación y de entorno requeridos. La primera versión en producción se limitó deliberadamente a crear registros aprobados. La modificación y la eliminación llegaron después, una vez probado el camino de creación, porque esas acciones implican mayor riesgo operativo.

## Resultados

- La programación bajó de **23 a 35 minutos** por evento a **unos 3 minutos**, una reducción de **87% a 91%**.
- La carga semanal de programación pasó de **13 a 17 horas** a aproximadamente **1.5 a 2 horas**.
- Se recuperan entre **15 y 19 horas administrativas** por semana, cerca de 3 a 4 horas por día hábil.
- Entre **30 y 40 eventos de instalación** semanales corren por un solo flujo gobernado, en lugar de una secuencia independiente de revisiones manuales por trabajo.

La reducción de errores todavía no se ha medido como porcentaje, así que no hay una cifra que publicar. Lo que sí hace el flujo es detectar datos operativos contradictorios antes de que algo llegue al calendario: la lógica de validación identificó el código postal y el título en conflicto que habrían enviado una instalación a 175 millas de la ruta correcta, y lo puso a revisión en lugar de actuar sobre él.

Toda operación que cambia el estado permanece detrás de la compuerta de aprobación. Claude evalúa registros y recomienda acciones; no puede crear, modificar ni eliminar datos de producción sin autorización explícita.

## Impacto de negocio

Magnolia Doors convirtió hasta 17 horas semanales de programación en un flujo que resuelve cada evento en unos tres minutos, y el equipo sigue trabajando dentro de Odoo en lugar de mantener un segundo sistema de programación.

El valor no es solo la velocidad. El flujo verifica si una instalación está realmente lista, detecta información contradictoria, explica excepciones, consolida los trabajos elegibles en una sola programación y deja a una persona al mando de cada acción de producción. Esa combinación es lo que hace seguro extender el mismo patrón al siguiente proceso.
