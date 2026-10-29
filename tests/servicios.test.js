import test from 'node:test'
import assert from 'node:assert/strict'
import api, { mensajeError, urlImagen } from '../src/services/api.js'
import liga from '../src/services/ligaService.js'
import equipo from '../src/services/equipoService.js'
import jugador from '../src/services/jugadorService.js'
import partido from '../src/services/partidoService.js'

// El adaptador comprueba contratos HTTP sin conectarse ni escribir en una base.
const datos = { nombre: 'Solo prueba de contrato' }
const casos = [
  ['listar ligas', () => liga.listar(), 'get', '/campeonatos'],
  ['consultar liga', () => liga.obtener(8), 'get', '/campeonatos/8'],
  ['crear liga', () => liga.crear(datos), 'post', '/campeonatos', 'campeonato', datos],
  ['editar liga', () => liga.actualizar(8, datos), 'patch', '/campeonatos/8', 'campeonato', datos],
  ['eliminar liga', () => liga.eliminar(8), 'delete', '/campeonatos/8'],
  ['tabla', () => liga.tabla(8), 'get', '/campeonatos/8/tabla-posiciones'],
  ['consultar configuración', () => liga.configuracion(8), 'get', '/campeonatos/8/configuracion'],
  ['crear configuración', () => liga.crearConfiguracion(8, datos), 'post', '/campeonatos/8/configuracion', null, datos],
  ['editar configuración', () => liga.actualizarConfiguracion(8, datos), 'patch', '/campeonatos/8/configuracion', null, datos],
  ['listar equipos', () => equipo.listar(), 'get', '/equipos'],
  ['crear equipo', () => equipo.crear(datos), 'post', '/equipos', 'equipo', datos],
  ['editar equipo', () => equipo.actualizar(9, datos), 'patch', '/equipos/9', 'equipo', datos],
  ['eliminar equipo', () => equipo.eliminar(9), 'delete', '/equipos/9'],
  ['inscripciones', () => equipo.inscripciones(8), 'get', '/campeonatos/8/inscripciones-equipos'],
  ['inscribir equipo usa ID general', () => equipo.inscribir(8, '9'), 'post', '/campeonatos/8/inscripciones-equipos', 'inscripcion', { equipo_id: 9 }],
  ['retirar inscripción', () => equipo.estadoInscripcion(21, 'retirado'), 'patch', '/inscripciones-equipos/21', 'inscripcion', { estado: 'retirado' }],
  ['eliminar inscripción', () => equipo.eliminarInscripcion(21), 'delete', '/inscripciones-equipos/21'],
  ['listar jugadores', () => jugador.listar(), 'get', '/jugadores'],
  ['crear jugador', () => jugador.crear(datos), 'post', '/jugadores', 'jugador', datos],
  ['editar jugador', () => jugador.actualizar(3, datos), 'patch', '/jugadores/3', 'jugador', datos],
  ['eliminar jugador', () => jugador.eliminar(3), 'delete', '/jugadores/3'],
  ['consultar plantilla usa inscripción', () => jugador.plantillas(21), 'get', '/inscripciones-equipos/21/plantillas'],
  ['inscribir jugador', () => jugador.inscribir(21, datos), 'post', '/inscripciones-equipos/21/plantillas', 'plantilla', datos],
  ['cerrar plantilla', () => jugador.actualizarPlantilla(31, { fecha_salida: '2026-10-25' }), 'patch', '/plantillas/31', 'plantilla', { fecha_salida: '2026-10-25' }],
  ['eliminar plantilla', () => jugador.eliminarPlantilla(31), 'delete', '/plantillas/31'],
  ['listar partidos', () => partido.listar(8), 'get', '/campeonatos/8/partidos'],
  ['consultar partido', () => partido.obtener(11), 'get', '/partidos/11'],
  ['crear partido', () => partido.crear(8, datos), 'post', '/campeonatos/8/partidos', 'partido', datos],
  ['editar partido', () => partido.actualizar(11, datos), 'patch', '/partidos/11', 'partido', datos],
  ['eliminar partido', () => partido.eliminar(11), 'delete', '/partidos/11'],
  ['generar calendario sin cuerpo inventado', () => partido.generar(8), 'post', '/campeonatos/8/generar-calendario'],
  ['consultar marcador', () => partido.marcador(11), 'get', '/partidos/11/marcador'],
  ['listar eventos', () => partido.eventos(11), 'get', '/partidos/11/eventos'],
  ['crear evento', () => partido.crearEvento(11, datos), 'post', '/partidos/11/eventos', 'evento', datos],
  ['corregir solo minuto', () => partido.actualizarEvento(41, '25'), 'patch', '/eventos/41', 'evento', { minuto: 25 }],
  ['eliminar evento', () => partido.eliminarEvento(41), 'delete', '/eventos/41'],
  ...['goleadores', 'asistencias', 'amarillas', 'rojas', 'faltas', 'equipos'].map(tipo => ['estadística ' + tipo, () => liga.estadisticas(8, tipo), 'get', '/campeonatos/8/estadisticas/' + tipo]),
]
for (const [nombre, ejecutar, metodo, ruta, propiedad, cuerpo] of casos) {
  test(nombre, async () => {
    const original = api.defaults.adapter
    const respuesta = propiedad ? { [propiedad]: { id: 12 } } : [{ id: 12 }]
    api.defaults.adapter = async configuracion => {
      assert.equal(configuracion.method, metodo)
      assert.equal(configuracion.url, ruta)
      assert.equal(configuracion.headers.Accept, 'application/json')
      assert.deepEqual(configuracion.data ? JSON.parse(configuracion.data) : undefined, cuerpo)
      return { data: respuesta, status: 200, statusText: 'OK', headers: {}, config: configuracion }
    }
    try { assert.deepEqual(await ejecutar(), propiedad ? respuesta[propiedad] : respuesta) }
    finally { api.defaults.adapter = original }
  })
}
test('la URL central incluye el prefijo API una sola vez', () => assert.equal(api.defaults.baseURL, '/api'))
test('errores 404, 409, 422, 500 y desconexión son comprensibles', () => {
  assert.equal(mensajeError({}), 'No se pudo conectar. Intenta de nuevo.')
  assert.equal(mensajeError({ response: { status: 404, data: { message: 'No query results' } } }), 'No encontramos este registro.')
  assert.equal(mensajeError({ response: { status: 409, data: { message: 'Tiene historial.' } } }), 'Tiene historial.')
  assert.equal(mensajeError({ response: { status: 422, data: { errors: { nombre: ['Nombre obligatorio.'], ciudad: ['Ciudad obligatoria.'] } } } }), 'Nombre obligatorio. Ciudad obligatoria.')
  assert.match(mensajeError({ response: { status: 500, data: { message: 'SQL y datos internos' } } }), /Intenta de nuevo/)
  assert.doesNotMatch(mensajeError({ response: { status: 500, data: { message: 'SQL y datos internos' } } }), /SQL/)
})
test('los errores no exponen nombres de campos ni detalles internos', () => {
  assert.equal(mensajeError({ response: { status: 422, data: { errors: { jugador_id: ['El campo jugador_id es obligatorio.'] } } } }), 'El campo jugador es obligatorio.')
  assert.equal(mensajeError({ response: { status: 409, data: { message: 'SQLSTATE: fallo interno' } } }), 'No se pudo completar la operación.')
})
test('rutas de imágenes y esquemas no admitidos', () => {
  assert.equal(urlImagen(null), '')
  assert.equal(urlImagen('escudos/a.png'), '/storage/escudos/a.png')
  assert.equal(urlImagen('/storage/a.png'), '/storage/a.png')
  assert.equal(urlImagen('https://ejemplo.com/a.png'), 'https://ejemplo.com/a.png')
  assert.equal(urlImagen('javascript:alert(1)'), '')
  assert.equal(urlImagen('//ejemplo.com/a.png'), '')
})
