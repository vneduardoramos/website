## El reto

Magnolia Doors fabrica puertas, portones, barandales y cristal a medida en hierro y aluminio para casas de alto nivel y constructores en la zona de San Antonio, y sus propias cuadrillas instalan todo lo que fabrica. Llevar una cuadrilla a una casa es el cuello de botella de todo el negocio, y se hacía a mano.

Una solicitud llega de ventas como PDF. Alguien determina entonces si el papeleo está completo, si la unidad y el cristal están físicamente en el taller, quién ya está agendado ese día y dónde, qué plan de viajes requiere el trabajo y qué ventana de llegada prometer. Cinco preguntas, cinco lugares donde buscar, y ninguna pantalla que responda a ninguna de ellas.

La empresa maneja de 30 a 40 eventos de instalación por semana, y 157 en su mes más cargado registrado.

## La línea que trazamos

La solución automatiza todo excepto la reserva.

El asistente valida la solicitud contra la lista de intake y contra Odoo, comprueba viaje por viaje que el material está en el taller, lee el calendario en vivo para ocupación y ausencias, determina el plan de viajes, la ventana de llegada, la cuadrilla y la prioridad, agrupa los trabajos geográficamente y redacta el evento tal como su calendario espera recibirlo. Después se detiene y muestra su trabajo. Una persona aprueba, y solo entonces cambia algo en el ERP.

Esa línea no es una nota de política añadida al final. Es la arquitectura. Cuatro de las cinco etapas no tienen herramienta de escritura alguna, así que no podrían agendar un trabajo aunque se les indicara. La quinta escribe, y sus barreras son estructurales: allowlists cargadas al arranque, un token de aprobación firmado y atado a la operación exacta, a los ids y a los valores, y una confirmación que se vuelve a pedir en el momento de ejecutar. Una instrucción en un prompt se puede rodear. Ninguna de esas tres.

## La compuerta de escritura

Cada escritura al calendario pasa por dos fases y tres barreras que no dependen entre sí. Quitar cualquiera deja las otras dos en pie.

![Proponer y luego ejecutar. El asistente llama a la herramienta sin token de aprobación. La barrera uno es la allowlist, verificada en memoria antes de cualquier llamada de red. El conector vuelve a leer los registros de Odoo y devuelve una propuesta con un token firmado que expira en 15 minutos. Una persona aprueba. La barrera dos verifica firma, expiración, operación, modelo, ids y valores. La barrera tres pide confirmación al ejecutar. Si falla cualquier barrera, no se escribe nada.](/assets/images/cases/magnolia-doors-write-gate.es.svg)

1. **Gobierno**, verificado en memoria antes de cualquier llamada de red. Modelo no listado, campo no listado o archivo ausente significa denegado. Todo lo que no esté permitido explícitamente se rechaza, así que una configuración faltante falla cerrada y no abierta. Esta barrera nunca llega a la red, así que nada del lado de Odoo puede vencerla.
2. **La propuesta y su token.** El conector vuelve a leer los registros y devuelve qué cambiaría, campo por campo, valor actual contra valor nuevo. El token de aprobación va firmado y atado a la operación, el modelo, los ids y un hash de los valores, y expira en 15 minutos. Una aprobación emitida para crear no se puede gastar en modificar, y una emitida para el registro siete no se puede gastar en el ocho.
3. **Confirmación en el momento de ejecutar.** La pregunta se repite justo antes de escribir. Si no vuelve aceptada, no pasa nada.

Modificar y eliminar operan solo por ids explícitos, nunca por criterios de búsqueda, porque una sola operación filtrada podría alcanzar cientos de registros desde una propuesta que parecía pequeña. Una serie recurrente se rechaza en lugar de adivinarse, porque en esta instancia no está verificado a qué ocurrencia alcanzaría una escritura.

## Tres capas, con un contrato estrecho entre ellas

- **El conector** es lo único que toca Odoo: seis herramientas, el motor de gobierno y la compuerta de aprobación en dos fases. Es agnóstico al cliente y a la instancia, así que nada de Magnolia está escrito en su código.
- **Las skills** llevan el conocimiento operativo de Magnolia: la lista de intake, las pruebas de disponibilidad, las reglas de viajes, las ventanas de llegada, el roster de cuadrillas, la convención de títulos y las tablas de códigos postales. Sin credenciales, sin acceso propio a Odoo, sin herramienta de escritura.
- **El cliente** es donde está la persona, en Claude de escritorio o en la web, con las mismas herramientas y el mismo gobierno en ambos casos.

El conector no expone ninguna herramienta genérica de llamada a métodos. No puede confirmar una cotización ni registrar una factura, y todo lo que crea queda en borrador para que una persona lo termine dentro de Odoo. Del lado del calendario el alcance es aún más estrecho: crear, modificar y eliminar apuntan a un solo modelo, `calendar.event`, y a ocho campos. Nada más en la instancia puede ser modificado por este sistema.

## Cómo era la instancia en realidad

Magnolia opera Odoo 18 Enterprise, on-premise y muy personalizado, así que la solución descubre la instancia en tiempo de ejecución en lugar de suponer su forma. Medimos la instancia en vivo antes de diseñar nada, y casi todo lo que una persona razonable supondría de un calendario de agendamiento resultó falso aquí. Cada suposición falsa tenía un costo concreto.

