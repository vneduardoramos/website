// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
export const siteSettingsEs: Record<string, unknown> = {
  hero: {
    headline: "De la estrategia de datos a la IA en producción, sobre Snowflake.",
    subhead:
      "Escoger Snowflake es lo fácil. Lo difícil es lo que se construye encima: una práctica de datos que entrega números confiables para decidir y una práctica de IA que llega a producción. Nuestro equipo arma ambas prácticas, junto con el suyo, y las deja funcionando en un nivel productivo, en toda América.",
  },
  stats: [
    { label: "Nivel de partner de Snowflake", value: "Premier" },
    { label: "Años construyendo datos e IA empresarial", value: "15+" },
    { label: "Ingenieros certificados en todo el equipo", value: "SnowPro" },
    { label: "Países en las Américas", value: "5" },
  ],
  partnership: {
    title: "El Snowflake Premier Partner en las Américas.",
    points: [
      {
        title: "Snowflake Premier Partner",
        body: "El estatus Premier pone a ingenieros con certificación SnowPro en el trabajo, respaldados por un historial de entrega verificado y de extremo a extremo en las Américas: desde la arquitectura y la migración hasta la analítica y la IA en producción.",
      },
      {
        title: "Snowflake CoCo Preferred Partner",
        body: "Como Snowflake CoCo Preferred Partner, construimos con Snowflake CoCo, el agente de codificación, para que los productos de datos y los casos de uso de IA lleguen más rápido: gobernados y validados antes de llegar a producción.",
      },
      {
        title: "Adquisición de Snowflake, simplificada",
        body: "Adquiera Snowflake directamente a través de Viewnear. Es basado en consumo (el negocio paga por el cómputo y el almacenamiento que usa) y simplificamos el compromiso de capacidad, los términos comerciales y la gestión de cuenta bajo un único partner de confianza.",
      },
      {
        title: "Entrega de extremo a extremo",
        body: "Desde la arquitectura y la migración hasta la ingeniería de datos, la analítica y la IA en producción, un único equipo responsable lleva el trabajo de extremo a extremo, y los equipos internos lo aprenden mientras construimos.",
      },
      {
        title: "El equipo local de las Américas",
        body: "Experiencia local en Canadá, Estados Unidos, México, LATAM y el Caribe. Entendemos el panorama regional de datos y estamos aquí para el largo plazo, no solo para el primer despliegue.",
      },
    ],
  },
  contact: {
    email: "contact@viewnear.com",
    blurb:
      "Cuéntenos en qué punto está la organización. Le mostraremos qué es posible. La respuesta puede ser una sesión de estrategia, una prueba de concepto o una conversación honesta sobre qué tanto han avanzado ya los competidores.",
  },
};
export const faqsEs: unknown[] = [
  { category: "Alianza y certificaciones", q: "¿Qué estatus de partner de Snowflake tiene Viewnear?", a: "Viewnear es Snowflake Premier Partner y Snowflake CoCo Preferred Partner, con ingenieros con certificación SnowPro y un historial de entrega verificado en las Américas." },
  { category: "Alianza y certificaciones", q: "¿Qué desbloquea realmente el estatus Premier?", a: "Profundidad y una línea directa con Snowflake. El estatus Premier refleja entrega certificada en todo el stack de Snowflake, y significa que trabajamos codo a codo con Snowflake: alineados con el equipo de cuenta de Snowflake del cliente en arquitectura y entrega, con visibilidad temprana de nuevas capacidades (Cortex, Openflow, Horizon Catalog, CoCo y CoWork). Nos asociamos con Snowflake para llevar cada proyecto a un resultado exitoso." },
  { category: "Alianza y certificaciones", q: "¿Cómo funciona el precio de Snowflake y se puede adquirir a través de Viewnear?", a: "Snowflake es basado en consumo: el negocio paga por el cómputo (créditos) y el almacenamiento que realmente usa, de modo que el costo de operación se ajusta al trabajo. La capacidad de Snowflake se puede adquirir a través de Viewnear para simplificar los términos comerciales y la gestión de cuenta bajo un único partner responsable." },
  { category: "Entrega y proyectos", q: "¿Cuánto tarda una implementación de Snowflake?", a: "Una primera construcción en producción típica toma de 8 a 16 semanas, según el volumen de datos, la complejidad de las fuentes y los casos de uso en alcance. Lo que lo mantiene real: un discovery pagado que fija el alcance desde el inicio, sprints impulsados por casos de uso con software funcionando en cada demo, y pruebas corriendo en paralelo con la construcción, de modo que el valor se muestra desde el primer sprint." },
  { category: "Entrega y proyectos", q: "¿Cómo reduce Viewnear el riesgo de un proyecto grande?", a: "Probamos el enfoque con una prueba de concepto acotada antes de escalar, realizamos revisiones de dirección periódicas con puntos de decisión claros, e integramos la habilitación desde el primer día, para que los equipos internos puedan operar y extender el trabajo sin nosotros." },
  { category: "Entrega y proyectos", q: "¿Puede Viewnear migrar un data warehouse existente a Snowflake?", a: "Sí. La migración es uno de nuestros proyectos más comunes (Teradata, Oracle, Hadoop, SQL Server). Gestionamos toda la entrega técnica y la gobernanza del programa." },
  { category: "Entrega y proyectos", q: "¿Puede Viewnear integrar Snowflake con ERP, CRM y sistemas operativos?", a: "Sí, en ambas direcciones. Openflow y Zero-Copy Integrations traen datos desde sistemas como SAP, Salesforce y Workday, y entregamos información de vuelta a través de Snowsight, aplicaciones de Streamlit, APIs y agentes integrados donde los equipos trabajan." },
  { category: "Aspectos comerciales", q: "¿Cómo se fija el precio de un proyecto?", a: "Los proyectos se dimensionan según el volumen y la complejidad de los datos, la cantidad de casos de uso de analítica/IA, el tamaño del equipo y el cronograma. Acordamos el alcance y el precio por adelantado y ofrecemos modelos de resultado fijo, capacidad flexible y equipo integrado: un partner medido por resultados, no por horas." },
  { category: "Aspectos comerciales", q: "¿Publica Viewnear precios estándar?", a: "No. No hay dos entornos de datos iguales, así que fijamos el precio según el trabajo. Comparta los objetivos y las restricciones, y le responderemos con un modelo, un plan y un precio." },
  { category: "Seguridad y plataforma", q: "¿Cómo mantiene Viewnear seguros los datos?", a: "Construimos sobre la plataforma certificada de Snowflake y la extendemos con acceso de mínimo privilegio, linaje y clasificación de PII con Horizon Catalog, Horizon Context para que cada persona y cada agente de IA trabaje desde el mismo contexto de negocio confiable, residencia de datos por región, y controles listos para auditoría, todo configurado según el sector del cliente." },
  { category: "Seguridad y plataforma", q: "¿Viewnear usa herramientas de terceros o se mantiene nativa en Snowflake?", a: "Lideramos con el stack nativo de Snowflake (Openflow, Snowpark, Horizon Catalog, Cortex, Snowsight, Streamlit, más el agente de codificación Snowflake CoCo y el agente de IA CoWork) para que la gobernanza y el contexto de IA (Horizon Context) se mantengan en un solo lugar. dbt es el único framework externo que operamos, de forma nativa contra Snowflake." },
];
