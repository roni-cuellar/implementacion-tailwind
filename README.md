# BEESOCC 2.0 · Frontend

React, JavaScript, JSX, React Router DOM, Axios, Zustand y CSS. El backend existente usa Laravel y la base MySQL principal beesocc_v2.

## Mejora visual actual

- Botones sin flechas decorativas, con tamaño coherente, bordes suaves y contraste alto.
- Landing con mejor proporción del hero, ilustración integrada y CTA más claros.
- Login y Registro centrados en un panel, sin Navbar ni Footer.
- Mis Ligas con encabezado destacado, conteo real de campeonatos y grid responsive.
- Tarjetas con imagen superior, temporada, estado legible, descripción y botón Administrar.
- Cuando existe una sola liga, su tarjeta aprovecha el ancho como tarjeta destacada, manteniendo la imagen arriba.
- Menú contextual más discreto, con acciones Editar y Eliminar; puede cerrarse con Escape o al perder el foco.
- Estado vacío con ilustración y botón Crear liga.
- Alertas integradas al diseño; el éxito de Mis Ligas puede descartarse con Cerrar aviso.
- Iconos SVG consistentes en la navegación y los controles.
- Dashboard y Sidebar con espaciado, tipografía y botones coherentes con el resto de la aplicación.

No se agregaron dependencias ni se cambiaron las rutas o la lógica de las entidades.

## Archivos de este ajuste

**Nuevo:**

- src/components/Icono.jsx: iconos SVG sencillos, sin librerías externas.

**Modificados:**

- src/pages/MisLigasPage.jsx: encabezado, conteo, distribución, acción del estado vacío y cierre del aviso.
- src/components/LigaCard.jsx: tarjeta, estado Planificación, contenido y menú contextual.
- src/components/AccesoLayout.jsx: panel centrado de acceso.
- src/components/Aviso.jsx y EstadoVista.jsx: presentación compartida de mensajes y acción opcional del vacío.
- src/components/Navbar.jsx, Sidebar.jsx y HeaderDashboard.jsx: botones y navegación sin glifos decorativos.
- src/components/AplicacionLayout.jsx y Footer.jsx: enlaces simplificados.
- src/components/EquipoCard.jsx y Modal.jsx: controles con iconos consistentes.
- src/components/PartidoCard.jsx: enlace limpio al detalle.
- src/components/ConfiguracionForm.jsx: orden de desempate expresado sin flechas.
- src/pages/InicioPage.jsx: CTA.
- src/pages/DashboardPage.jsx: accesos y enlaces.
- src/pages/CrearLigaPage.jsx y PartidoDetallePage.jsx: enlaces de regreso.
- src/pages/CalendarioPage.jsx: icono del desplegable.
- src/styles/global.css: botones y tipografía compartidos.
- src/styles/inicio.css: hero, secciones e ilustraciones.
- src/styles/aplicacion.css: tarjetas, acceso, alertas, dashboard y responsive.
- README.md: esta documentación.

LoginPage.jsx y RegistroPage.jsx conservan su lógica; su nueva apariencia proviene del layout y los estilos. No se modificaron servicios Axios, stores Zustand, AppRoutes.jsx, backend, modelos, migraciones, configuraciones de conexión ni imágenes oficiales.

## Acceso: limitación técnica

La autenticación todavía no está implementada. Login y Registro navegan a Mis Ligas al enviar sus formularios.

No comprueban contraseñas ni existencia de cuentas. Los campos solo viven en useState mientras el formulario está montado y se limpian antes de navegar. No se envían al backend, no se crean usuarios, no se almacenan credenciales ni se usan tokens, cookies de autenticación o sesiones.

Las rutas no están protegidas. Salir navega al inicio. Utilizar únicamente en un entorno local o privado y no introducir contraseñas reales.

Esta limitación se documenta aquí, sin mensajes de demostración dentro de la interfaz.

## Layouts y rutas

- Pública: Inicio con Navbar y Footer.
- Acceso: /login y /registro, sin navegación pública.
- Aplicación: /mis-ligas, /ligas/nueva y /ligas/:ligaId/editar.
- Campeonato: DashboardLayout con Sidebar y Header propios.

Módulos por campeonato:

~~~text
/ligas/:ligaId/dashboard
/ligas/:ligaId/equipos
/ligas/:ligaId/jugadores
/ligas/:ligaId/partidos
/ligas/:ligaId/partidos/:partidoId
/ligas/:ligaId/calendario
/ligas/:ligaId/tabla
/ligas/:ligaId/estadisticas
~~~

/ligas/:ligaId redirige al dashboard. Se mantienen las páginas de error y los mensajes de registros inexistentes.

## Integración y datos

api.js centraliza la conexión. Se conservan los servicios ligaService, equipoService, jugadorService y partidoService, junto con useLigaStore, useEquipoStore y usePartidoStore.

Las entidades se consultan y guardan con las API reales. No se usan arreglos ficticios ni localStorage como sustitutos de MySQL.

Se mantienen campeonatos, equipos, jugadores, inscripciones, plantillas, partidos, calendario, eventos, marcadores, posiciones, configuración y estadísticas.

Las reglas de negocio siguen en Laravel. No se modificaron retiros, historial, transiciones de estado ni validaciones deportivas. Los periodos se almacenan como referencia; su aplicación automática continúa pendiente en el backend.

### Entorno local

Valores predeterminados y .env.example:

~~~dotenv
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
~~~

Vite redirige /api y /storage a Laravel. La conexión principal continúa usando MySQL y beesocc_v2. No se creó otra base de datos ni se modificó CORS.

Desde la raíz, en una terminal:

~~~powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
~~~

En otra terminal, desde la raíz:

~~~powershell
cd frontend
npm run dev
~~~

Abre la dirección indicada por Vite.

## Verificaciones de este ajuste

~~~powershell
npm run lint
npm test
npm run build
~~~

- Build de producción correcto.
- Oxlint sin advertencias ni errores.
- 46 pruebas de contratos de servicios aprobadas.
- 13 consultas GET reales con Axios aprobadas: catálogos, inscripciones, partidos, configuración, posiciones y seis estadísticas.
- Durante la revisión había un campeonato, un equipo general y un jugador general en la base principal.
- Se revisó la tarjeta del campeonato existente y el menú contextual.
- Se abrió Editar y se regresó sin guardar.
- Se comprobó la navegación hacia el dashboard real.
- Se recorrieron 12 rutas principales a 320 píxeles, sin desbordamientos horizontales ni textos de demostración o flechas decorativas.
- Registro y Mis Ligas también se revisaron a 390 píxeles.
- Login y Registro se comprobaron sin Navbar ni Footer.
- La consola no mostró errores de React en los recorridos revisados.
- El estado vacío y la alerta de éxito se revisaron en una vista aislada de componentes, sin introducir registros en MySQL.

La alerta de esa vista aislada no representa una creación efectuada en la base principal. Se usó únicamente para comprobar su apariencia. La vista de revisión no forma parte de las rutas de la aplicación.

No se realizaron altas, actualizaciones ni eliminaciones durante esta mejora visual. Las pruebas de contrato no sustituyen un nuevo recorrido completo de escritura contra MySQL; ese recorrido y la comprobación en dispositivos físicos quedan pendientes.

Los originales de branding se conservan. No se publicó el proyecto ni se subió a GitHub.
