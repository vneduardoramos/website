// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
export const industriesEs: Record<string, { name?: string; headline?: string; intro?: string; body?: string; challenges?: { problem: string; response: string }[]; deliverables?: { title: string; description: string }[]; stats?: { label: string; value: string }[]; seoTitle?: string; seoDescription?: string }> = {
  "construction-real-estate": {
    name: "Construcción y bienes raíces",
    headline: "Cada proyecto y cada propiedad generan datos. La mayoría nunca llega a una decisión.",
    intro:
      "Desde el avance en obra hasta el desempeño del portafolio, unificamos los datos de proyecto, costo y activos en una única fuente gobernada para que desarrolladores, contratistas y propietarios vean el cronograma, el presupuesto y el rendimiento casi en tiempo real.",
    challenges: [
      { problem: "Datos de proyecto atrapados en hojas de cálculo", response: "Consolidamos los datos de cronograma, costo y avance en una única fuente gobernada y confiable." },
      { problem: "Sin visibilidad a nivel de portafolio", response: "Entregamos analítica de portafolio y activos en cada propiedad y proyecto." },
      { problem: "Sobrecostos y retrasos detectados demasiado tarde", response: "Exponemos el presupuesto frente al real y el riesgo de cronograma mientras aún hay tiempo de actuar." },
    ],
    deliverables: [
      { title: "Analítica de costo y cronograma de proyecto", description: "Presupuesto frente al real, valor ganado y riesgo de cronograma en una sola vista." },
      { title: "Tableros de portafolio y activos", description: "Ocupación, rendimiento y desempeño en todo el portafolio." },
      { title: "Base de datos de proyecto unificada", description: "Una fuente gobernada que consolida los sistemas ERP, de proyecto y de campo." },
      { title: "Modelos de pronóstico y valuación", description: "Insumos basados en datos para valuación, planeación de capital y licitaciones." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "6+" }],
  },
  "education": {
    name: "Educación",
    headline: "Las instituciones abundan en datos de estudiantes y carecen de información útil.",
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
      { title: "Tableros de inscripción y operación", description: "Admisiones, capacidad y desempeño operativo de un vistazo." },
      { title: "Base de datos educativa unificada", description: "Una base gobernada que abarca los sistemas académicos y administrativos." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "5+" }],
  },
  "financial-services": {
    name: "Servicios financieros",
    headline: "En los servicios financieros, los datos valen más que los productos. Deberían tratarse así.",
    intro:
      "En banca, seguros y gestión de activos, las organizaciones que ganan son las que convierten los datos financieros fragmentados en una única fuente gobernada y confiable para reportes, cumplimiento e IA.",
    challenges: [
      { problem: "Fuentes de datos fragmentadas", response: "Consolidamos datos financieros complejos en un único data warehouse empresarial gobernado." },
      { problem: "Reportes de cumplimiento hechos a mano", response: "Automatizamos los reportes regulatorios y externos estructurados desde una única fuente gobernada." },
      { problem: "Decisiones sobre datos desactualizados", response: "Entregamos analítica de autoservicio para que los equipos actúen sobre cifras actuales y confiables." },
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
    name: "Manufactura",
    headline: "El piso de producción genera datos más rápido de lo que la mayoría de los equipos alcanza a usar.",
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
      { title: "Modelos de mantenimiento predictivo", description: "Bases de datos para pronosticar fallas antes de que ocurran." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "7+" }],
  },
  "media-entertainment-advertising": {
    name: "Medios, entretenimiento y publicidad",
    headline: "Las audiencias se mueven rápido. Los datos que las siguen deberían moverse más rápido.",
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
      { title: "Base de datos de medios unificada", description: "Una base gobernada que abarca los sistemas de anuncios, suscripción y contenido." },
    ],
    stats: [{ label: "Clientes en esta industria", value: "5+" }],
  },
  "retail-cpg": {
    name: "Retail y CPG",
    headline: "El margen en retail es delgado. Las decisiones basadas en datos son donde se recupera.",
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
    name: "Tecnología y telecomunicaciones",
    headline: "Las empresas de software y telecomunicaciones cuentan con datos de uso que la mayoría de las compañías envidiaría. La oportunidad está en sacarles más provecho.",
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
