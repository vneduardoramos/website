## Desafío

Un grupo de universidades que atiende a más de 20,000 estudiantes en Miami y América Latina no podía ver al estudiante en tiempo real. Los registros académicos residían en su entorno Anthology / Blackboard, mientras que los eventos de actividad de aprendizaje (Caliper) salían del LMS según su propia programación, y ambos nunca se unían en un único lugar gobernado. En muchos campus, eso significaba:

- **Sin una vista única y actual del estudiante.** Los datos académicos y de actividad de aprendizaje residían en sistemas separados, con ciclos de actualización distintos.
- **Por lotes, no en tiempo real.** Los eventos de aprendizaje no se transmitían en streaming, por lo que las preguntas sobre la participación no podían responderse a medida que ocurrían.
- **Difícil de gobernar a escala.** Implementar esto de forma consistente en un grupo con múltiples campus requería control de acceso, políticas y linaje diseñados desde el inicio, no añadidos después.

## Solución: un pipeline de datos de estudiantes en tiempo real sobre Snowflake

Viewnear construyó un pipeline de datos de estudiantes gobernado y en tiempo real sobre Snowflake, en la propia cuenta del grupo:

- **Entorno de Snowflake gobernado.** Warehouses, roles, RBAC, políticas de red y monitores de recursos implementados desde el primer día, con un modelo de gobernanza claro.
- **Integración nativa con Blackboard.** Una conexión directa a Anthology Illuminate Developer (antes Blackboard Data) deposita los datos académicos en una capa RAW, con discovery de esquema y validación de actualización, volumen y uso.
- **Eventos Caliper en tiempo real.** Los eventos de actividad de aprendizaje se transmiten en streaming desde el LMS a través de Azure Event Hub hacia Snowflake RAW, validados de extremo a extremo desde el LMS hasta Snowflake.
- **Modelo analítico del estudiante.** Un modelo analítico del estudiante, documentado y alineado con Blackboard, sobre las capas RAW.
- **Documentación y transferencia de conocimiento.** Documentación técnica y funcional, además de sesiones de transferencia de conocimiento, para que el propio equipo del grupo pueda operarlo y extenderlo.

La entrega se ejecutó en sprints ágiles de dos semanas, con un backlog compartido, demos y un comité conjunto técnico y de negocio.

## Gobernado por diseño

Los datos de los estudiantes son sensibles y están distribuidos en muchos campus, por lo que la gobernanza se diseñó desde la primera tabla:

- **Acceso con privilegios mínimos.** Los roles, RBAC y las políticas de red definen quién puede acceder a qué, por campus y por función.
- **Consumo controlado.** Los monitores de recursos mantienen el cómputo y el costo predecibles en todo el grupo.
- **Trazable por diseño.** Una estructura gobernada de RAW a analítica mantiene un linaje claro hacia cada sistema de origen, de modo que todo número puede rastrearse hasta su origen.
- **Los datos permanecen en su lugar.** Todo se ejecuta en la propia cuenta de Snowflake del grupo; ninguna copia sale de su perímetro.

## Lo que entregamos

- Una **base gobernada en Snowflake**, configurada con RBAC, políticas de red y monitores de recursos.
- **Datos académicos** desde Anthology Illuminate Developer fluyendo hacia una capa RAW estable.
- **Eventos de aprendizaje Caliper en tiempo real** transmitidos en streaming de extremo a extremo desde el LMS hacia Snowflake.
- Un **modelo analítico del estudiante documentado**, además de transferencia de conocimiento para que el equipo del grupo pueda operarlo y extenderlo.
- Una vista única, gobernada y en tiempo real del estudiante, lista para analítica e IA encima.
