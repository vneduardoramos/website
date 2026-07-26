## La decisión es de horarios, no solo de tarifas

Cuando una empresa en Estados Unidos compara nearshore contra offshore para un build de Snowflake, la conversación suele arrancar con las tarifas por hora. Debería arrancar con los relojes. La tarifa es el número más fácil de comparar y el que menos predice lo que el proyecto de verdad le va a costar.

Nosotros entregamos nearshore, así que aquí tenemos una postura. Pero la versión honesta es que ambos modelos pueden funcionar, y el correcto depende del tipo de trabajo que esté haciendo. El trabajo de Data + AI sobre Snowflake resulta ser justo del tipo donde el traslape de zona horaria importa más. Así lo pensamos.

## Las definiciones claras

- **Offshore** significa que el equipo de entrega está a muchas zonas horarias de distancia (comúnmente el sur de Asia o Europa del Este respecto a Estados Unidos), a menudo ocho a doce horas de diferencia. La tarifa más baja de entrada, el menor traslape con la jornada local.
- **Nearshore** significa que el equipo está en la misma zona horaria o cerca (para empresas en Estados Unidos, normalmente América Latina). Una tarifa de entrada algo más alta, un traslape casi total con la jornada local.

La palabra que importa es *traslape*. En silencio decide qué tan rápido avanza el trabajo.

## Las dimensiones que de verdad importan

Nearshore y offshore intercambian las mismas dos variables: la tarifa de entrada contra el traslape con la jornada de Estados Unidos.

| Dimensión | Nearshore | Offshore |
| --- | --- | --- |
| Distancia y traslape | En la misma zona horaria o cerca (para empresas en Estados Unidos, normalmente América Latina); traslape casi total con la jornada local | A muchas zonas horarias de distancia (comúnmente el sur de Asia o Europa del Este respecto a Estados Unidos), a menudo ocho a doce horas de diferencia; el menor traslape |
| Tarifa de entrada | Algo más alta | La más baja |
| Ciclo de iteración | Un bloqueo planteado a las 10am muchas veces se resuelve para la comida | El mismo bloqueo suele costar un día completo por ida y vuelta |
| Ritmo de trabajo | Pairing en vivo, standups reales y un ritmo compartido en Slack; la cercanía cultural y de idioma reduce los pequeños malentendidos que se acumulan en un proyecto largo | Tareas que se entregan al cierre de la jornada local y se retoman al inicio de la jornada del equipo offshore |
| Residencia de datos y revisión de accesos | Un equipo en América puede simplificar esas conversaciones para empresas de Estados Unidos | También puede simplificarlas; conviene confirmarlo en lugar de suponerlo |
| Dónde gana el costo total | Trabajo ambiguo y con muchas decisiones, como la mayoría de los builds de Snowflake e IA: la latencia causa retrabajo y el retrabajo borra la ventaja de la tarifa | Trabajo bien acotado y bien especificado: mantenimiento maduro y documentado o un build grande y claramente especificado |

**Velocidad e iteración.** El trabajo de Snowflake e IA es iterativo: perfilar los datos, modelarlos, probar un caso de uso de Cortex, ver el resultado, ajustar. Ese ciclo es rápido cuando una pregunta se responde en minutos y doloroso cuando espera toda la noche. Con un [equipo nearshore](/es/nearshore) trabajando en horario de Estados Unidos, un bloqueo planteado a las 10am muchas veces se resuelve para la comida. Offshore, el mismo bloqueo suele costar un día completo por ida y vuelta, y un puñado de idas y vueltas convierte una tarea de dos semanas en un mes.

**Costo total frente a tarifa.** Una tarifa por hora más baja no siempre significa un costo de proyecto más bajo. La latencia causa retrabajo, el retrabajo causa horas, y las horas borran la ventaja de la tarifa. La comparación correcta es costo por resultado, no costo por hora. En trabajo bien acotado y bien especificado, la tarifa puede ganar; en trabajo ambiguo y con muchas decisiones, el traslape suele ganar.

**Comunicación y contexto compartido.** El pairing en vivo, los standups reales y un ritmo compartido en Slack construyen el contexto que hace efectivo a un equipo. La cercanía cultural y de idioma reduce los pequeños malentendidos que se acumulan a lo largo de un proyecto largo. Esto no es sobre talento (hay talento excelente en todas partes); es sobre cuánta fricción hay entre una pregunta y una buena respuesta.

**Responsabilidad y retención.** Vale la pena preguntar quién es dueño del resultado y qué tan estable es el equipo. La rotación alta significa volver a explicar el negocio cada pocos meses sin importar la ubicación, pero el costo de esa reexplicación es mayor cuando el traslape para hacerla es escaso.

**Seguridad, compliance y residencia de datos.** Para datos regulados, dónde se sienta el equipo y cómo se accede a los datos puede tener peso real de compliance. Nearshore en América puede simplificar las conversaciones de residencia de datos y de revisión de accesos para empresas de Estados Unidos; offshore también puede, pero conviene confirmarlo en lugar de suponerlo.

## Cuándo offshore es la decisión correcta

Siendo honestos: offshore es una opción fuerte cuando el trabajo está bien definido y es estable, cuando el scope no va a moverse mucho y cuando las tareas se pueden entregar limpiamente al final de su día y retomarse al inicio del de ellos. Un workload de mantenimiento maduro y documentado, o un build grande y claramente especificado, puede correr de forma muy rentable offshore. Si su trabajo se ve así, la ventaja de tarifa es real y vale la pena tomarla.

## Por qué el trabajo de Snowflake se inclina a nearshore

La mayor parte del trabajo de Snowflake e IA que vemos es lo opuesto a bien definido y estable. Es intensivo en discovery: los requisitos se afinan a medida que mira los datos, el mejor caso de uso se revela a media marcha y las decisiones necesitan un sponsor en la sala, no en el correo de mañana. Ese trabajo premia el traslape. Por eso, para empresas de Estados Unidos que construyen sobre Snowflake, pensamos que nearshore suele ser el mejor punto de partida, no porque la gente sea mejor, sino porque el reloj está de su lado.

## Cómo decidir en cada caso

El proyecto se califica en dos ejes:

- **¿Qué tan estable es el scope?** Cerrado y documentado se inclina a offshore. Cambiante e intensivo en discovery se inclina a nearshore.
- **¿Qué tan densa en decisiones es la obra?** Mayormente ejecución se inclina a offshore. Muchos juicios y participación de sponsors se inclina a nearshore.

Si cae en el cuadrante de "cambiante y denso en decisiones", donde caen la mayoría de los builds de Snowflake e IA, priorice el traslape sobre la tarifa. Si cae en "estable e intensivo en ejecución", la ventaja de tarifa offshore es real.

Cualquiera sea la elección, conviene ver más allá del tarifario: costo por resultado, estabilidad del equipo y quién queda como responsable después del go-live. Para ver cómo funciona un modelo nearshore en la práctica, nuestra [página nearshore](/es/nearshore) detalla el modelo de entrega, y nuestras credenciales de [alianza](/es/partnership) muestran la profundidad en Snowflake que lo respalda.
