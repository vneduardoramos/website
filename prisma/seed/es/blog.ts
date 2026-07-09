// Spanish (es) overlay. Keyed by slug. Optional: empty means the row falls back to English. Filled by the content-translation phase.
// Body comes from prisma/seed/content/blog/<slug>.es.md, NOT here.
export const blogPostsEs: Record<string, { title?: string; excerpt?: string; keyTakeaways?: string[]; seoTitle?: string; seoDescription?: string }> = {
  "snowflake-control-plane-agentic-enterprise": {
    title: "Snowflake es ahora el plano de control de la empresa agéntica",
    excerpt: "Snowflake nació como plataforma de datos, pero el auge de la IA agéntica exige un plano de control gobernado que unifique datos confiables, contexto de negocio, elección de modelo, seguridad y flujos de trabajo. Este artículo explica por qué Snowflake se posiciona como esa capa operativa para la empresa agéntica.",
    keyTakeaways: [
      "La empresa agéntica necesita un plano de control que coordine datos, contexto, modelos, agentes, gobierno y acción.",
      "Los datos empresariales gobernados son la base desde la que debe partir la IA agéntica, no los agentes en sí.",
      "El contexto de negocio, las definiciones, las métricas y los modelos semánticos son lo que permite a los agentes razonar de forma correcta y consistente.",
      "El gobierno agéntico pasa de quién puede ver qué a qué se les permite hacer y ejecutar a los agentes.",
      "Snowflake evoluciona de data warehouse a capa operativa de IA, posicionándose como el plano de control de la IA empresarial.",
    ],
  },
  "ai-assistant-understands-your-data": {
    title: "El asistente de IA que de verdad entiende sus datos (y por qué eso importa)",
    excerpt: "Snowflake Cortex Agents no son solo otra función de chatbot. Tras implementarlos en múltiples entornos de clientes, he visto cómo transforman la manera en que los usuarios de negocio interactúan con los datos, y es más profundo de lo que esperaba en un principio.",
    keyTakeaways: [
      "Cortex Agents operan dentro de la plataforma de datos, así que consultan datos en vivo y heredan de forma automática los permisos y el gobierno que usted ya tiene.",
      "El servicio al cliente es el mejor punto de partida porque el valor es inmediato: los agentes dan a los representantes el historial completo de un cliente y la memoria institucional de casos anteriores.",
      "La preparación de datos se trata de contexto de negocio, no de ingeniería pesada: nombres de campos legibles, categorías significativas y reglas de negocio documentadas.",
      "La seguridad y el costo se comportan como el resto de Snowflake, con seguridad a nivel de fila, enmascaramiento, registros de auditoría compartidos y precios transparentes basados en consumo.",
      "El mayor obstáculo suele ser organizacional, así que comience con casos de uso de alto valor, alcance limitado y capacitación enfocada en técnicas de conversación.",
    ],
  },
  "data-warehouse-revolution-five-years": {
    title: "La transformación del data warehouse que he visto desarrollarse durante cinco años",
    excerpt: "Cuando empecé a recomendar Snowflake a los clientes, muchos eran escépticos sobre el data warehousing en la nube. Hoy, esas mismas organizaciones no imaginan volver a los sistemas tradicionales, y aquí está por qué esta transformación importa.",
    keyTakeaways: [
      "Las plataformas nativas de la nube eliminan las restricciones de almacenamiento y cómputo que definían el diseño tradicional del data warehouse, cambiando las preguntas que los equipos se hacen sobre sus datos.",
      "Separar cómputo y almacenamiento es la clave: cada uno escala de forma independiente, y la arquitectura multiclúster evita que las cargas de trabajo interfieran entre sí.",
      "Operaciones casi sin mantenimiento, escalado instantáneo y compartición de datos en vivo permiten a los equipos concentrarse en los problemas de negocio en lugar de en la carga administrativa.",
      "Los precios basados en consumo alinean el costo con el uso real, pero exigen nuevos hábitos de monitoreo para evitar sorpresas durante el desarrollo y las pruebas.",
      "Comience con una prueba de concepto enfocada y de alto valor que muestre las nuevas capacidades, en lugar de intentar una migración completa de entrada.",
    ],
  },
  "bi-integration-challenge-power-bi-tableau-snowflake": {
    title: "El reto de integración que enfrenta todo equipo de BI (y cómo lo resolvemos)",
    excerpt: "Conectar Snowflake con sus herramientas de BI favoritas no debería ser ciencia espacial. Tras decenas de implementaciones, estos son los patrones que funcionan y las trampas que hacen perder tiempo.",
    keyTakeaways: [
      "Use cuentas de servicio con autenticación por par de llaves y warehouses dedicados por herramienta para mantener el rendimiento predecible y los costos claros.",
      "Elija DirectQuery o conexiones en vivo para datos grandes y cambiantes, e importación o extractos para datos más pequeños y estables, y combínelos en un modelo híbrido.",
      "Implemente la seguridad una sola vez en Snowflake con políticas a nivel de fila y vistas seguras para que cada herramienta de BI herede el mismo gobierno.",
      "Un auto-suspend agresivo más el auto-escalado multiclúster controla el costo sin perjudicar la experiencia del usuario.",
      "Diseñe las integraciones para la flexibilidad y el gobierno en lugar de optimizarlas para una sola herramienta o caso de uso.",
    ],
  },
  "why-snowflake-ai-strategy-matters": {
    title: "Por qué todo equipo de datos debería prestar atención a la estrategia de IA de Snowflake",
    excerpt: "Desde una posición privilegiada observando la evolución de la IA de Snowflake, esto no es solo otro proveedor agregando funciones de ML. Es un cambio fundamental que transformará cómo construimos e implementamos aplicaciones de IA.",
    keyTakeaways: [
      "Llevar la IA a la nube de datos elimina la barrera entre el almacenamiento de datos y el procesamiento de IA, de modo que puede analizar texto y ejecutar modelos donde sus datos ya residen.",
      "Las funciones de Cortex permiten combinar la analítica tradicional con hallazgos de IA en una sola consulta, desde el análisis de sentimiento hasta la extracción de documentos y el pronóstico.",
      "Como la IA se ejecuta dentro de la plataforma, los controles de acceso, los registros de auditoría y las políticas de gobierno existentes se aplican de forma automática sin configuración adicional.",
      "Los precios basados en consumo implican que los costos de IA escalan con el uso, y los mismos hábitos de monitoreo y optimización que usa para las consultas aplican a las cargas de trabajo de IA.",
      "Comience con casos de uso enfocados y de alto valor, potencie el juicio humano en lugar de reemplazarlo, y planifique una mejora iterativa a medida que las capacidades evolucionan.",
    ],
  },
  "zero-copy-cloning-snowflake": {
    title: "Entender el Zero-Copy Cloning: la función más subutilizada de Snowflake",
    excerpt: "El Zero-Copy Cloning suena demasiado bueno para ser cierto hasta que entiende su mecánica. Así funciona esta capacidad y por qué debería formar parte del arsenal de todo equipo de datos.",
    keyTakeaways: [
      "El Zero-Copy Cloning crea copias de base de datos instantáneas y totalmente funcionales al compartir los archivos de datos subyacentes, de modo que clonar una base de datos de 100TB toma el mismo tiempo que clonar una de 100GB.",
      "Los costos de almacenamiento parten de cero y solo crecen a medida que el clon y el original divergen por actualizaciones, lo que hace práctica la clonación para el desarrollo, las pruebas y el análisis cotidianos.",
      "Los clones heredan la seguridad, el enmascaramiento y los controles de acceso del origen, así que el gobierno se aplica de forma automática sin configuración adicional.",
      "Acompañe los clones con nomenclatura descriptiva, políticas de ciclo de vida y monitoreo de almacenamiento para evitar clones olvidados y de larga duración que acumulan costo en silencio.",
      "Los casos de uso abarcan entornos de desarrollo, pruebas A/B, reportes de un momento específico, ensayos de migración, pruebas de recuperación ante desastres e investigaciones de soporte aisladas.",
    ],
  },
  "snowflake-compute-storage-architecture": {
    title: "Por qué la arquitectura de cómputo y almacenamiento de Snowflake sí importa para su estrategia de datos",
    excerpt: "Entender las decisiones arquitectónicas de Snowflake no es mera curiosidad técnica. Es la base para optimizar el rendimiento, controlar los costos y construir soluciones de datos escalables.",
    keyTakeaways: [
      "Separar cómputo y almacenamiento permite escalar cada uno de forma independiente, así que paga por lo que realmente usa en lugar de aprovisionar para la capacidad máxima las 24 horas.",
      "El multiclúster y el aislamiento de recursos evitan que distintas cargas de trabajo (ETL, consultas de usuarios, desarrollo) interfieran entre sí, a la vez que le dan una visibilidad clara del costo.",
      "La optimización pasa del ajuste de índices y las disposiciones físicas de almacenamiento a la organización de datos, las clustering keys, las vistas materializadas y el almacenamiento en caché de resultados.",
      "Los resource monitors, el auto-suspend y el dimensionamiento correcto convierten el control de costos en una disciplina predecible y automatizada.",
      "La separación arquitectónica es lo que hace económicamente viables el escalado instantáneo, el zero-copy cloning y la compartición segura de datos.",
    ],
  },
  "snowflake-summit-2025-takeaways": {
    title: "De regreso de Snowflake Summit 2025: lo que destacó, lo que nos hizo reflexionar y lo que sigue",
    excerpt: "Acabamos de regresar de Snowflake Summit 2025 en San Francisco, y más allá de un roadmap lleno de novedades emocionantes, lo que destacó fueron las conversaciones reflexivas, la dirección clara hacia la que se encamina la plataforma, y cómo esos cambios se alinean con la forma en que ayudamos a los clientes a construir soluciones de datos más inteligentes, rápidas y preparadas para el futuro.",
    keyTakeaways: [
      "Snowflake CoWork trae consultas en lenguaje natural construidas sobre datos gobernados, seguros y conscientes de roles, pero el impacto real depende de combinarlo con los modelos de datos y los casos de uso adecuados.",
      "Cortex AISQL aplica IA generativa directamente dentro de SQL, resumiendo, analizando y clasificando datos no estructurados sin sacar nada de Snowflake.",
      "Adaptive Compute, Gen 2 Warehouses y valores de seguridad predeterminados más sólidos (passkeys, MFA, monitoreo de credenciales filtradas) liberan tiempo para el diseño estratégico por encima del ajuste manual.",
      "Los dbt Projects nativos en Snowsight estrechan el ciclo de analytics engineering, y Openflow (mediante la adquisición de Datavolo) apunta hacia un movimiento de datos más rico dentro de la plataforma.",
      "Viewnear ya está actuando: pilotos de Cortex AISQL, líneas base de arquitectura actualizadas para Gen 2, y definición de alcance de Snowflake CoWork dentro de las organizaciones de los clientes.",
    ],
  },
  "snowflake-cortex-aisql-first-look": {
    title: "De SQL a IA generativa: un primer vistazo a Snowflake Cortex AISQL",
    excerpt: "Las nuevas funciones Cortex AISQL de Snowflake permiten ejecutar tareas de modelos de lenguaje grandes como clasificación, extracción, traducción e incluso preguntas y respuestas sobre imágenes directamente en SQL. Esto es lo que significa para los equipos de datos, cómo funciona en la práctica y dónde vemos en Viewnear las mayores oportunidades.",
    keyTakeaways: [
      "Cortex AISQL integra LLMs de última generación directamente dentro del motor de Snowflake, así que no hay infraestructura de IA adicional que levantar y sus datos nunca salen de la plataforma.",
      "Los analistas pueden prototipar flujos de trabajo con LLM sin más que una sentencia SELECT, clasificando sentimiento, extrayendo campos y respondiendo preguntas sobre imágenes en una sola consulta.",
      "Combinar PARSE_DOCUMENT con AI_COMPLETE procesa PDFs y fotos de celular en un solo pipeline, lo que es ideal para casos de uso de hipotecas y seguros.",
      "Los roles, las políticas de enmascaramiento y la seguridad a nivel de fila existentes siguen aplicando, y los créditos escalan con los tokens de entrada y el modelo elegido, así que prototipe en pequeño y monitoree el uso.",
      "La cuestión del hospedaje está en gran medida resuelta; la verdadera decisión ahora es qué problema de negocio abordar primero.",
    ],
  },
  "agi-ready-data-cloud": {
    title: "Pasos silenciosos hacia una nube de datos lista para la AGI",
    excerpt: "La inteligencia artificial general ya no se siente como ciencia ficción, pero incluso los modelos más inteligentes tropezarán sin datos disciplinados y confiables. Este artículo describe los cambios de mentalidad que necesitan los líderes de negocio, muestra cómo Snowflake allana el camino con discreción y explica por qué Viewnear prefiere logros pequeños y bien gobernados frente a apuestas grandes y arriesgadas.",
    keyTakeaways: [
      "Las ambiciones de AGI viven o mueren según la confianza en los datos, el gobierno adaptativo y la velocidad de entrega, no solo según el tamaño del modelo.",
      "La calidad de los datos se capitaliza como el interés: el linaje explicable, las políticas portables y el conocimiento continuo rinden más cuando llega la primera auditoría de IA.",
      "La separación entre almacenamiento y cómputo de Snowflake permite que los registros crudos, las vistas gobernadas y los agentes inteligentes coexistan sin saltos de datos.",
      "Los ejecutivos ganan al presupuestar para la calidad de datos, patrocinar pilotos enfocados con métricas claras y hacer evolucionar el gobierno en tiempo real.",
      "Comience con una decisión de alta frecuencia, reconstrúyala sobre la capa de IA nativa de Snowflake, y publique la precisión y el costo abiertamente para generar impulso.",
    ],
  },
  "llms-to-ai-agents-snowflake-cortex": {
    title: "De los LLM a los agentes de IA: por qué Snowflake Cortex marca una nueva era para la IA empresarial",
    excerpt: "Como líderes de negocio, todos hemos visto el revuelo alrededor de los modelos de lenguaje grandes. Pero el paso hacia los agentes de IA, impulsados por Snowflake Cortex, es donde comienza el verdadero valor de negocio.",
    keyTakeaways: [
      "Los LLM son pasivos; responden preguntas pero no toman decisiones ni ejecutan acciones. Los agentes de IA perciben, razonan, planifican, actúan y aprenden, comportándose más como compañeros de trabajo digitales que como herramientas.",
      "Los agentes de datos son la categoría de mayor impacto, combinando datos estructurados y no estructurados en hallazgos confiables con precisión, eficiencia y gobierno incorporados.",
      "Snowflake Cortex ha avanzado rápido: el soporte multimodal llegó en abril de 2025 y Cortex AISQL en junio de 2025, haciendo que la IA se trate más de resultados de negocio que de habilidad técnica.",
      "El gobierno y la seguridad deben estar incorporados desde el primer día, que es lo que permite a los líderes pasar de los experimentos a la producción sin comprometer la confianza.",
      "La brecha entre las empresas que experimentan con IA agéntica y las que la ponen en operación se está ampliando, y quienes adoptan temprano avanzarán más rápido y superarán a su competencia.",
    ],
  },
  "viewnear-snowflake-openflow-data-workflows": {
    title: "Cómo Viewnear usa Snowflake Openflow para construir la próxima generación de flujos de trabajo de datos",
    excerpt: "Snowflake Openflow, impulsado por Apache NiFi, le da a Viewnear el control, la flexibilidad y la velocidad para mover y preparar datos para la analítica y la IA. Combina el diseño visual de flujos de trabajo con estándares de ingeniería modernos para que nuestros equipos construyan pipelines escalables y gobernados más rápido que nunca.",
    keyTakeaways: [
      "Snowflake Openflow es un servicio de ingesta y orquestación totalmente administrado, construido sobre Apache NiFi, que permite a los equipos diseñar, implementar y observar pipelines directamente en Snowflake.",
      "Su arquitectura dividida (un plano de control administrado por Snowflake y un plano de datos desplegable en BYOC o Snowpark Container Services) maneja datos estructurados, semiestructurados, en streaming y no estructurados con decenas de conectores.",
      "Viewnear trata los flujos de trabajo de datos como código: control de versiones basado en Git, automatización de CI/CD, monitoreo integrado y entornos consistentes entre desarrollo, pruebas y producción.",
      "Combinar el diseño visual de NiFi con la disciplina impulsada por Git permite que varios ingenieros colaboren en paralelo, rastreen cambios y reviertan de forma segura.",
      "A medida que crecen las cargas de trabajo de IA, el ETL regresa para curar y enriquecer los datos antes de que lleguen al warehouse, y Openflow lo lleva a la era moderna en la ingesta de streaming, por lotes y no estructurada.",
    ],
  },
  "center-of-software-work-moving-data-ai": {
    title: "El centro del trabajo de software se está moviendo, y Data + AI lo hacen evidente",
    excerpt: "A medida que la IA y los agentes asumen más del trabajo mecánico de implementación, la parte intermedia de construir software se adelgaza. El verdadero apalancamiento se traslada a la intención, el contexto, las definiciones y la responsabilidad, porque ejecutar rápido sin claridad solo genera errores rápidos.",
    keyTakeaways: [
      "La parte intermedia del trabajo de software, traducir manualmente la intención en implementación, se adelgaza a medida que los agentes producen código funcional y transformaciones a partir de objetivos y contexto.",
      "Qué se necesita construir sigue siendo la pregunta más difícil; los agentes actúan directamente sobre lo que se les da, así que la ambigüedad se convierte en un multiplicador.",
      "El diseño se trata de claridad de intención, no de artefactos, y esa claridad ahora impulsa la ejecución en lugar de solo la planificación.",
      "Los agentes se vuelven drásticamente más efectivos en entornos ricos en contexto donde la retroalimentación, las fuentes de datos, las entidades y los resultados están claramente conectados.",
      "Cuando la ejecución es barata, el costo se traslada a la verificación, el gobierno y a entregar cambios sin romper el significado.",
    ],
  },
  "separation-with-purpose-apps-analytics": {
    title: "Separación con propósito: cómo los equipos modernos mantienen las apps rápidas y la analítica escalable",
    excerpt: "PostgreSQL y Snowflake fueron construidos para tipos de trabajo diferentes. Con Snowflake Postgres, los equipos ahora pueden ejecutar cargas de trabajo transaccionales y analíticas en la misma nube de datos, sin difuminar responsabilidades ni sacrificar el rendimiento.",
    keyTakeaways: [
      "La mayoría de los problemas de datos provienen de límites poco claros entre sistemas, no de una mala tecnología.",
      "PostgreSQL está optimizado para transacciones rápidas y confiables, mientras que Snowflake está construido para analizar grandes volúmenes de datos a escala.",
      "Snowflake Postgres permite a los equipos ejecutar cargas de trabajo de PostgreSQL dentro de Snowflake manteniendo separado el trabajo transaccional del analítico.",
      "Los datos operativos residen cerca de la capa analítica, y aun así las cargas de trabajo transaccionales permanecen aisladas del cómputo analítico.",
      "El mayor beneficio es organizacional: con responsabilidades claras, los equipos se concentran en los resultados en lugar de negociar alrededor del riesgo.",
    ],
  },
  "from-hours-to-outcomes-ai-economics-services": {
    title: "De las horas a los resultados: cómo la IA cambió la economía de los servicios",
    excerpt: "En Viewnear no vendemos horas ni personal. Diseñamos resultados. Como socio dedicado exclusivamente a Snowflake, vemos con claridad que la IA ha cambiado dónde se crea el valor, moviendo la experiencia hacia arriba: dirigir soluciones, orquestar agentes y responder por los resultados.",
    keyTakeaways: [
      "El precio por hora se alineaba con un mundo donde el valor se creaba mediante la ejecución manual; la IA ha roto ese vínculo al automatizar gran parte del trabajo mecánico.",
      "La experiencia no se ha erosionado, se ha movido hacia arriba: de la ejecución manual al diseño, la supervisión y la orquestación.",
      "Snowflake hace que los resultados sean medibles casi en tiempo real, que es exactamente por qué el precio basado en tiempo se desmorona tan rápido en la plataforma.",
      "Viewnear opera un modelo de capacidad flexible: primero define el resultado, luego diseña la entrega en reversa, partiendo de ese resultado, con la combinación adecuada de roles humanos y agentes de IA.",
      "Los servicios basados en resultados no son más baratos; exigen más experiencia sénior, criterios de éxito claros y una responsabilidad que recae en el proveedor.",
    ],
  },
  "snowflake-foundation-for-data-intelligence": {
    title: "De lo restringido a lo omnipresente: Snowflake como base para la inteligencia de datos",
    excerpt: "Snowflake cambió la economía de los datos, convirtiendo lo que antes era restringido, lento y limitado en algo elástico, gobernado y accesible en toda la empresa. A medida que la IA reduce la distancia entre las preguntas y las respuestas, Snowflake se convierte en el lugar donde usted conversa con sus datos y pasa del conocimiento a la acción más rápido que nunca.",
    keyTakeaways: [
      "Snowflake cambió la economía de los datos: el desacoplamiento de almacenamiento y cómputo, la escala elástica y la compartición nativa convirtieron el uso de los datos de restringido a omnipresente.",
      "El verdadero valor de Snowflake es como capa de distribución para datos empresariales gobernados, donde los dominios se cruzan sobre una única fuente de verdad sin copias ni fricción.",
      "La IA solo funciona cuando se sustenta en datos gobernados y de alta calidad, así que la inteligencia se ejecuta directamente sobre el sistema de registro en lugar de sobre copias en la sombra.",
      "Con Snowflake CoWork impulsado por Cortex AI, el lenguaje natural se convierte en una interfaz de primer nivel hacia los datos gobernados sin eludir el gobierno.",
      "El cambio va de mejor analítica a inteligencia operativa incorporada en los flujos de trabajo diarios, con Snowflake como capa de ejecución.",
    ],
  },
};
