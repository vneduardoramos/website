## Desafío

Una desarrolladora de construcción e inmobiliaria compra terrenos, ejecuta programas de construcción y entrega proyectos de edificación. Su información de diseño y sus datos de negocio vivían en mundos distintos: los planos en un lugar, las cifras en otro y sin forma de leerlos en conjunto. Medir un programa, revisar un proyecto o evaluar la compra de un terreno implicaba unir cifras entre sistemas y extraer cantidades de los planos a mano.

- **Cuatro fuentes desconectadas.** Los datos de programa y planificación de construcción, los datos de costo y finanzas de los proyectos, los registros de terrenos y adquisiciones, y los planos CAD arquitectónicos vivían cada uno por su cuenta, sin definiciones compartidas ni un modelo común que los uniera.
- **Planos CAD atrapados en archivos que ningún reporte podía leer.** Las cantidades, las áreas y los materiales que definen cada edificación estaban dentro de los planos de diseño e ingeniería, encerrados en archivos que ningún reporte ni consulta podía alcanzar, de modo que el diseño nunca aparecía junto a las cifras del negocio.
- **Programas, proyectos y decisiones de terrenos unidos a mano.** Cada consolidación entre los programas de construcción, los proyectos individuales y la adquisición de terrenos se armaba de forma manual, por lo que el panorama siempre llegaba tarde y nunca quedaba del todo conciliado.
- **Sin una única fuente confiable.** Con cuatro fuentes y sin un modelo gobernado que las uniera, la dirección no tenía un solo lugar en el que pudiera confiar para medir y dirigir el negocio.

## Solución: una única fuente de verdad gobernada en Snowflake, con los datos de diseño hechos medibles

Viewnear unificó las cuatro fuentes en una base gobernada de Snowflake dentro de la propia cuenta de la desarrolladora, y convirtió los planos CAD de archivos inertes en datos estructurados y gobernados que se ubican junto a los del negocio.

- **Cuatro fuentes en una base Medallion gobernada.** Openflow ingestó los datos de programa de construcción, de costo y finanzas, y de terrenos y adquisiciones hacia Snowflake, depositando los datos crudos en Bronze, conformándolos en Silver y resolviendo modelos Gold gobernados, de modo que los sistemas del negocio por fin compartieran un solo modelo.
- **Planos CAD leídos y convertidos en datos estructurados y gobernados.** Extrajimos los datos de diseño encerrados en los planos arquitectónicos y de ingeniería hacia tablas gobernadas y consultables, de modo que el diseño por fin se volvió medible junto a las cifras del negocio.
- **Un modelo confiable para programas, proyectos y compra de terrenos.** Los programas de construcción, los proyectos individuales y las decisiones de adquisición de terrenos se midieron todos contra los mismos modelos Gold gobernados, de modo que la desarrolladora pudo dirigir el negocio desde una sola fuente en lugar de conciliar cifras a mano.
- **Agentes de Snowflake CoWork para preguntas y acciones en Snowflake.** Entregamos agentes de Snowflake CoWork sobre Semantic Views gobernadas, con Cortex Analyst respondiendo preguntas en lenguaje natural, de modo que los equipos pudieran preguntar y actuar sobre los datos gobernados directamente dentro de Snowflake.
- **Bots de Slack en el flujo de trabajo.** Entregamos bots de Slack sobre los mismos datos gobernados, de modo que los equipos obtuvieran respuestas y actuaran sin salir de las herramientas en las que ya trabajan.
- **Transformaciones versionadas y probadas en dbt.** Cada transformación que construyó Silver, los modelos Gold gobernados y los datos CAD estructurados se ejecutó en dbt bajo control de versiones y de forma nativa contra Snowflake, de modo que cada regla quedó revisada, probada y trazable.

## Gobernado desde el diseño

La base gobernada se convirtió en aquello de lo que dependen los programas, los proyectos y las decisiones de terrenos, por lo que la gobernanza se diseñó desde el inicio.

- **Horizon Catalog para catálogo, linaje y propiedad.** Horizon Catalog documentó los datos con linaje y dependencias entre objetos, de modo que la desarrolladora puede ver de dónde proviene cada cifra, incluidos los valores leídos de los planos, y quién es su responsable.
- **RBAC con mínimo privilegio.** El acceso se separó entre administración, operación y consumo analítico, de modo que las personas que operan la base, la usan y la gobiernan mantienen roles distintos.
- **Calidad de datos garantizada con pruebas de dbt.** Las pruebas de dbt validaron los modelos en cada ejecución, de modo que la fuente gobernada se mantuvo confiable a medida que llegaban nuevos datos y casos de uso.
- **Resource Monitors para un costo predecible.** Los Resource Monitors mantuvieron bajo control el consumo de cómputo y de créditos, con Snowsight monitoreando la actividad y el consumo.
- **Los datos permanecen en la propia cuenta de Snowflake de la desarrolladora.** Todo se ejecutó en la propia cuenta de la desarrolladora, de modo que los datos sensibles de costo, terrenos y diseño nunca salieron de su perímetro.

## Lo que entregamos

- **Una fuente gobernada para programas, proyectos y terrenos.** Los programas de construcción, los proyectos individuales y las decisiones de compra de terrenos ahora se miden contra una única fuente de verdad gobernada en lugar de hojas de cálculo unidas a mano.
- **CAD hecho medible.** Los datos de diseño leídos de los planos ahora viven como datos gobernados que el negocio puede consultar junto a los registros de construcción, finanzas y terrenos.
- **Agentes de IA en Snowflake y Slack.** Los agentes de Snowflake CoWork sobre Semantic Views gobernadas, más los bots de Slack, permiten a los equipos hacer preguntas y actuar sobre los datos gobernados tanto dentro de Snowflake como en el flujo de trabajo.
- **Una base documentada que el equipo opera y extiende.** Una base de Snowflake gobernada, catalogada y probada, con transformaciones de dbt bajo control de versiones, que el equipo de la desarrolladora opera y extiende a nuevos casos de uso.
