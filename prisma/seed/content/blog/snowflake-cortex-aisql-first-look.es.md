## Por qué esto importa

En Snowflake Summit 2025, la compañía presentó [Cortex AISQL](/es/data-ai), una familia de funciones integradas que incorporan LLMs de última generación directamente dentro del motor de Snowflake. Para los equipos que ya almacenan datos gobernados en Snowflake, esto trae tres beneficios inmediatos:

- **Sin infraestructura adicional:** Todo se ejecuta dentro de la plataforma, por lo que se evita tener que levantar un servicio de IA aparte.
- **Seguridad unificada:** Los datos nunca salen de Snowflake, y los roles, las políticas de enmascaramiento y los controles de acceso a nivel de fila existentes siguen aplicándose.
- **Iteración rápida:** Los analistas pueden crear prototipos de flujos de trabajo con LLM usando nada más que una sentencia SELECT.

## ¿Qué hay en la caja de herramientas?

### Funciones principales de texto y documentos

- **AI_COMPLETE:** completados de formato libre, resúmenes, preguntas y respuestas
- **AI_CLASSIFY:** clasificación de texto zero-shot y few-shot
- **AI_FILTER:** filtrado por políticas o por sentimiento
- **AI_SIMILARITY:** búsqueda de similitud vectorial sobre texto
- **PARSE_DOCUMENT:** OCR y análisis estructural de PDFs, imágenes y documentos de Word

### Funciones con soporte para imágenes

La misma interfaz de AI_COMPLETE puede describir imágenes, extraer entidades y responder preguntas sobre elementos visuales como gráficos o diagramas.

## Una demo rápida y práctica

Supongamos que se almacenan capturas de pantalla de reseñas de productos en un stage llamado `@reviews_stage`. Quiere clasificar cada reseña como positiva, neutral o negativa y extraer la calificación por estrellas que se muestra en la imagen.

```sql
-- Extract review text, classify sentiment, and pull the star rating
WITH IMGS AS (
  SELECT
    RELATIVE_PATH                              AS FILE_NAME,
    TO_FILE('@REVIEWS_STAGE', RELATIVE_PATH)   AS IMG_FILE
  FROM DIRECTORY(@REVIEWS_STAGE)
),
TEXT AS (
  SELECT
    FILE_NAME,
    -- 1) Extract the visible text from each screenshot
    AI_COMPLETE(
      'claude-3-5-sonnet',
      'Extract the visible product-review text. Respond with raw text only.',
      IMG_FILE
    )::STRING AS REVIEW_TEXT
  FROM IMGS
)
SELECT
  FILE_NAME,
  REVIEW_TEXT,
  -- 2) Classify overall sentiment
  AI_CLASSIFY(
    REVIEW_TEXT,
    ARRAY_CONSTRUCT('positive','neutral','negative')
  )['LABEL']::STRING AS SENTIMENT,
  -- 3) Parse the star rating (1-5) mentioned in the text
  AI_COMPLETE(
    'claude-3-5-sonnet',
    'Return only the star rating (1-5) mentioned in this review.',
    REVIEW_TEXT
  )::STRING AS RATING
FROM TEXT;
```

Los tres pasos se ejecutan dentro de Snowflake sin exportaciones por lotes ni endpoints externos.

## Notas de gobernanza y costos

- **Privilegios:** Otorgue el rol `CORTEX_USER` más el uso del warehouse. El enmascaramiento granular y la seguridad a nivel de fila siguen aplicándose.
- **Créditos:** Cada función consume créditos según los tokens de entrada y el modelo elegido. Conviene crear primero un prototipo con datos limitados y luego dar seguimiento al uso mediante las vistas de consumo de créditos para evitar sorpresas.

## Primeras lecciones del equipo de Viewnear

1. **La barrera de entrada es baja.** Analistas con algo de experiencia en programación construyeron dashboards de sentimiento en una mañana.
2. **La claridad del prompt importa.** Un system prompt claro más un puñado de ejemplos few-shot redujeron las respuestas incorrectas en aproximadamente un 40%.
3. **Los flujos de trabajo híbridos destacan.** Combinar PARSE_DOCUMENT con AI_COMPLETE nos permite procesar contratos en PDF y fotos tomadas desde dispositivos móviles en el mismo pipeline, ideal para clientes de hipotecas y seguros.
4. **El tamaño del warehouse afecta la latencia.** Las llamadas a LLM se ejecutan en un solo hilo, por lo que pasar de un warehouse small a uno medium suele reducir a la mitad el tiempo de respuesta.

## Hacia dónde se dirigía a mediados de 2025

- **Agentes en tiempo real:** Combinar AISQL con Snowpark Container Services para crear copilotos de IA siempre activos que puedan invocar APIs externas cuando sea necesario.
- **Empaquetado y uso compartido más seguros:** A mediados de 2025, el Native App Framework ya admitía restricted-caller rights, lo que hacía más seguro empaquetar y compartir modelos de IA personalizados.
- **Blueprints por industria:** Se esperaban plantillas predefinidas como extracción de facturas, triaje de tickets de soporte y resumen de notas clínicas, a través de partners, incluido Viewnear.

## Reflexiones finales

Cortex AISQL difumina la línea entre el data warehousing y la IA generativa. La pregunta ya no es "¿Dónde alojamos el modelo?" sino "¿Qué problema de negocio abordamos primero?" Si está listo para experimentar, la barrera ahora es una sola consulta SQL.

El equipo de Viewnear integra AISQL en los sprints con clientes. Para ver una demo en vivo adaptada a los datos de la organización, basta con escribirnos. ¡Felices consultas!
