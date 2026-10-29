import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import jugadorService from '../services/jugadorService'
import { mensajeError } from '../services/api'
import useEquipoStore from '../stores/useEquipoStore'
import JugadorForm from '../components/JugadorForm'
import PlantillaForm from '../components/PlantillaForm'
import ImagenEntidad from '../components/ImagenEntidad'
import Modal from '../components/Modal'
import Confirmacion from '../components/Confirmacion'
import EstadoVista from '../components/EstadoVista'
import Aviso from '../components/Aviso'

function JugadoresPage() {
  const { ligaId } = useParams()
  const { inscripciones, cargando: cargandoEquipos, error: errorEquipos, cargar } = useEquipoStore()
  const [jugadores, setJugadores] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [seleccionado, setEquipoId] = useState('')
  const equipoId = inscripciones.some(i => String(i.id) === seleccionado) ? seleccionado : String(inscripciones[0]?.id || '')
  const [tab, setTab] = useState('plantilla')
  const [busqueda, setBusqueda] = useState('')
  const [revision, setRevision] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoPlantilla, setCargandoPlantilla] = useState(false)
  const [error, setError] = useState('')
  const [errorPlantilla, setErrorPlantilla] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [inscripcionForm, setInscripcionForm] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [mensaje, setMensaje] = useState('')
  useEffect(() => { cargar(ligaId) }, [ligaId, cargar])
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setCargando(true); setError('')
      try { const datos = await jugadorService.listar(); if (vigente) setJugadores(datos) }
      catch (e) { if (vigente) setError(mensajeError(e)) }
      finally { if (vigente) setCargando(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [revision])
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setPlantillas([]); setErrorPlantilla('')
      if (!equipoId) { setCargandoPlantilla(false); return }
      setCargandoPlantilla(true)
      try { const datos = await jugadorService.plantillas(equipoId); if (vigente) setPlantillas(datos) }
      catch (e) { if (vigente) setErrorPlantilla(mensajeError(e)) }
      finally { if (vigente) setCargandoPlantilla(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [equipoId, revision])
  const equipo = inscripciones.find(i => String(i.id) === String(equipoId))
  const catalogo = jugadores.filter(j => (j.nombre + ' ' + j.apellido).toLowerCase().includes(busqueda.toLowerCase()))
  async function guardarJugador(datos) {
    if (formulario.id) await jugadorService.actualizar(formulario.id, datos)
    else await jugadorService.crear(datos)
    setFormulario(null); setRevision(v => v + 1); setMensaje('Jugador guardado correctamente.')
  }
  async function guardarPlantilla(datos) {
    if (inscripcionForm.modo === 'inscribir') await jugadorService.inscribir(equipoId, datos)
    else await jugadorService.actualizarPlantilla(inscripcionForm.plantilla.id, datos)
    setInscripcionForm(null); setRevision(v => v + 1); setMensaje('Inscripción guardada correctamente.')
  }
  return <>
    <div className="titulo-pagina"><div><h1>Jugadores</h1><p className="texto-suave">Gestiona jugadores y plantillas.</p></div><button className="boton boton-verde" onClick={() => setFormulario({})}>+ Registrar jugador</button></div>
    <Aviso exito={mensaje} />
    <div className="pestanas"><button className={tab === 'plantilla' ? 'activa' : ''} onClick={() => setTab('plantilla')}>Plantillas</button><button className={tab === 'catalogo' ? 'activa' : ''} onClick={() => setTab('catalogo')}>Todos los jugadores</button></div>
    <EstadoVista cargando={cargando || cargandoEquipos} error={error || errorEquipos} reintentar={() => { cargar(ligaId); setRevision(v => v + 1) }} />
    {!cargando && !cargandoEquipos && !error && !errorEquipos && (tab === 'catalogo' ? <>
      <div className="filtros"><label>Buscar jugador<input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Nombre o apellido" /></label></div>
      <EstadoVista vacio={!catalogo.length} titulo="No hay jugadores para mostrar" texto="Registra un jugador o cambia la búsqueda." />
      {catalogo.length > 0 && <div className="panel tabla-contenedor"><table><thead><tr><th>Jugador</th><th>Nacimiento</th><th>Acciones</th></tr></thead><tbody>{catalogo.map(j => <tr key={j.id}><td><div className="celda-entidad"><ImagenEntidad ruta={j.foto} nombre={j.nombre + ' ' + j.apellido} />{j.nombre} {j.apellido}</div></td><td>{j.fecha_nacimiento.slice(0, 10)}</td><td><div className="acciones acciones-compactas"><button className="boton boton-borde" onClick={() => setFormulario(j)}>Editar</button><button className="boton-texto peligro" onClick={() => setConfirmacion({ titulo: 'Eliminar jugador', texto: '¿Eliminar al jugador? Solo es posible si no tiene inscripciones.', accion: async () => { await jugadorService.eliminar(j.id); setRevision(v => v + 1) } })}>Eliminar</button></div></td></tr>)}</tbody></table></div>}
    </> : <>
      <div className="filtros"><label>Equipo inscrito<select value={equipoId} onChange={e => setEquipoId(e.target.value)}><option value="">Selecciona un equipo</option>{inscripciones.map(i => <option key={i.id} value={i.id}>{i.equipo.nombre} · {i.estado}</option>)}</select></label><button className="boton boton-verde" disabled={!equipo || equipo.estado !== 'activo' || cargandoPlantilla || Boolean(errorPlantilla)} onClick={() => setInscripcionForm({ modo: 'inscribir' })}>Inscribir jugador</button></div>
      {equipo?.estado === 'retirado' && <div className="aviso aviso-info">Equipo retirado. Su plantilla se conserva para consulta.</div>}
      <EstadoVista cargando={cargandoPlantilla} error={errorPlantilla} vacio={!equipo || !plantillas.length} titulo={!equipo ? 'Selecciona un equipo inscrito' : 'Plantilla vacía'} texto={!inscripciones.length ? 'Inscribe un equipo para comenzar.' : 'Selecciona un jugador para inscribirlo.'} reintentar={() => setRevision(v => v + 1)} />
      {!cargandoPlantilla && !errorPlantilla && plantillas.length > 0 && <div className="panel tabla-contenedor"><table><thead><tr><th>Jugador</th><th>Dorsal</th><th>Posición</th><th>Ingreso</th><th>Salida</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{plantillas.map(p => <tr key={p.id}><td><div className="celda-entidad"><ImagenEntidad ruta={p.jugador.foto} nombre={p.jugador.nombre} />{p.jugador.nombre} {p.jugador.apellido}</div></td><td>{p.dorsal}</td><td>{p.posicion}</td><td>{p.fecha_ingreso.slice(0, 10)}</td><td>{p.fecha_salida?.slice(0, 10) || '—'}</td><td><span className={'estado estado-' + (p.fecha_salida ? 'retirado' : 'activo')}>{p.fecha_salida ? 'Histórica' : 'Activa'}</span></td><td>{!p.fecha_salida ? <div className="acciones acciones-compactas"><button className="boton boton-borde" onClick={() => setInscripcionForm({ modo: 'editar', plantilla: p })}>Editar</button><button className="boton boton-borde" onClick={() => setInscripcionForm({ modo: 'salida', plantilla: p })}>Registrar salida</button><button className="boton-texto peligro" onClick={() => setConfirmacion({ titulo: 'Eliminar inscripción', texto: '¿Eliminar esta inscripción? Para retirar al jugador, registra su salida.', accion: async () => { await jugadorService.eliminarPlantilla(p.id); setRevision(v => v + 1) } })}>Eliminar</button></div> : <span className="nota">Cerrada</span>}</td></tr>)}</tbody></table></div>}
    </>)}
    {formulario && <Modal titulo={formulario.id ? 'Editar jugador' : 'Registrar jugador'} onCerrar={() => setFormulario(null)}><JugadorForm jugador={formulario} onGuardar={guardarJugador} onCancelar={() => setFormulario(null)} /></Modal>}
    {inscripcionForm && <Modal titulo={inscripcionForm.modo === 'salida' ? 'Registrar salida del jugador' : inscripcionForm.modo === 'editar' ? 'Editar inscripción del jugador' : 'Inscribir jugador en la plantilla'} onCerrar={() => setInscripcionForm(null)}><PlantillaForm {...inscripcionForm} jugadores={jugadores} plantillas={plantillas} onGuardar={guardarPlantilla} onCancelar={() => setInscripcionForm(null)} /></Modal>}
    {confirmacion && <Confirmacion titulo={confirmacion.titulo} texto={confirmacion.texto} onConfirmar={confirmacion.accion} onCerrar={() => setConfirmacion(null)} />}
  </>
}
export default JugadoresPage
