## Desafío

Un fabricante de empaques de cartón corrugado produce cajas de cartón, administra suajes y existencias de papel, y opera un catálogo grande y de rápido crecimiento de variantes de producto. Con el tiempo el catálogo se disparó: miles de SKUs y combinaciones de variantes creadas sin una arquitectura de producto estandarizada, y sin reglas claras sobre cómo nace un nuevo SKU. Cada variante que se agrega sin estructura eleva de forma silenciosa el costo de operar la planta.

- **Explosión de variantes sin arquitectura de producto.** Los nuevos SKUs se crean de forma ad hoc, sin reglas de variantes permitidas y sin una manera estándar de combinar atributos, por lo que los productos casi duplicados se multiplican sin control.
- **Decisiones basadas en conocimiento tribal y Excel.** Las decisiones críticas sobre producción, papel y suajes dependen de la experiencia individual y de análisis puntuales en hojas de cálculo, no de una fuente confiable y compartida.
- **Datos dispersos y sin estandarizar, y costos distorsionados.** La información reside en SAP Business One y en sistemas satélite con baja estandarización, por lo que el costo real por SKU no queda claro y la planeación de producción, el papel y la gestión de suajes se ven afectados.
- **Sin trazabilidad y con una brecha de seguridad abierta.** Es difícil rastrear cómo se crean y modifican los SKUs o medir el impacto de un cambio en el catálogo, y la información sensible circula por archivos planos y correo electrónico sin control de acceso ni auditoría.

## Solución: una base gobernada de datos de SKU y catálogo en Snowflake

Viewnear diseñó y construyó una base gobernada en Snowflake dentro de la cuenta del propio fabricante, convirtiendo un catálogo extenso y sin gobierno en golden records y un catálogo de SKU estándar en el que el negocio puede confiar.

- **Almacén medallion desde SAP Business One y satélites.** Openflow ingiere SAP Business One y los sistemas satélite en una programación por lotes e incremental, depositando los datos crudos en Bronze, conformándolos en un modelo empresarial Silver y resolviéndolos en modelos analíticos Gold gobernados.
- **Diccionario de datos y reglas de gobierno de SKU.** Un diccionario de datos empresarial fija la definición oficial, el propietario y los indicadores de obligatoriedad por atributo, y un modelo de datos maestros produce un golden record por dominio con reglas versionadas y con propietario para crear, modificar y estandarizar variantes, cada una con una severidad y un propietario responsable conforme a un RACI.
- **Catálogo de SKU estándar y arquitectura de producto.** Una arquitectura base de producto y un catálogo de SKU estándar definen las variantes permitidas y las reglas para combinarlas, de modo que los SKUs se crean conforme a un estándar en lugar de por improvisación, y una primera ola aplica reingeniería a entre tres y cinco catálogos satélite críticos para incorporarlos a esta arquitectura.
- **Análisis multidimensional de SKU y simulación What-if.** Un modelo multidimensional en Gold entrega KPIs por SKU a través de dimensiones y hechos, y la simulación What-if cuantifica las decisiones de reducción de SKU, estandarización y configuración de producción frente a la demanda, la capacidad y las restricciones del negocio antes de que alguien se comprometa con ellas.
- **Un agente de catálogo en lenguaje natural.** Un agente de Snowflake CoWork, con Cortex Analyst respondiendo preguntas sobre Semantic Views gobernadas en la capa Gold, permite a los usuarios de negocio consultar los catálogos maestro y de SKU estándar en lenguaje natural, validar SKUs y detectar duplicados, ver qué variantes generan complejidad, consultar las reglas vigentes para crear, modificar y estandarizar variantes, y evaluar escenarios de simplificación.
- **Transformaciones versionadas y probadas en dbt.** Cada transformación que construye el modelo Silver, los golden records y la analítica Gold se ejecuta en dbt bajo control de versiones y de forma nativa sobre Snowflake, de modo que cada regla se revisa, se prueba y es trazable.

La entrega es iterativa y orientada a entregables, abordando primero los dominios de producto de mayor impacto con participación activa de los usuarios de negocio, de modo que la arquitectura, las reglas y los catálogos evolucionan de forma controlada y no todos a la vez.

## Gobernado por diseño

El catálogo es aquello de lo que dependen la producción, los materiales y el costeo, por lo que el gobierno y la seguridad se diseñaron desde el inicio y se adoptaron de forma proporcional a medida que la base crecía.

- **RBAC con separación de funciones.** El acceso se separa entre administración, operación, consumo analítico y aprobación de cambios, de modo que quienes operan el catálogo, quienes lo usan y quienes aprueban cambios sobre él tienen roles distintos.
- **Políticas de enmascaramiento y de acceso a filas para datos sensibles.** El enmascaramiento a nivel de columna y las políticas de acceso a filas, con etiquetas que clasifican los atributos sensibles, controlan quién puede ver qué registros y qué campos.
- **Linaje y auditoría con Horizon Catalog.** Horizon Catalog documenta el catálogo con linaje de datos y dependencias de objetos, y la auditoría de acceso y de consultas, junto con el versionado de reglas, políticas y cambios estructurales, reemplazan el antiguo intercambio por archivos planos y correo electrónico con un acceso gobernado y trazable.
- **Resource Monitors para un costo predecible.** Los Resource Monitors mantienen bajo control el consumo de cómputo y de créditos, con Snowsight monitoreando la actividad, los objetos gobernados, el consumo y el cumplimiento.
- **Los datos permanecen en la cuenta del propio fabricante.** Todo se ejecuta en la cuenta de Snowflake del propio fabricante, de modo que los datos sensibles de catálogo, costos y materiales nunca salen de su perímetro.

## Qué obtiene el fabricante

- **Una fuente de verdad gobernada para el catálogo.** Golden records por dominio y un catálogo de SKU estándar con reglas de variantes y de combinación aplicadas, con reglas versionadas y propietarios responsables que reemplazan el conocimiento tribal y el Excel ad hoc.
- **Acceso al catálogo en lenguaje natural.** Un agente de Snowflake CoWork sobre Semantic Views gobernadas permite a los usuarios de negocio validar SKUs, encontrar duplicados, consultar las reglas vigentes y probar escenarios de simplificación sin esperar a un analista.
- **Un camino hacia un catálogo más simple.** El análisis multidimensional y la simulación What-if están diseñados para cuantificar primero cada movimiento, con el objetivo de una reducción significativa de SKU y de reducir aproximadamente a la mitad el tiempo dedicado a la limpieza y preparación de datos.
- **Datos de costos y operaciones listos para decidir.** El modelo gobernado se construye con el objetivo de un costo real por SKU más claro, un mejor aprovechamiento del papel y de los suajes, menos desperdicio operativo y una menor dependencia del reporteo manual.
- **Acceso gobernado que cierra la brecha de seguridad, con trazabilidad completa.** El acceso gobernado y auditado reemplaza el intercambio por archivos planos y correo electrónico, con linaje completo de cómo se crean, modifican y usan los datos del catálogo.
