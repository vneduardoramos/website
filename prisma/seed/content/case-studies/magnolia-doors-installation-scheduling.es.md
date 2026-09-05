## Lo que costaba agendar a mano

Magnolia Doors fabrica puertas, portones, barandales y cristal a medida en hierro y aluminio para casas de alto nivel y constructores en la zona de San Antonio, y sus propias cuadrillas instalan todo lo que fabrica. Llevar una cuadrilla a una casa es el cuello de botella de todo el negocio.

Una solicitud llegaba de ventas como PDF. Alguien determinaba entonces si el papeleo estaba completo, si la unidad y el cristal estaban físicamente en el taller, quién ya estaba agendado ese día y dónde, qué plan de viajes requería el trabajo y qué ventana de llegada prometer. Cinco preguntas, cinco lugares donde buscar, y ninguna pantalla que respondiera a ninguna de ellas.

Con 30 a 40 instalaciones por semana, y 157 en el mes más cargado registrado, eso sumaba de 13 a 17 horas semanales dedicadas a poner trabajos en un calendario. Entre un tercio y la mitad de una posición de tiempo completo, dedicada solo a reunir información que ya existía en algún lugar del negocio.

Los errores costaban más que las horas. Códigos postales contradictorios, direcciones incorrectas y datos leídos del título equivocado cambian a dónde se envía una cuadrilla. Durante el trabajo, un título mal interpretado habría puesto una instalación a 175 millas de la ruta.

## Qué cambió

**Agendar una instalación ahora toma unos tres minutos**, frente a 23 a 35 a mano. La carga semanal baja de 13 a 17 horas a alrededor de una y media a dos.

**Regresan de 15 a 19 horas administrativas cada semana**, cerca de 3 a 4 horas por día hábil, sin sumar una persona.

**Un día completo de instalaciones se aprueba en cerca de un minuto.** Hasta 20 trabajos viajan en una sola propuesta y se crean juntos, donde antes cada uno pasaba por su propia secuencia de revisiones. Un ensayo interno del método trabajo por trabajo tomó 21 minutos y 20 pasos separados, y produjo una reserva duplicada en el camino. Una semana entera cabe ahora en dos o tres propuestas.

**28.5 millas menos en una semana medida**, por ordenar bien cada día. En un recorrido por Hill Country entre Fredericksburg, Bandera, Boerne y Kerrville, secuenciar las paradas y el regreso dio 137.3 millas frente a 153.4 de la ruta obvia de lo más cercano primero: 16 millas en un solo día.

**Los datos malos se detectan antes de despachar una cuadrilla.** Las verificaciones marcan 6 de 344 direcciones de entrega cuyo código postal contradice a su propia ciudad por más de 25 millas, algo peor que una dirección faltante porque está equivocada con confianza. La disponibilidad de material coincidió con el libro de producción en 8 de 8 casos probados.

**Nada llega al ERP sin que una persona lo apruebe.** Cada reserva se propone, se revisa y la confirma el coordinador, así que la velocidad nunca se pagó con el control.

## Cómo lo hace Claude

Claude recorre cinco etapas por cada solicitud, y el conocimiento operativo de Magnolia vive en cinco skills de Claude que todo el equipo alcanza desde su propia organización de Claude, sin instalar nada en ninguna máquina.

1. **Validar la solicitud.** Claude revisa el papeleo contra la lista de intake y confirma cada pedido en Odoo, el sistema de registro, donde la hoja de solicitud es solo una afirmación que alguien escribió.
2. **Comprobar que el material está en el taller.** Viaje por viaje, contra el libro de producción y las compras en Odoo, nunca contra una fecha estimada de llegada.
3. **Planear el día.** Una sola lectura del calendario cubre quién está agendado, quién está ausente, qué está cancelado y si el trabajo ya tiene evento. Claude determina entonces el plan de viajes, la ventana de llegada, la cuadrilla y la prioridad, y agrupa los trabajos geográficamente.
4. **Proponer y esperar.** El coordinador ve las entradas de calendario propuestas y las aprueba. Solo entonces cambian los registros en Odoo.
5. **Reportar el miércoles.** Un resumen operativo de cinco puntos en español, a partir de la guía de Magnolia, que confirma lo que realmente se visitó contra las horas de cuadrilla en timesheets, en lugar de suponer que una entrada de calendario significa trabajo hecho.

Las reglas deterministas resuelven todo lo que debe ser exacto: campos obligatorios, disponibilidad de material, número de viajes por producto y tipo de trabajo, ventanas de llegada por tipo de cliente. Claude resuelve el criterio que esas reglas no alcanzan:

- **Leer el alcance escrito en vez de las casillas**, porque el formato suele traer varias casillas marcadas a la vez y la prosa es la mitad confiable. Diez tipos de trabajo se leen así.
- **Explicar los pendientes en términos claros**, para que un trabajo a la espera de algo llegue con su motivo y su responsable en lugar de desaparecer del plan, y la prioridad siempre traiga la razón detrás.
- **Mostrar su razonamiento**, para que la elección de cuadrilla declare de qué se infirió y el coordinador pueda ponderarla.
- **Reconciliar registros que no coinciden**, donde el mismo constructor aparece escrito de tres formas distintas entre el libro de producción, la solicitud y Odoo.

