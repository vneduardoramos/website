// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
// Body comes from prisma/seed/content/case-studies/<slug>.es.md, NOT here.
export const caseStudiesEs: Record<string, { title?: string; summary?: string; sector?: string; challenge?: string; solution?: string; results?: string; metrics?: { value: string; label: string }[]; quote?: { text: string; author: string; role: string }; seoTitle?: string; seoDescription?: string }> = {
  "sku-catalog-governance": {
    sector: "Manufactura",
    seoTitle: "Gobierno de SKU y costos exactos",
    seoDescription: "El catálogo de un fabricante de empaque creció a miles de SKU sin control. Arquitectura de producto y gobierno en Snowflake devolvieron costos exactos.",
    title: "Controlar miles de SKU descontrolados para recuperar la precisión de los costos de producto",
    summary:
      "El catálogo de productos de un fabricante de empaques de cartón corrugado se disparó hasta miles de SKU y variantes, sin una arquitectura de producto, lo que distorsionaba los costos y ralentizaba la producción. Viewnear diseñó una base gobernada en Snowflake: un almacén de datos Medallion alimentado desde SAP Business One mediante Openflow, reglas de gobierno para datos maestros y SKU, un catálogo de SKU estándar, simulación What-if y un agente de catálogo en Snowflake CoWork sobre Semantic Views gobernadas.",
    metrics: [
      { value: "Medallion", label: "Almacén Bronze, Silver, Gold" },
      { value: "3–5", label: "Catálogos críticos en la primera fase" },
      { value: "What-if", label: "Simulación de optimización de SKU" },
      { value: "CoWork", label: "Agente de catálogo en lenguaje natural" },
    ],
  },
  "construction-cad-data-foundation": {
    sector: "Construcción e inmobiliaria",
    seoTitle: "De planos CAD a datos accionables",
    seoDescription: "Cuatro fuentes desconectadas, entre ellas planos arquitectónicos CAD, unificadas en una sola fuente de verdad gobernada en Snowflake.",
    title: "Convertir planos arquitectónicos CAD en datos medibles y listos para la toma de decisiones",
    summary:
      "Unificamos cuatro fuentes desconectadas, incluidos los planos arquitectónicos CAD, en una única fuente de verdad gobernada en Snowflake. Los datos de diseño que estaban atrapados en los planos se convirtieron en datos estructurados y medibles, junto con los datos de construcción, finanzas y terrenos, y sobre esa base entregamos agentes de Snowflake CoWork y bots de Slack.",
    metrics: [
      { value: "4", label: "Fuentes unificadas, incluido CAD" },
      { value: "CAD", label: "Planos convertidos en datos gobernados y medibles" },
      { value: "Agents", label: "Snowflake CoWork + bots de Slack" },
      { value: "1", label: "Fuente para programas, proyectos y terrenos" },
    ],
  },
  "real-time-student-data-pipeline": {
    sector: "Educación",
    seoTitle: "Analítica estudiantil en siete semanas",
    seoDescription: "Expedientes académicos y eventos de aprendizaje de campus en Miami y Latinoamérica, unificados en información en vivo de más de 20,000 estudiantes.",
    title: "Visibilidad en tiempo real de más de 20,000 estudiantes en varios campus, en operación en siete semanas",
    summary:
      "Un grupo de universidades que atiende a más de 20,000 estudiantes en Miami y América Latina tenía los registros académicos y los eventos de aprendizaje del LMS aislados en silos entre campus. Viewnear construyó un pipeline de datos de estudiantes gobernado y en tiempo real sobre Snowflake: un entorno gobernado, integración nativa con Anthology Illuminate Developer y streaming de eventos Caliper en tiempo real, unificando los datos académicos y de actividad de aprendizaje en una única fuente gobernada.",
    metrics: [
      { value: "20k+", label: "Estudiantes en Miami y LATAM" },
      { value: "Real-time", label: "Eventos de aprendizaje Caliper, antes por lotes" },
      { value: "2", label: "Fuentes principales unificadas (Blackboard + Caliper)" },
      { value: "7 wks", label: "Hasta una base gobernada y en tiempo real" },
    ],
  },
  "insurance-claims-cortex-ai": {
    sector: "Seguros",
    seoTitle: "Clasificación de reclamaciones con Cortex",
    seoDescription: "Documentos de seguros clasificados a mano, reemplazados por Snowflake Cortex AI con 95% de precisión en segundos.",
    title: "De documentos clasificados a mano a la clasificación de reclamaciones con 95% de precisión en segundos",
    summary:
      "Una empresa de procesamiento de reclamaciones clasificaba a mano los documentos de numerosas aseguradoras, lo que causaba demoras, errores y archivos extraviados. Con funciones de Snowflake Cortex AI como AI_EXTRACT, Viewnear automatizó la clasificación y la extracción de datos, elevando la precisión del 60% al 95% y reduciendo el procesamiento por documento a cuatro segundos.",
    metrics: [
      { value: "60→95%", label: "Precisión de clasificación" },
      { value: "4 sec", label: "Clasificación por documento" },
      { value: "40%", label: "Documentos descartados recuperados" },
      { value: "88%", label: "Menos errores de clasificación" },
    ],
  },
  "corporate-mdm-golden-record": {
    sector: "Automotriz",
    seoTitle: "Datos maestros: un registro dorado",
    seoDescription: "Un grupo distribuidor de vehículos comerciales unificó ventas, servicio, partes y administración en un registro dorado en ocho dominios.",
    title: "Un golden record confiable en ocho dominios de negocio",
    summary:
      "Un grupo de distribuidores de vehículos comerciales operaba ventas, servicio, refacciones y el back office en sistemas separados, sin una versión única de cada cliente, vehículo, refacción o proveedor. Viewnear está construyendo una base corporativa de datos maestros sobre Snowflake, entregada dominio por dominio: un golden record progresivo y multifuente en ocho dominios de negocio, con arquitectura Medallion, ingesta con Openflow, transformaciones con dbt y agentes de Snowflake CoWork por dominio.",
    metrics: [
      { value: "3", label: "Sistemas fuente unificados" },
      { value: "8", label: "Dominios de negocio consolidados" },
      { value: "Medallion", label: "Bronze, Silver, Gold" },
      { value: "12 mo", label: "Hoja de ruta: tres entregas por fases" },
    ],
  },
  "magnolia-doors-installation-scheduling": {
    sector: "Manufactura",
    seoTitle: "Claude planea 40 instalaciones y no agenda ninguna",
    seoDescription: "Claude y un conector MCP en producción para Odoo 18. Las reglas deciden lo que debe ser exacto, Claude lo que exige criterio, y nada se escribe sin aprobación.",
    title: "Claude planea 40 instalaciones por semana y no puede agendar ni una sola por su cuenta",
    summary:
      "Viewnear rediseñó el agendamiento de instalaciones para Magnolia Doors, un fabricante de herrería en San Antonio cuyas propias cuadrillas instalan todo lo que fabrica, en torno a Claude y un conector Model Context Protocol a la medida para Odoo 18 Enterprise. Las reglas deterministas son dueñas de lo que debe ser exacto; Claude se encarga de lo que las reglas hacen mal: leer el alcance escrito en vez de las casillas, explicar por qué un trabajo no puede avanzar y nombrar la base de cada inferencia. Cuatro de las cinco etapas no tienen herramienta de escritura, y la quinta escribe solo detrás de una allowlist, un token de aprobación firmado y una confirmación al ejecutar.",
    metrics: [
      { value: "0", label: "Registros escritos en el ERP sin aprobación humana" },
      { value: "20", label: "Eventos por propuesta, creados de forma atómica" },
      { value: "30–40", label: "Eventos de instalación por semana, 157 en el pico" },
      { value: "~3 min", label: "Por evento, desde un estimado de 23 a 35 a mano" },
    ],
  },
};
