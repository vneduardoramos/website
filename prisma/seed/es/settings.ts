// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
export const siteSettingsEs: Record<string, unknown> = {
  hero: {
    headline: "De la estrategia de datos a la IA en producción, sobre Snowflake.",
    subhead:
      "Escoger Snowflake es lo fácil. Lo difícil es lo que se construye encima: una práctica de datos que entrega números confiables para decidir y una práctica de IA que llega a producción. Nuestro equipo arma ambas prácticas, junto con el equipo interno, y las deja funcionando en un nivel productivo, en toda América.",
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
        body: "Snowflake se adquiere directamente a través de Viewnear. Es basado en consumo (el negocio paga por el cómputo y el almacenamiento que usa) y simplificamos el compromiso de capacidad, los términos comerciales y la gestión de cuenta bajo un único partner de confianza.",
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
      "Con saber en qué punto está la organización, mostramos qué es posible. La respuesta puede ser una sesión de estrategia, un POC o una conversación honesta sobre qué tanto han avanzado ya los competidores.",
  },
};
export const faqsEs: unknown[] = [
  { category: "Alianza y certificaciones", q: "¿Qué estatus de partner de Snowflake tiene Viewnear?", a: "Viewnear es Snowflake Premier Partner y Snowflake CoCo Preferred Partner, con ingenieros con certificación SnowPro y un historial de entrega verificado en las Américas." },
  { category: "Alianza y certificaciones", q: "¿Qué desbloquea realmente el estatus Premier?", a: "Profundidad y una línea directa con Snowflake. El estatus Premier refleja entrega certificada en todo el stack de Snowflake, y significa que trabajamos codo a codo con Snowflake: alineados con el equipo de cuenta de Snowflake del cliente en arquitectura y entrega, con visibilidad temprana de nuevas capacidades (Cortex, Openflow, Horizon Catalog, CoCo y CoWork). Nos asociamos con Snowflake para llevar cada proyecto a un resultado exitoso." },
  { category: "Alianza y certificaciones", q: "¿Cómo funciona el precio de Snowflake y se puede adquirir a través de Viewnear?", a: "Snowflake es basado en consumo: el negocio paga por el cómputo (créditos) y el almacenamiento que realmente usa, de modo que el costo de operación se ajusta al trabajo. La capacidad de Snowflake se puede adquirir a través de Viewnear para simplificar los términos comerciales y la gestión de cuenta bajo un único partner responsable." },
  { category: "Entrega y proyectos", q: "¿Cuánto tarda una implementación de Snowflake?", a: "Una primera construcción en producción típica toma de 8 a 16 semanas, según el volumen de datos, la complejidad de las fuentes y los casos de uso en scope. Lo que lo mantiene real: un discovery pagado que fija el scope desde el inicio, sprints impulsados por casos de uso con software funcionando en cada demo, y pruebas corriendo en paralelo con la construcción, de modo que el valor se muestra desde el primer sprint." },
  { category: "Entrega y proyectos", q: "¿Cómo reduce Viewnear el riesgo de un proyecto grande?", a: "Probamos el enfoque con un POC acotado antes de escalar, realizamos juntas de seguimiento periódicas con puntos de decisión claros, e integramos la habilitación desde el primer día, para que los equipos internos puedan operar y extender el trabajo sin nosotros." },
  { category: "Entrega y proyectos", q: "¿Puede Viewnear migrar un data warehouse existente a Snowflake?", a: "Sí. La migración es uno de nuestros proyectos más comunes (Teradata, Oracle, Hadoop, SQL Server). Gestionamos toda la entrega técnica y la gobernanza del programa." },
  { category: "Entrega y proyectos", q: "¿Puede Viewnear integrar Snowflake con ERP, CRM y sistemas operativos?", a: "Sí, en ambas direcciones. Openflow y Zero-Copy Integrations traen datos desde sistemas como SAP, Salesforce y Workday, y entregamos información de vuelta a través de Snowsight, aplicaciones de Streamlit, APIs y agentes integrados donde los equipos trabajan." },
  { category: "Nearshore y el equipo de entrega", q: "¿Dónde está el equipo de entrega de Viewnear?", a: "Nuestro centro de entrega nearshore está en Monterrey, Nuevo León, México, con la dirección en Austin, Texas. Ingenieros, arquitectos y estrategas trabajan desde esas dos oficinas, y atendemos clientes en toda América: Canadá, Estados Unidos, México, LATAM y el Caribe." },
  { category: "Nearshore y el equipo de entrega", q: "¿En qué horario trabaja el equipo nearshore?", a: "Monterrey mantiene el horario estándar del centro (CST) todo el año, porque México ya no aplica el horario de verano. El centro de EE. UU. cambia a CDT de marzo a noviembre, así que en esos meses el reloj de Monterrey marca una hora antes. El equipo trabaja en el horario laboral del cliente de cualquier forma: la jornada se traslapa por completo y las preguntas se responden el mismo día, no al día siguiente." },
  { category: "Nearshore y el equipo de entrega", q: "¿Qué tan lejos está Monterrey de Estados Unidos y el equipo puede trabajar presencialmente?", a: "Monterrey está a unos 225 kilómetros de la frontera con Texas, con vuelos directos a las principales ciudades de Estados Unidos en una a cuatro horas. Eso hace que el trabajo presencial sea práctico y no simbólico: talleres de discovery, sesiones de arquitectura y juntas de seguimiento pueden ocurrir en la oficina del cliente sin dos días de viaje de cada lado." },
  { category: "Nearshore y el equipo de entrega", q: "¿Podemos visitar el centro de entrega en Monterrey?", a: "Sí. Los clientes son bienvenidos en nuestra oficina de Monterrey, y las visitas son comunes al inicio de un proyecto: conocer a los ingenieros que harán el trabajo, recorrer la arquitectura en un pizarrón y ver cómo opera el equipo día a día." },
  { category: "Nearshore y el equipo de entrega", q: "¿En qué se diferencia nearshore de offshore para una construcción de datos e IA?", a: "El trabajo de Snowflake e IA es iterativo: perfilar los datos, modelarlos, probar un caso de uso, ver el resultado, ajustar. Ese ciclo es rápido cuando un bloqueo planteado a las 10am se resuelve para la comida, y doloroso cuando cada ida y vuelta espera toda la noche. El modelo nearshore mantiene ese ciclo dentro de una misma jornada, con trabajo en pareja en vivo y sprint reviews a las que el equipo del cliente sí puede asistir. Offshore puede ganar en tarifario; rara vez gana en tiempo hasta un resultado funcionando." },
  { category: "Nearshore y el equipo de entrega", q: "¿El equipo trabaja en inglés o en español?", a: "En ambos. Cada ingeniero tiene dominio del inglés y el equipo es completamente bilingüe, así que las sesiones de trabajo, la documentación y la habilitación ocurren en el idioma que el equipo prefiera. No hay una capa de traducción entre el cliente y las personas que hacen el trabajo." },
  { category: "Aspectos comerciales", q: "¿Qué modelos de colaboración existen?", a: "Tres, y se pueden combinar: entrega de resultado fijo con precio atado a un resultado definido, capacidad flexible cuando el scope sigue moviéndose, y un equipo integrado o dedicado que trabaja dentro de sus sprints, repositorios y estándares. Quienes buscan extensión de equipo o staff augmentation suelen elegir el modelo integrado. Los tres se miden por resultados y no por horas." },
  { category: "Seguridad y plataforma", q: "¿El trabajo permanece dentro de nuestro entorno y bajo nuestros controles?", a: "Sí. La construcción corre en la cuenta de Snowflake, los repositorios y el CI del cliente, bajo los controles de acceso y el proceso de cambios del cliente. Los ingenieros trabajan como identidades nombradas con acceso de mínimo privilegio, bajo términos de confidencialidad firmados, y el linaje de Horizon Catalog mantiene una traza auditable de lo que cambió." },
  { category: "Aspectos comerciales", q: "¿Cómo se fija el precio de un proyecto?", a: "Los proyectos se dimensionan según el volumen y la complejidad de los datos, la cantidad de casos de uso de analítica/IA, el tamaño del equipo y el cronograma. Acordamos el scope y el precio por adelantado y ofrecemos modelos de resultado fijo, capacidad flexible y equipo integrado: un partner medido por resultados, no por horas." },
  { category: "Aspectos comerciales", q: "¿Publica Viewnear precios estándar?", a: "No. No hay dos entornos de datos iguales, así que fijamos el precio según el trabajo. Con los objetivos y las restricciones sobre la mesa, respondemos con un modelo, un plan y un precio." },
  { category: "Seguridad y plataforma", q: "¿Cómo mantiene Viewnear seguros los datos?", a: "Construimos sobre la plataforma certificada de Snowflake y la extendemos con acceso de mínimo privilegio, linaje y clasificación de PII con Horizon Catalog, Horizon Context para que cada persona y cada agente de IA trabaje desde el mismo contexto de negocio confiable, residencia de datos por región, y controles listos para auditoría, todo configurado según el sector del cliente." },
  { category: "Seguridad y plataforma", q: "¿Viewnear usa herramientas de terceros o se mantiene nativa en Snowflake?", a: "Lideramos con el stack nativo de Snowflake (Openflow, Snowpark, Horizon Catalog, Cortex, Snowsight, Streamlit, más el agente de codificación Snowflake CoCo y el agente de IA CoWork) para que la gobernanza y el contexto de IA (Horizon Context) se mantengan en un solo lugar. dbt es el único framework externo que operamos, de forma nativa contra Snowflake." },
];