Y la decisión que queda con una persona por diseño: marcar un trabajo como confirmado es una afirmación sobre una conversación con un cliente, así que le corresponde a quien tuvo esa conversación.

## Por qué el proceso anterior era tan lento

Magnolia opera Odoo 18 Enterprise, on-premise y muy personalizado. Leer la instancia en vivo antes de diseñar nada explicó a dónde se iban los 23 a 35 minutos, porque casi nada del calendario estaba donde uno esperaría.

- **El evento no lleva la dirección.** El campo de ubicación está vacío en los últimos 500 eventos, así que saber dónde es un trabajo requiere tres saltos a través del pedido.
- **La hora almacenada no es la hora de llegada.** La ventana vive en el texto del título, y de 166 títulos que la llevan, solo 11 coincidían con la hora almacenada.
- **Un pedido no se encuentra buscando prefijo más dígitos.** 256 de 3,380 eventos llevan más de un pedido, y el patrón de búsqueda obvio perdía 132 de 954 números de pedido: uno de cada siete trabajos.
- **Las ausencias existen solo como eventos de día completo**, así que el calendario es la única fuente de disponibilidad.

Nada de eso salió de preguntar. Salió de leer la instancia, y es la razón de que las mismas cinco preguntas costaran media hora cada vez.

Una verificación se corrió dos veces y volvió vacía las dos: no había pedidos con material listo y sin evento, ni primeras visitas hechas con el cristal puesto y sin retorno agendado. Magnolia no está atrasada, así que las ganancias aquí son velocidad y consolidación, no rezago recuperado.

## Cómo funciona la aprobación

La velocidad solo cuenta si el coordinador mantiene el control del calendario, así que cada escritura se propone primero y se ejecuta después.

![Proponer y luego ejecutar. Claude llama a la herramienta, la allowlist se verifica antes de que algo salga del proceso, y el conector vuelve a leer los registros de Odoo y devuelve una propuesta con un token firmado que expira en 15 minutos. El coordinador revisa y aprueba. El token se verifica contra la operación, el modelo, los ids y los valores para los que se emitió, y se pide confirmación otra vez al ejecutar. La escritura llega a Odoo una vez que una persona la aprobó, y solo entonces.](/assets/images/cases/magnolia-doors-write-gate.es.svg)

La propuesta muestra cada campo como está frente a lo que sería, así que un cambio se revisa por sus méritos y no se aprueba a ciegas. Cuatro de las cinco etapas son de solo lectura por construcción, así que planear se queda en planear. El conector alcanza un modelo y ocho campos del calendario y nada más en la instancia, y viene con 343 pruebas pasando.

## Qué está medido y qué está estimado

Medido contra producción: el volumen de eventos, los pasos que el proceso anterior obligaba a recorrer, los 21 minutos y el duplicado del ensayo por lotes, las 28.5 millas, los 8 de 8 en disponibilidad de material y los 6 códigos postales malos.

Los minutos por evento son una estimación razonada. Se construyeron enumerando el trabajo que los datos prueban que hay que hacer, no cronometrando a una persona haciéndolo, y de ahí salen los 23 a 35 minutos y las 15 a 19 horas semanales. Convertirlo en dato duro es barato y vale la pena: cronometrar 10 trabajos antes y 10 después, desde que llega la solicitud hasta que el evento queda en el calendario, y el número pasa a ser de Magnolia.

## Lo que todavía no está construido

Tres cosas están deliberadamente incompletas, y cada una es el siguiente incremento más que una limitación que defender.

- **El intake sigue siendo manual.** El buzón no está conectado, así que alguien traslada el PDF a mano. Conectarlo es el siguiente paso obvio.
- **La asignación de cuadrilla es parcial.** La disponibilidad se verifica, pero quién está calificado para qué todavía no existe en ningún sistema.
- **Los tiempos de traslado se responden donde hay datos reales de ruteo para el par de códigos postales**, y se reportan como no confirmados en el resto, en lugar de estimarse por distancia. En Hill Country ambas cosas divergen de verdad: códigos postales a doce millas pueden estar a cincuenta minutos por carretera.

De las doce restricciones que el dueño calificó como la parte más importante del agendamiento, tres están cubiertas por datos que existen en algún lado y siete no existen en ningún sistema. Capturarlas es un cambio de negocio antes que de software, y es de donde sale el siguiente tramo de tiempo.

## Impacto de negocio

Magnolia Doors convirtió hasta 17 horas semanales de agendamiento en un flujo que resuelve cada instalación en unos tres minutos, y recuperó el equivalente a entre un tercio y la mitad de una posición sin contratar. El equipo sigue trabajando dentro de Odoo en lugar de mantener un segundo sistema de agendamiento.

El valor no son solo las horas. Los trabajos llegan ahora al calendario con su material comprobado, su dirección resuelta, su día secuenciado y sus excepciones nombradas, y el coordinador aprueba cada uno. Esa combinación es lo que hace que valga la pena extender el mismo patrón al siguiente proceso.
