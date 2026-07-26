## El reto

Una empresa de procesamiento de reclamos clasificaba a mano PDFs y documentos digitalizados de muchas aseguradoras. Los documentos variaban ampliamente, desde formularios estructurados hasta informes extensos y notas manuscritas, y la clasificación precisa y oportuna es lo que mantiene los reclamos en movimiento. Tres fricciones dificultaban escalar el proceso manual:

- **Variabilidad de los documentos.** Los formatos no estaban estandarizados, por lo que el OCR basado en plantillas no funcionaba de forma consistente.
- **Revisión manual.** Cada documento tomaba de segundos a minutos, y el atraso acumulado ralentizaba la resolución de los reclamos.
- **Clasificación inconsistente.** El criterio humano generaba errores, recategorizaciones y métricas de volumen poco confiables.

## Cuando la categoría Descarte se convierte en una fuga

Los documentos entrantes se clasificaban por propósito para que cada uno pudiera enrutarse y gestionarse correctamente:

- **Verificaciones** confirman la cobertura.
- **Denegaciones** registran el rechazo de un reclamo.
- **Pagos** abarcan desembolsos y cheques.
- **Correspondencia** abarca cartas y notas.
- **Descarte** se reserva solo para elementos irrelevantes: páginas en blanco, duplicados y material no relacionado.

En la práctica, Descarte se convirtió en un punto de fuga de información. Bajo presión de tiempo, Verificaciones y Denegaciones válidas se descartaban por error y salían del flujo activo de reclamos, lo que provocaba:

- **Pérdida de datos.** Documentos clave salían por completo del flujo de trabajo.
- **Interrupciones.** Los casos debían reabrirse y reclasificarse.
- **Métricas distorsionadas.** El volumen real de trabajo quedaba distorsionado, lo que afectaba la planificación de recursos.

## Solución: un pipeline inteligente sobre Snowflake

Viewnear construyó un producto de datos y un pipeline sobre **Snowflake Cortex AI** para clasificar, extraer y enrutar documentos de forma automática, con las funciones de IA invocadas directamente en SQL en lugar de un modelo aparte que haya que alojar:

- **Ingesta desde Azure.** Los PDFs llegaban a un contenedor de Azure Blob Storage y se leían a través de un external stage de Snowflake.
- **Parseo.** `PARSE_DOCUMENT` convertía cada PDF, incluidos los escaneos digitalizados de forma externa, en el texto y el layout que los pasos siguientes podían utilizar.
- **Clasificar y extraer.** Los procedimientos almacenados invocaban funciones de Cortex AI por documento: `AI_CLASSIFY` clasificaba cada uno en Denegaciones, Verificaciones, Pagos y Correspondencia sin plantillas rígidas, y `AI_EXTRACT` extraía números de reclamo, montos de cheques, fechas y datos de clientes, con una precisión del 95%.
- **Enrutar según reglas de negocio.** Los documentos clasificados se enviaban al sistema de destino correcto, eliminando los traspasos manuales.
- **Revisar el 5%.** Los casos inciertos se marcaban para revisión humana y alimentaban un ciclo de mejora continua, de modo que la precisión seguía aumentando. Como las funciones de Cortex AI se ejecutan dentro de Snowflake, no hay un stack de IA aparte que gestionar.

## Gobernado por diseño

Los documentos de reclamos contienen datos personales y financieros sensibles, por lo que la gobernanza se incorporó desde la primera tabla en lugar de añadirse después:

- **Linaje con Horizon Catalog.** Cada documento, clasificación y campo extraído es trazable, de modo que el equipo puede mostrar de dónde provino cada valor y cómo se procesó.
- **Un único contexto de negocio confiable.** Horizon Context brinda a cada equipo y función de IA las mismas definiciones para los tipos de documento, los campos de reclamo y los estados, de modo que la clasificación y los reportes posteriores siempre coincidan.
- **Acceso con privilegios mínimos.** Los controles de acceso basados en roles (RBAC) limitan quién puede ver los documentos en bruto y los datos extraídos, con separación de funciones entre el procesamiento, la revisión y el reporte.
- **PII protegida en su lugar.** Los campos sensibles se clasifican y enmascaran por política, y las funciones de Cortex AI se ejecutan sobre los datos dentro de la cuenta de Snowflake gobernada del cliente, por lo que nada se copia a un servicio externo.
- **Listo para auditorías y certificado.** El trabajo hereda los controles de Snowflake auditados de forma independiente (SOC 2 Type II, ISO 27001) y añade un historial completo de accesos para auditorías y respuesta a incidentes.

## Resultados

La automatización convirtió un flujo de trabajo manual en un proceso medible, auditable y escalable:

- La precisión de la clasificación subió del **60% al 95%**, una mejora de 35 puntos.
- La clasificación promedio por documento bajó a **4 segundos**.
- Más del **40%** de los documentos previamente descartados se recuperaron y reintegraron.
- Los errores de clasificación se redujeron **casi un 90%**, de una tasa de error del 40% al 5%.

## Impacto en el negocio

Más allá de la clasificación, el trabajo creó una base lista para automatizar más decisiones sobre documentos:

- **Automatización escalable.** Menos tareas repetitivas y la capacidad de absorber un volumen de documentos mucho mayor.
- **Datos más confiables.** Clasificación consistente, extracción confiable de los campos clave y trazabilidad completa del proceso.
- **Mejora continua.** Los errores marcados se revisan y alimentan nuevas iteraciones, de modo que el sistema sigue mejorando.

El resultado es un cambio de la revisión manual a un procesamiento de documentos inteligente, preciso y preparado para el crecimiento, que libera al equipo para enfocarse en resolver reclamos en lugar de clasificar papeles.
