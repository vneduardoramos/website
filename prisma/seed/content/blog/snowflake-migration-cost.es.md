## Por qué no hay precio de lista

La pregunta más común antes de una migración es también la más difícil de responder en una línea: "¿Cuánto cuesta movernos a Snowflake?". Quien dé un número cerrado antes de entender el entorno está adivinando, y casi siempre adivinando por lo bajo.

Eso no significa que el número sea imposible de conocer. El costo de una migración a Snowflake es la suma de unos cuantos factores bien entendidos, y una vez que sabe qué los mueve, puede estimar un rango realista y, más importante, actuar para bajarlo. Así lo pensamos nosotros.

## Los dos costos que la gente confunde

Primero, separe dos cosas muy distintas:

1. **El costo de la plataforma.** Snowflake se cobra por consumo, almacenamiento más el cómputo que realmente usa, no por licencias por usuario. Es un costo operativo continuo, y para la mayoría de los equipos queda por debajo de la infraestructura heredada que reemplaza una vez que están en su lugar el auto-suspend, los warehouses bien dimensionados y los resource monitors.
2. **El costo del proyecto de migración.** El esfuerzo único de mover datos, convertir código, validar resultados y hacer el cutover del negocio. Este es el número que la gente suele tener en mente, y es el que controlan los factores de abajo.

Confundir los dos lleva a sustos en ambas direcciones. Conviene mantenerlos separados al armar el presupuesto.

## Qué mueve de verdad el número del proyecto

**El sistema de origen.** Salir de [Teradata, Oracle o Hadoop](/es/migrations) no cuesta lo mismo que salir de Redshift o SQL Server. Las funciones propietarias, los stored procedures y el SQL específico de cada dialecto hay que traducirlos, y algunos sistemas cargan mucho más de ese equipaje que otros.

**El volumen y la forma de los datos.** Los terabytes en crudo importan menos que cuántas fuentes, tablas y formatos distintos tiene, y qué tan limpios están. Cien tablas bien modeladas se mueven más rápido que mil enredadas.

**Los pipelines y las transformaciones.** Suele ser la partida más grande. Cada job de ETL, cada transformación, cada regla de negocio enterrada en una herramienta heredada tiene que entenderse, reconstruirse y validarse. La cantidad y complejidad de sus [pipelines de datos](/es/services/data-engineering) mueven más el costo que los datos en sí.

**Las dependencias río abajo.** Dashboards, reportes, extractos y aplicaciones que leen del sistema viejo hay que reapuntarlos y volver a probarlos. A más consumidores, más validación.

**Gobierno y compliance.** Los datos regulados (financieros, de salud, PII) agregan enmascaramiento, seguridad a nivel de fila, linaje y requisitos de auditoría. Es trabajo real, y saltárselo no es opción en esas industrias.

**La disponibilidad de la organización.** Qué tan rápido el equipo interno responde preguntas, aprueba decisiones y prueba resultados afecta el tiempo tanto como cualquier factor técnico. Un sponsor que responde acorta una migración; uno ausente la estira.

## Qué baja el número

La buena noticia es que la mayoría de estos factores se pueden mover.

- **Conversión automatizada de código.** Una parte grande del SQL heredado y de la lógica de pipelines se puede convertir con herramientas en lugar de reescribirse a mano. Aquí es donde rinden los aceleradores de un partner, y donde más caen las horas (y el costo).
- **Retirar lo que está muerto.** Casi todo warehouse heredado carga pipelines y tablas que nadie usa desde hace años. Una migración es la mejor oportunidad que tendrá para dejarlos atrás. No vale la pena mover datos que nunca se van a consultar.
- **Validar la paridad, no calcularla a ojo.** La comparación automatizada de filas y agregados entre lo viejo y lo nuevo detecta problemas temprano, cuando son baratos, en lugar de después del cutover, cuando son caros y públicos.
- **Cutover por fases.** Una migración de un solo golpe concentra el riesgo y el costo en un fin de semana aterrador. Un cutover por fases, workload por workload, reparte el esfuerzo, deja al negocio operando y le permite aprender primero en las piezas de bajo riesgo.

## La forma de una migración sensata

Casi siempre empezamos con un discovery: un proyecto corto y cerrado que inventaría el sistema de origen, perfila los datos y produce un scope y un estimado reales en lugar de una adivinanza. Ese discovery es donde el rango se estrecha de "entre X y 3X" a un número con el que de verdad puede planear.

De ahí, el trabajo corre por fases con paridad validada en cada paso y una entrega que deja al equipo interno operando el resultado, no dependiendo de nosotros para tocarlo. El tiempo a valor aparece temprano porque los primeros workloads llegan a producción en semanas, no al final de un proyecto de un año.

## El número que importa más que el número

El costo real de una migración no es solo la factura. Es el riesgo de equivocarse: un cutover que rompe los reportes durante el cierre trimestral, una reconstrucción que cambia en silencio números en los que el negocio confía, un partner que desaparece cuando termina el contrato. Un costo de proyecto un poco más alto que compra paridad validada, un cutover por fases y un equipo que entrega las llaves casi siempre sale más barato que la alternativa.

Para un estimado real de un entorno específico, el primer paso honesto es un discovery, no una cotización. Nuestra [página de migraciones](/es/migrations) explica cómo lo abordamos, y con gusto recorremos cómo se ven los factores de arriba para un stack específico.