- **El evento no lleva la dirección.** El campo de ubicación está vacío en los últimos 500 eventos, y ninguna dirección tiene coordenadas. La geografía requiere tres saltos a través del pedido.
- **La hora almacenada no es la hora de llegada.** La ventana vive en el texto del título, y de 166 títulos que la llevan, solo 11 coincidían con la hora almacenada. La detección de choques por hora contra sus datos no significa nada, así que la ocupación se revisa por día.
- **Un pedido no se encuentra buscando prefijo más dígitos.** 256 de 3,380 eventos llevan más de un pedido y solo el primero lleva el prefijo. Ese patrón perdía 132 de 954 números de pedido, uno de cada siete trabajos.
- **Un evento cancelado no se archiva.** El trabajo cancelado se marca en el título, así que un filtro de archivo lee como vivos los trabajos descartados.
- **Las ausencias no viven en ningún registro de RR. HH.** Existen solo como eventos de día completo, lo que convierte al calendario en la única fuente de disponibilidad.

Nada de eso salió de preguntar. Todo salió de leer la instancia, y la distinción vale la pena: una junta de arranque da el proceso como fue diseñado, los datos dan el proceso como funciona.

Un hallazgo mató una funcionalidad, y con razón. La promesa obvia es ofrecer sacar a la luz los trabajos que se cayeron entre las grietas, así que los buscamos dos veces: una por pedidos con material listo y sin evento, otra por primeras visitas hechas con el cristal puesto y sin retorno agendado. Ambas búsquedas volvieron vacías. No están atrasados. Eso sustituyó la promesa por velocidad y consolidación, que es la oferta honesta.

## Resultados

El agendamiento por lotes es donde se multiplica. Un ensayo interno, antes de que el cliente lo viera, tomó **21 minutos y 20 pasos separados** para agendar varios trabajos, y el segundo evento salió duplicado del primero. No fue una falla del conector; el conector hizo exactamente lo que se le pidió, dos veces. Hoy hasta **20 eventos viajan en una sola propuesta bajo una sola aprobación, creados de forma atómica**, así que son todos o ninguno. Un día completo se aprueba en cerca de un minuto y una semana cabe en dos o tres propuestas. El problema de duplicados desapareció por diseño y no por cuidado.

Medido contra producción:

- **28.5 millas menos** en una semana real por ordenar bien el día. En un recorrido por Hill Country, evaluar todos los órdenes posibles incluyendo el regreso al taller dio 137.3 millas contra 153.4 de la ruta voraz: 16 millas en un solo día, solo por secuenciar.
- **8 de 8** casos de disponibilidad de material coincidieron con el libro de producción.
- **6 de 344** direcciones de entrega llevan un código postal que contradice a su propia ciudad por más de 25 millas. Ese dato está equivocado con confianza, que es peor que faltante.
- **343 pruebas pasando**, con Odoo simulado, así que la suite corre sin instancia en vivo.
- **Cero** registros escritos en el ERP sin aprobación humana explícita.

La regla de lectura de títulos evita algo que ya ocurrió durante el desarrollo: un número de calle leído como número de pedido metió en el día un trabajo a 175 millas de la ruta. Los números de pedido en los títulos son texto libre escrito por una persona con prisa, y 440 van pegados contra 139 separados, así que el patrón obvio pierde en silencio tres cuartas partes.

### Qué es estimado, y qué significa

Los minutos por evento son una estimación. El agendamiento a mano se sitúa entre 23 y 35 minutos, y en cerca de 3 minutos con el conector, de donde sale la cifra semanal de 15 a 19 horas. Esos minutos se construyeron enumerando el trabajo que los datos prueban que hay que hacer, no cronometrando a una persona haciéndolo, así que son una estimación razonada y no una medición, y no se van a presentar como tal.

Convertir eso en dato duro es barato: cronometrar 10 trabajos antes y 10 después, desde que llega la solicitud hasta que el evento queda en el calendario. Entonces el número será de Magnolia y no de nuestra suposición.

## Lo que no está construido

La solución está en producción contra la instancia en vivo, y tres cosas están deliberadamente incompletas.

- **El intake sigue siendo manual.** La skill acepta un buzón como origen, pero el buzón no está conectado, así que alguien todavía traslada el PDF a mano.
- **La asignación de cuadrilla es parcial.** El roster se puede leer y la disponibilidad se verifica, pero quién está calificado para qué no existe en ningún sistema.
- **La regla de 45 minutos de traslado se responde solo donde hay datos reales de ruteo para el par de códigos postales.** En el resto el tiempo se reporta como no confirmado y nunca se estima a partir de la distancia. En Hill Country ambas cosas divergen de verdad: códigos postales a doce millas en el mapa pueden estar a cincuenta minutos por carretera.

De las doce restricciones que el dueño calificó como la parte más importante del agendamiento, tres están cubiertas por datos que existen en algún lado y siete no existen en ningún sistema. Esas viven en un PDF y en la cabeza de una persona, y automatizarlas exige capturarlas en algún lado primero, que es un cambio de negocio antes que de software.

## Impacto de negocio

Lo que entrega una corrida son propuestas, no reservas. Lo que falta, falta: un conteo de viajes, una dirección, un dato de acceso, un tiempo de traslado o la disponibilidad de una cuadrilla nunca se inventan, y un trabajo cuyos datos no están se bloquea y se nombra en lugar de agendarse en silencio. Cero filas no es cero trabajo, porque "ningún evento coincide con el filtro" y "no pude leer" son afirmaciones distintas y nunca se juntan.

Eso es lo que hace confiable al resto frente a un ERP en vivo, y es lo que hace seguro extender el mismo patrón al siguiente proceso.
