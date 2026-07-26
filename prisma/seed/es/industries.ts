// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
export const industriesEs: Record<string, { name?: string; headline?: string; intro?: string; body?: string; challenges?: { problem: string; response: string }[]; deliverables?: { title: string; description: string }[]; stats?: { label: string; value: string }[]; faq?: { q: string; a: string }[]; seoTitle?: string; seoDescription?: string }> = {
  "construction-real-estate": {
    faq: [
      { q: "¿Cómo se ve el presupuesto contra el real y el riesgo de cronograma con tiempo para actuar?", a: "El presupuesto frente al real, el valor ganado y el riesgo de cronograma quedan en una sola vista gobernada en Snowflake, construida con los datos de cronograma, costo y avance consolidados desde las hojas de cálculo en una única fuente gobernada y confiable. Viewnear expone el presupuesto frente al real y el riesgo de cronograma mientras aún hay tiempo de actuar, sobre una fuente gobernada que consolida los sistemas ERP, de proyecto y de campo. Los datos de costos, contratos y activos se mantienen auditables, con acceso basado en roles en cada proyecto." },
      { q: "¿Los planos arquitectónicos CAD se pueden usar como datos en los reportes?", a: "Los planos CAD se pueden leer hacia tablas estructuradas y gobernadas, de modo que las cantidades, las áreas y los materiales que definen cada edificación quedan consultables junto a los números del negocio. Para una desarrolladora de construcción e inmobiliaria, Viewnear unificó cuatro fuentes desconectadas (programa y planificación de construcción, costo y finanzas del proyecto, registros de terrenos y adquisiciones, y planos CAD arquitectónicos) en una única fuente de verdad gobernada en Snowflake: Openflow ingestó los datos de negocio hacia una base Medallion de Bronze, Silver y Gold, y los datos de diseño encerrados en los planos arquitectónicos y de ingeniería se extrajeron hacia tablas gobernadas y consultables. Encima, los agentes de Snowflake CoWork sobre Semantic Views gobernadas y los bots de Slack permiten preguntar y actuar sobre esos datos dentro de Snowflake y en las herramientas donde los equipos ya trabajan." },
      { q: "¿Qué obtiene un propietario o una desarrolladora a nivel de portafolio?", a: "La analítica de portafolio y activos en Snowflake muestra ocupación, rendimiento y desempeño en cada propiedad y proyecto en un solo lugar, y los modelos de pronóstico y valuación alimentan la valuación, la planeación de capital y las licitaciones con datos confiables y actuales. Para una desarrolladora de construcción e inmobiliaria, los programas de construcción, los proyectos individuales y las decisiones de adquisición de terrenos se midieron contra los mismos modelos Gold gobernados, de modo que el negocio se dirigió desde una sola fuente en lugar de hojas de cálculo unidas a mano." },
    ],
    name: "Construcción y bienes raíces",
    headline: "La construcción y los bienes raíces generan datos en cada proyecto. La mayoría nunca llega a una decisión.",
    seoTitle: "Snowflake para construcción e inmobiliaria",
    seoDescription: "Datos de construcción e inmobiliaria en Snowflake: datos de proyecto, diseño y propiedad unificados en decisiones medibles.",
    intro:
      "Desde el avance en obra hasta el desempeño del portafolio, unificamos los datos de proyecto, costo y activos en una única fuente gobernada para que desarrolladores, contratistas y propietarios vean el cronograma, el presupuesto y el rendimiento casi en tiempo real.",
    challenges: [
      { problem: "Datos de proyecto atrapados en hojas de cálculo", response: "Consolidamos los datos de cronograma, costo y avance en una única fuente gobernada y confiable." },
      { problem: "Sin visibilidad a nivel de portafolio", response: "Entregamos analítica de portafolio y activos en cada propiedad y proyecto." },
      { problem: "Sobrecostos y retrasos detectados demasiado tarde", response: "Exponemos el presupuesto frente al real y el riesgo de cronograma mientras aún hay tiempo de actuar." },
    ],
    deliverables: [
      { title: "Analítica de costo y cronograma de proyecto", description: "Presupuesto frente al real, valor ganado y riesgo de cronograma en una sola vista." },
      { title: "Dashboards de portafolio y activos", description: "Ocupación, rendimiento y desempeño en todo el portafolio." },
      { title: "Cimiento de datos de proyecto unificado", description: "Una fuente gobernada que consolida los sistemas ERP, de proyecto y de campo." },
      { title: "Modelos de pronóstico y valuación", description: "Insumos basados en datos para valuación, planeación de capital y licitaciones." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "6+" }],
  },
  "education": {
    faq: [
      { q: "¿Cuánto tarda en quedar lista una base de datos de estudiantes en Snowflake?", a: "Una base gobernada de datos de estudiantes en tiempo real sobre Snowflake quedó en operación en siete semanas para un grupo universitario, y una primera construcción en producción típica toma de 8 a 16 semanas según el volumen de datos, la complejidad de las fuentes y los casos de uso en scope. Lo que mantiene real ese plazo: un discovery que fija el scope desde el inicio, sprints ágiles de dos semanas con backlog compartido y demos, y un comité conjunto técnico y de negocio. Ese grupo recibió un entorno gobernado de Snowflake, integración nativa con Anthology / Blackboard Data Share, streaming de eventos Caliper en tiempo real, y documentación y transferencia de conocimiento para que su propio equipo lo opere y lo extienda." },
      { q: "¿Cómo se unen los datos del SIS y del LMS en Snowflake?", a: "Los expedientes académicos y los eventos de actividad de aprendizaje llegan a Snowflake por dos caminos y se unen en un solo modelo gobernado. Para un grupo de universidades que atiende a más de 20,000 estudiantes en Miami y América Latina, Viewnear conectó Anthology / Blackboard Data Share para depositar los datos académicos en una capa RAW, con discovery de esquema y validación de actualización, volumen y uso, y transmitió en streaming los eventos de aprendizaje Caliper del LMS hacia Snowflake RAW a través de Azure Event Hub. Sobre esas capas RAW queda un modelo analítico del estudiante documentado, y la estructura gobernada de RAW a analítica mantiene un linaje claro hacia cada sistema de origen." },
      { q: "¿Snowflake permite detectar a tiempo a los estudiantes en riesgo de abandono?", a: "La analítica de alerta temprana sobre participación y resultados es un entregable estándar de educación en Snowflake, y depende de que los eventos de actividad de aprendizaje se transmitan conforme ocurren en lugar de llegar por lotes. Viewnear unifica los datos de SIS, LMS y operación en una única fuente gobernada y confiable, y entrega analítica de éxito estudiantil sobre participación, logro y retención, con alertas tempranas sobre los estudiantes en mayor riesgo. El manejo de los datos de estudiantes es acorde con FERPA, con roles, RBAC y políticas de red que definen quién puede acceder a qué, por campus y por función." },
    ],
    name: "Educación",
    headline: "Las instituciones educativas abundan en datos de estudiantes y carecen de información útil.",
    seoTitle: "Snowflake para datos educativos",
    seoDescription: "Datos e IA en educación sobre Snowflake: expedientes y eventos de aprendizaje unificados en información accionable.",
    intro:
      "En escuelas, universidades y centros de capacitación, convertimos los datos de inscripción, aprendizaje y operación en una única fuente confiable para el éxito estudiantil, los reportes institucionales y la rendición de cuentas de financiamiento.",
    challenges: [
      { problem: "Datos de estudiantes dispersos entre sistemas", response: "Unificamos los datos de SIS, LMS y operación en una única fuente gobernada y confiable." },
      { problem: "Reportes normativos y para financiadores hechos a mano", response: "Automatizamos los reportes institucionales y regulatorios desde una sola fuente." },
      { problem: "Riesgos de retención identificados demasiado tarde", response: "Entregamos analítica de alerta temprana sobre participación y resultados." },
    ],
    deliverables: [
      { title: "Analítica de éxito estudiantil", description: "Información de participación, logro y retención en un solo lugar." },
      { title: "Reportes institucionales", description: "Reportes normativos, de acreditación y para financiadores, automatizados." },
      { title: "Dashboards de inscripción y operación", description: "Admisiones, capacidad y desempeño operativo de un vistazo." },
      { title: "Cimiento de datos educativo unificado", description: "Una base gobernada que abarca los sistemas académicos y administrativos." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "5+" }],
  },
  "financial-services": {
    faq: [
      { q: "¿Cómo se vuelven auditables los reportes regulatorios de banca y seguros en Snowflake?", a: "Los reportes regulatorios se vuelven auditables en Snowflake cuando se generan desde una sola fuente gobernada en lugar de armarse a mano. Viewnear consolida los datos fragmentados de banca, seguros y activos en un único data warehouse empresarial gobernado y automatiza desde ahí los reportes regulatorios y externos estructurados, con reportes alineados con FINRA, SEC y SOX, acceso basado en roles y linaje de auditoría completo en cada número reportado. La analítica de autoservicio sobre la misma fuente mantiene a los equipos decidiendo con números actuales y confiables, no con datos desactualizados." },
      { q: "¿Qué puede hacer Snowflake Cortex AI con documentos de reclamaciones de seguros?", a: "Snowflake Cortex AI clasifica y extrae datos de documentos de reclamaciones con las funciones de IA invocadas directamente en SQL, sin un modelo aparte que haya que alojar. Para una empresa de procesamiento de reclamaciones que clasificaba a mano los documentos de numerosas aseguradoras, Viewnear construyó un pipeline en el que PARSE_DOCUMENT convirtió cada PDF en texto y layout utilizables, AI_CLASSIFY clasificó los documentos en Denegaciones, Verificaciones, Pagos y Correspondencia sin plantillas rígidas, y AI_EXTRACT extrajo números de reclamo, montos de cheques, fechas y datos de clientes. La precisión de clasificación subió del 60% al 95%, la clasificación promedio por documento bajó a 4 segundos y se recuperó más del 40% de los documentos antes descartados." },
      { q: "¿Las funciones de Snowflake Cortex AI envían datos sensibles fuera de la cuenta del cliente?", a: "Las funciones de Cortex AI corren sobre los datos dentro de la propia cuenta gobernada de Snowflake del cliente, así que nada se copia a un servicio externo. En el trabajo de reclamaciones que Viewnear entregó con Snowflake Cortex AI, los campos sensibles se clasifican y se enmascaran por política, el acceso basado en roles limita quién puede ver los documentos crudos y los datos extraídos, con separación de funciones entre procesamiento, revisión y reporte, y Horizon Catalog mantiene trazable cada documento, clasificación y campo extraído. La construcción misma corre en la cuenta de Snowflake, los repositorios y el CI del cliente, bajo los controles de acceso y el proceso de cambios del cliente." },
    ],
    name: "Servicios financieros",
    headline: "En los servicios financieros, los datos valen más que los productos. Deberían tratarse así.",
    seoTitle: "Snowflake para servicios financieros",
    seoDescription: "Datos e IA para servicios financieros en Snowflake: datos gobernados y auditables para riesgo, finanzas y decisiones de cliente.",
    intro:
      "En banca, seguros y gestión de activos, las organizaciones que ganan son las que convierten los datos financieros fragmentados en una única fuente gobernada y confiable para reportes, cumplimiento e IA.",
    challenges: [
      { problem: "Fuentes de datos fragmentadas", response: "Consolidamos datos financieros complejos en un único data warehouse empresarial gobernado." },
      { problem: "Reportes de cumplimiento hechos a mano", response: "Automatizamos los reportes regulatorios y externos estructurados desde una única fuente gobernada." },
      { problem: "Decisiones sobre datos desactualizados", response: "Entregamos analítica de autoservicio para que los equipos actúen sobre números actuales y confiables." },
    ],
    deliverables: [
      { title: "Data warehouses empresariales", description: "Bases escalables y gobernadas para la analítica en todo el negocio." },
      { title: "Analítica de autoservicio", description: "Analítica interna y reportes externos estructurados desde una sola fuente." },
      { title: "Reportes regulatorios", description: "Reportes de cumplimiento automatizados y auditables." },
      { title: "Casos de uso de analítica e IA", description: "Desde la evaluación de productos hasta los casos de uso de IA en todos los departamentos." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "12+" }],
  },
  "manufacturing": {
    faq: [
      { q: "¿Qué problemas de datos suelen enfrentar las empresas de manufactura en Snowflake?", a: "Las empresas de manufactura llegan con tres problemas: los datos de máquina y ERP no se conectan, hay paros y pérdidas de calidad ocultos, y existen puntos ciegos en la cadena de suministro. Viewnear unifica los datos de piso de planta, sensores y ERP en una única fuente gobernada y confiable sobre Snowflake, y construye analítica de OEE y calidad que expone los verdaderos generadores de costo, con disponibilidad, desempeño y calidad en una sola vista en vivo. La trazabilidad va del proveedor al embarque, gobernada en cada paso para calidad y auditoría." },
      { q: "¿Cómo llegan a Snowflake los datos de piso de planta, de sensores y del ERP?", a: "Los datos de piso de planta, sensores y ERP se unifican en una única fuente gobernada y confiable sobre Snowflake, y los datos de máquina y sensores de alto volumen se ingieren y se gobiernan como parte de ella. En un proyecto de Viewnear con un fabricante de empaques de cartón corrugado, Openflow ingirió SAP Business One y los sistemas satélite en una programación por lotes e incremental, depositando los datos crudos en Bronze, conformándolos en un modelo empresarial Silver y resolviéndolos en modelos analíticos Gold gobernados. Cada transformación que construye esas capas corre en dbt bajo control de versiones y de forma nativa sobre Snowflake, así que cada regla queda revisada, probada y trazable." },
      { q: "¿Snowflake sirve para ordenar un catálogo que creció a miles de SKU sin control?", a: "Un catálogo descontrolado se ordena con arquitectura de producto y reglas de gobierno, y Snowflake es donde ambas se aplican. Para un fabricante de empaques de cartón corrugado cuyo catálogo se disparó a miles de SKU y variantes sin arquitectura de producto, Viewnear construyó un catálogo de SKU estándar que define las variantes permitidas y las reglas para combinarlas, un golden record por dominio con reglas versionadas y propietarios responsables, y simulación What-if que cuantifica las decisiones de reducción y estandarización de SKU frente a la demanda, la capacidad y las restricciones del negocio antes de comprometerse con ellas. Un agente de Snowflake CoWork sobre Semantic Views gobernadas permite validar SKU, detectar duplicados y ver qué variantes generan complejidad en lenguaje natural." },
    ],
    name: "Manufactura",
    headline: "Datos de manufactura que avanzan al ritmo del piso de producción.",
    seoTitle: "Snowflake para analítica de manufactura",
    seoDescription: "Datos e IA de manufactura en Snowflake: datos gobernados de producción, calidad y costos que llegan a las decisiones del piso.",
    intro:
      "Conectamos los datos de producción, cadena de suministro y sensores en una única fuente gobernada y confiable para que los fabricantes eleven el OEE, vean toda la cadena de suministro y actúen sobre los problemas antes de que lleguen al cliente.",
    challenges: [
      { problem: "Los datos de máquina y ERP no se conectan", response: "Unificamos los datos de piso de planta, sensores y ERP en una única fuente gobernada y confiable." },
      { problem: "Paros y pérdidas de calidad ocultos", response: "Entregamos analítica de OEE y calidad que expone los verdaderos generadores de costo." },
      { problem: "Puntos ciegos en la cadena de suministro", response: "Llevamos toda la cadena a una sola vista, del proveedor al embarque." },
    ],
    deliverables: [
      { title: "Analítica de OEE y producción", description: "Disponibilidad, desempeño y calidad en una sola vista en vivo." },
      { title: "Visibilidad de la cadena de suministro", description: "Seguimiento del proveedor a la entrega, gobernado en cada paso." },
      { title: "Pipelines de datos de IoT y sensores", description: "Datos de máquina y sensores de alto volumen, ingeridos y gobernados." },
      { title: "Modelos de mantenimiento predictivo", description: "Cimientos de datos para pronosticar fallas antes de que ocurran." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "7+" }],
  },
  "media-entertainment-advertising": {
    faq: [
      { q: "¿Cómo se unifican los datos de audiencia dispersos entre plataformas?", a: "Los datos de consumo, suscripción y participación se unifican en una única fuente gobernada en Snowflake, y eso es lo que convierte los datos de audiencia dispersos entre plataformas en una vista única de quién ve, lee y se suscribe. Viewnear construye esa base gobernada sobre los sistemas de anuncios, suscripción y contenido. Los datos de audiencia se manejan con gestión de consentimiento y se gobiernan para privacidad en cada canal." },
      { q: "¿Snowflake sirve para la atribución de campañas y anuncios multicanal?", a: "La atribución multicanal corre en Snowflake cuando los datos de campaña, audiencia e inversión comparten una sola fuente gobernada, y se entrega casi en tiempo real, no cuando ya es demasiado tarde para actuar. Viewnear unifica los datos de audiencia, contenido y campañas para que los equipos de medios, entretenimiento y publicidad midan el desempeño, atribuyan la inversión y actúen sobre la participación casi en tiempo real, con una atribución que conecta la inversión con los resultados por canal." },
      { q: "¿Qué datos necesita un equipo de contenido para decidir qué producir?", a: "La analítica de desempeño de contenido muestra qué resuena por título, formato y plataforma, y eso es lo que reemplaza la intuición en las decisiones de qué producir. Viewnear entrega esa analítica en Snowflake a partir de los datos unificados de audiencia, contenido y campañas, de modo que se puede actuar sobre la participación casi en tiempo real." },
    ],
    name: "Medios, entretenimiento y publicidad",
    headline: "Las audiencias de medios, entretenimiento y publicidad se mueven rápido. Los datos que las siguen deberían moverse más rápido.",
    seoTitle: "Snowflake para medios y publicidad",
    seoDescription: "Datos de medios, entretenimiento y publicidad en Snowflake: datos de audiencia y campañas gobernados y rápidos.",
    intro:
      "Unificamos los datos de audiencia, contenido y campañas en una única fuente gobernada para que los equipos de medios, entretenimiento y publicidad midan el desempeño, atribuyan la inversión y actúen sobre la participación casi en tiempo real.",
    challenges: [
      { problem: "Datos de audiencia dispersos entre plataformas", response: "Unificamos los datos de consumo, suscripción y participación en una sola fuente." },
      { problem: "Atribución de campañas que llega demasiado tarde", response: "Entregamos atribución casi en tiempo real por canal e inversión." },
      { problem: "Decisiones de contenido tomadas por intuición", response: "Exponemos analítica de desempeño de contenido que guía qué contenido producir." },
    ],
    deliverables: [
      { title: "Analítica de audiencia y participación", description: "Una vista unificada de quién ve, lee y se suscribe." },
      { title: "Atribución de campañas y anuncios", description: "Atribución multicanal que conecta la inversión con los resultados." },
      { title: "Analítica de desempeño de contenido", description: "Qué resuena, por título, formato y plataforma." },
      { title: "Cimiento de datos de medios unificado", description: "Una base gobernada que abarca los sistemas de anuncios, suscripción y contenido." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "5+" }],
  },
  "retail-cpg": {
    faq: [
      { q: "¿Cómo se obtiene una sola vista de la demanda entre el canal online y la tienda?", a: "Los equipos de retail y CPG obtienen una sola vista de demanda al unificar las operaciones online y físicas en una única fuente gobernada casi en tiempo real sobre Snowflake, con el inventario medido frente a las ventas. Viewnear entrega visibilidad de inventario frente a ventas que reduce la merma y los desabastos, con los datos online y de tienda unificados para reportes casi en tiempo real. El manejo de los datos de pago y de clientes es acorde con PCI y gobernado de extremo a extremo." },
      { q: "¿Snowflake puede mostrar el margen por producto y el costo de alimentos de un productor de alimentos?", a: "La información de margen por producto y el costo de alimentos viven en la misma base gobernada sobre Snowflake: desempeño de producción, logística y costo de alimentos en una sola vista, medidos junto con el desempeño de lealtad. Viewnear trabaja con bienes perecederos y producción de alimentos, y unifica los datos de ventas, inventario, producción y clientes en analítica casi en tiempo real que afina las decisiones de inventario, margen y merchandising." },
      { q: "¿Cómo consigue una red de ventas, servicio y refacciones una sola definición de cliente o de refacción?", a: "Una sola definición surge de una base de datos maestros sobre Snowflake: los datos de origen llegan a Bronze, se limpian y conforman en Silver, y se resuelven en golden records gobernados en Gold, con claves maestras, emparejamiento y fusión, reglas de survivorship, linaje y auditoría diseñados desde la primera tabla. Viewnear la construyó para un grupo de distribuidores de vehículos comerciales que operaba ventas, servicio, refacciones y el back office en sistemas separados, y consolidó ocho dominios de negocio desde tres sistemas fuente en tres lanzamientos a lo largo de una hoja de ruta de doce meses. Los agentes de Snowflake CoWork por dominio, fundamentados en el golden record gobernado de cada dominio, permiten consultar los datos maestros en lenguaje natural." },
    ],
    name: "Retail y CPG",
    headline: "El margen en retail y CPG es estrecho. Las decisiones basadas en datos son donde se recupera.",
    seoTitle: "Snowflake para datos de retail y CPG",
    seoDescription: "Analítica de retail y CPG en Snowflake: datos unificados de ventas, inventario y margen, gobernados para actuar a diario.",
    intro:
      "Desde los bienes perecederos y la producción de alimentos hasta el retail omnicanal y la lealtad, unificamos los datos de ventas, inventario, producción y clientes en analítica casi en tiempo real que afina las decisiones de inventario, margen y merchandising.",
    challenges: [
      { problem: "Puntos ciegos entre inventario y ventas", response: "Seguimos el inventario frente a las ventas para afinar las decisiones de inventario y reabasto." },
      { problem: "Datos separados entre lo online y la tienda", response: "Unificamos las operaciones online y físicas en una sola vista casi en tiempo real." },
      { problem: "Datos opacos de costo y lealtad", response: "Conectamos el costo de producción y de alimentos con la analítica de clientes y lealtad." },
    ],
    deliverables: [
      { title: "Analítica de ventas e inventario", description: "Visibilidad de inventario frente a ventas que reduce la merma y los desabastos." },
      { title: "Analítica omnicanal", description: "Online y tienda unificados para reportes casi en tiempo real." },
      { title: "Analítica de producción y costo de alimentos", description: "Desempeño de producción, logística y costo de alimentos en una sola vista." },
      { title: "Analítica de clientes y lealtad", description: "Información de margen por producto y seguimiento del desempeño de lealtad." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "10+" }],
  },
  "technology-telco": {
    faq: [
      { q: "¿Cómo se maneja telemetría de eventos de alto volumen en Snowflake?", a: "La telemetría de uso y de red de alto volumen se ingiere, se gobierna y queda lista para consultar en Snowflake, unificada con los datos de uso de producto y de facturación en una única fuente gobernada y confiable. Viewnear construye esos pipelines de telemetría para negocios de software, plataformas y telecomunicaciones, y mantiene el volumen completo listo para consultar. Los datos de uso y de red se manejan con privacidad, consentimiento y controles de acceso." },
      { q: "¿Snowflake permite señalar a tiempo a los clientes en riesgo de abandono?", a: "La analítica de abandono y retención en Snowflake señala el riesgo a tiempo, en lugar de mostrar el abandono solo cuando los clientes ya se fueron. Viewnear construye esa analítica de alerta temprana sobre el uso de producto, la facturación y la telemetría de red unificados en una única fuente gobernada y confiable, y la entrega caso de uso por caso de uso, en sprints con software funcionando en cada demo." },
      { q: "¿Cómo se conecta el uso del producto con los ingresos?", a: "La analítica de producto en Snowflake conecta el uso a nivel de evento con la activación, el crecimiento y los ingresos en una sola fuente gobernada, y así se vuelven visibles las palancas de crecimiento enterradas en eventos crudos. Viewnear unifica el uso de producto, la facturación y la telemetría de red en esa fuente y construye la analítica de producto encima. Como las métricas son gobernadas y confiables, cada equipo reporta desde los mismos números." },
    ],
    name: "Tecnología y telecomunicaciones",
    headline: "Las empresas de tecnología y telecomunicaciones cuentan con datos de uso que la mayoría envidiaría.",
    seoTitle: "Snowflake para tecnología y telecom",
    seoDescription: "Datos de tecnología y telecomunicaciones en Snowflake: uso, facturación y telemetría convertidos en información gobernada.",
    intro:
      "Para negocios de software, plataformas y telecomunicaciones, convertimos el uso del producto y la telemetría de red en una fuente gobernada para el abandono de clientes, el crecimiento y la confiabilidad, de modo que los equipos actúen sobre señales y no sobre anécdotas.",
    challenges: [
      { problem: "Datos de producto y de red en silos", response: "Unificamos los datos de uso, facturación y telemetría de red en una única fuente gobernada y confiable." },
      { problem: "El abandono aparece solo cuando los clientes ya se fueron", response: "Entregamos analítica de abandono y retención que señala el riesgo a tiempo." },
      { problem: "Palancas de crecimiento enterradas en eventos crudos", response: "Construimos analítica de producto que conecta el uso con los ingresos." },
    ],
    deliverables: [
      { title: "Analítica de producto y uso", description: "Uso a nivel de evento conectado con la activación, el crecimiento y los ingresos." },
      { title: "Modelos de abandono y retención", description: "Analítica de alerta temprana sobre los clientes en mayor riesgo." },
      { title: "Pipelines de red y telemetría", description: "Telemetría de alto volumen ingerida, gobernada y lista para consultar." },
      { title: "Analítica de autoservicio", description: "Métricas confiables y gobernadas desde las que reporta cada equipo." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "8+" }],
  },
};
