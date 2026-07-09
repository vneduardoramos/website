## Desafío

Un grupo de concesionarios de vehículos comerciales opera una red extensa: concesionarios que venden camiones pesados, talleres de servicio que mantienen las flotas en circulación y operaciones de repuestos que abastecen a ambos. En toda esa red, el mismo cliente, vehículo, repuesto, proveedor y empleado existía de forma diferente en cada sistema. El ERP, el dealer management system y el sistema de nómina y recursos humanos mantenían cada uno su propia versión, con sus propios códigos y sus propias reglas.

- **Sin una versión única confiable.** Un cliente, vehículo, repuesto, proveedor o empleado se veía diferente según el sistema que se consultara.
- **Generar reportes implicaba conciliar a mano.** Antes de que alguien pudiera confiar en una cifra, la misma entidad debía emparejarse y fusionarse manualmente entre los sistemas.
- **La gobernanza era conocimiento tribal.** El emparejamiento, el survivorship y la responsabilidad vivían en la mente de las personas, no en reglas diseñadas.

La eficiencia operativa en ventas, servicio y repuestos dependía de datos en los que el grupo todavía no podía confiar como una sola versión.

## Solución: un golden record corporativo de datos maestros en Snowflake

Viewnear diseñó y construyó una base corporativa de Master Data Management (MDM) en Snowflake, en la propia cuenta del grupo, que produce un golden record progresivo y multifuente en todo el negocio:

- **Arquitectura medallion.** Los datos de origen llegan a Bronze, se limpian y conforman en Silver, y se resuelven en golden records gobernados en Gold, con claves maestras, emparejamiento y fusión, reglas de survivorship, linaje y auditoría diseñados desde la primera tabla.
- **Ocho dominios de negocio.** Posventa y servicio, catálogos de vehículos y repuestos, ventas, compras, inventario, finanzas, contabilidad y recursos humanos, cada uno consolidado en una única definición confiable.
- **Ingesta automatizada.** Openflow carga datos del ERP, el dealer management system y el sistema de nómina y recursos humanos con una programación incremental nocturna.
- **Transformaciones versionadas.** Todo el modelado se ejecuta en dbt bajo Git, de modo que cada regla que construye un golden record se revisa, se prueba y es trazable.
- **Agentes de IA por dominio.** Los agentes de Snowflake CoWork, fundamentados en el golden record gobernado de cada dominio, permiten a los usuarios de negocio consultar los datos maestros en lenguaje natural.

La entrega se ejecuta en tres lanzamientos a lo largo de una hoja de ruta de doce meses, de modo que cada dominio alcanza un golden record confiable de forma secuencial y no todo a la vez.

## Gobernado por diseño

Los datos maestros son la columna vertebral desde la que reporta todo el grupo, por lo que la gobernanza se incorporó desde el diseño, no se añadió al final:

- **Catálogo y responsabilidad.** Horizon Catalog documenta cada dominio, con un responsable designado que rinde cuentas por cada golden record.
- **Acceso de mínimo privilegio.** El RBAC se estructura por entorno, capa y dominio, con SSO y SCIM para que el acceso se corresponda con la identidad propia del grupo.
- **Calidad de datos, diseñada desde el inicio.** Las pruebas de dbt validan el emparejamiento, el survivorship y la conformidad en cada ejecución, de modo que un registro defectuoso se detecta antes de llegar a Gold.
- **Costo predecible.** Los resource monitors mantienen bajo control el cómputo y el gasto en todos los entornos.
- **Los datos permanecen en su lugar.** Todo se ejecuta en la propia cuenta de Snowflake del grupo, por lo que ninguna copia sale de su perímetro.

## Qué obtiene el grupo

- Un único golden record gobernado para cada entidad central: cliente, vehículo, repuesto, proveedor y empleado, cada uno trazable hasta su origen.
- Ocho dominios de negocio consolidados sobre una única base de Snowflake, desde posventa y repuestos hasta finanzas y recursos humanos.
- Reportes que parten de datos maestros confiables, en lugar de conciliar la misma entidad a mano entre los sistemas.
- Una base documentada y gobernada que el propio equipo del grupo puede operar y extender, con datos maestros listos para la analítica y la IA que se construyan sobre ellos.
