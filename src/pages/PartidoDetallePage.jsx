import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import partidoService from '../services/partidoService'
import jugadorService from '../services/jugadorService'
import useEquipoStore from '../stores/useEquipoStore'
import { mensajeError } from '../services/api'
import { transicionesPartido, nombreParticipante } from '../utils/partidos'
import EstadoVista from '../components/EstadoVista'
import Aviso from '../components/Aviso'
import Confirmacion from '../components/Confirmacion'
import Modal from '../components/Modal'
import PartidoForm from '../components/PartidoForm'
import EventoForm, { MinutoForm } from '../components/EventoForm'
import { useNavigate } from 'react-router-dom'

function PartidoDetallePage() {
  const { ligaId, partidoId } = useParams()
  const navegar = useNavigate()
  const { inscripciones, cargar: cargarEquipos, error: errorEquipos } = useEquipoStore()
  const [partido, setPartido] = useState(null)
  const [eventos, setEventos] = useState([])
  const [marcador, setMarcador] = useState(null)
  const [plantillas, setPlantillas] = useState({})
  const [error, setError] = useState('')
  const [errorParcial, setErrorParcial] = useState('')
  const [cargando, setCargando] = useState(true)
  const [revision, setRevision] = useState(0)
  const [editar, setEditar] = useState(false)
  const [corregir, setCorregir] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [mensaje, setMensaje] = useState('')
  useEffect(() => { cargarEquipos(ligaId) }, [ligaId, cargarEquipos])
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setCargando(true); setError(''); setErrorParcial(''); setPartido(null); setMarcador(null); setPlantillas({})
      try {
        const detalle = await partidoService.obtener(partidoId)
        if (String(detalle.campeonato_id) !== ligaId) throw new Error('liga_incorrecta')
        const [eventosRespuesta, marcadorRespuesta, ...listas] = await Promise.allSettled([
          partidoService.eventos(partidoId), partidoService.marcador(partidoId),
          ...detalle.participantes.map(p => jugadorService.plantillas(p.campeonato_equipo_id)),
        ])
        if (!vigente) return
        if (eventosRespuesta.status === 'rejected') { setError(mensajeError(eventosRespuesta.reason)); return }
        const plantillasCargadas = {}
        const fallos = []
        detalle.participantes.forEach((p, indice) => {
          if (listas[indice].status === 'fulfilled') plantillasCargadas[p.campeonato_equipo_id] = listas[indice].value
          else fallos.push('No fue posible consultar todas las plantillas.')
        })
        if (marcadorRespuesta.status === 'fulfilled') setMarcador(marcadorRespuesta.value)
        else fallos.push(mensajeError(marcadorRespuesta.reason))
        setPartido(detalle); setEventos(eventosRespuesta.value); setPlantillas(plantillasCargadas); setErrorParcial(fallos.join(' '))
      } catch (e) { if (vigente) setError(e.message === 'liga_incorrecta' ? 'Este partido no pertenece a la liga seleccionada.' : mensajeError(e)) }
      finally { if (vigente) setCargando(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, partidoId, revision])
  function recargar(texto) { setMensaje(texto); setRevision(v => v + 1) }
  const editable = partido && !['finalizado', 'cancelado'].includes(partido.estado)
  const plantillasListas = partido?.participantes.length === 2 && partido.participantes.every(p => Boolean(plantillas[p.campeonato_equipo_id]))
  return <>
    <Link className="enlace-texto" to={'/ligas/' + ligaId + '/partidos'}>Partidos</Link>
    <EstadoVista cargando={cargando} error={error} reintentar={() => setRevision(v => v + 1)} />
    {!cargando && !error && partido && <>
      <div className="titulo-pagina"><div><h1>Partido</h1><p className="texto-suave">Jornada {partido.jornada} · {partido.fecha_hora ? new Date(partido.fecha_hora).toLocaleString('es-CO') : 'Fecha por programar'} · {partido.lugar || 'Lugar por definir'}</p></div><span className={'estado estado-' + partido.estado}>{partido.estado.replaceAll('_', ' ')}</span></div>
      <Aviso error={errorParcial || errorEquipos} exito={mensaje} />
      <div className="panel marcador-detalle"><div><span>LOCAL</span><strong>{marcador?.local.nombre || nombreParticipante(partido, 'local')}</strong></div><b>{marcador ? marcador.local.goles + ' – ' + marcador.visitante.goles : 'No disponible'}</b><div><span>VISITANTE</span><strong>{marcador?.visitante.nombre || nombreParticipante(partido, 'visitante')}</strong></div></div>
      <div className="acciones acciones-compactas">
        {editable && <button className="boton boton-borde" onClick={() => setEditar(true)}>Editar partido</button>}
        {(transicionesPartido[partido.estado] || []).map(estado => <button key={estado} className="boton boton-borde" onClick={() => setConfirmacion({ titulo: 'Cambiar estado del partido', texto: '¿Cambiar de ' + partido.estado.replaceAll('_', ' ') + ' a ' + estado.replaceAll('_', ' ') + '? Los estados finalizado y cancelado son definitivos.', accion: async () => { await partidoService.actualizar(partidoId, { estado }); recargar('Estado actualizado.') } })}>{estado === 'en_curso' ? (partido.estado === 'programado' ? 'Iniciar partido' : 'Reanudar') : estado === 'finalizado' ? 'Finalizar' : estado === 'suspendido' ? 'Suspender' : 'Cancelar partido'}</button>)}
        <button className="boton-texto peligro" onClick={() => setConfirmacion({ titulo: 'Eliminar partido', texto: '¿Eliminar el partido? Solo es posible si no tiene eventos.', accion: async () => { await partidoService.eliminar(partidoId); navegar('/ligas/' + ligaId + '/partidos') } })}>Eliminar partido</button>
      </div>
      <div className="detalle-eventos">
        <div className="panel"><h2>Historial de eventos</h2>{!eventos.length && <p className="nota">No hay eventos registrados.</p>}
          <ol className="lista-eventos">{eventos.map(e => <li key={e.id}><span className="minuto-evento">{e.minuto}′</span><div><strong>{e.tipo} · {e.plantilla.jugador.nombre} {e.plantilla.jugador.apellido}</strong><p>{e.tipo === 'autogol' ? 'Beneficia a ' : ''}{e.equipo_partido.campeonato_equipo.equipo.nombre}{e.gol_relacionado_id ? ' · Gol relacionado #' + e.gol_relacionado_id : ''}</p>
            {partido.estado === 'en_curso' && <div className="acciones acciones-compactas"><button className="boton-texto" onClick={() => setCorregir(e)}>Corregir minuto</button><button className="boton-texto peligro" onClick={() => setConfirmacion({ titulo: 'Eliminar evento', texto: '¿Eliminar este evento? Para borrar un gol, elimina primero su asistencia.', accion: async () => { await partidoService.eliminarEvento(e.id); recargar('Evento eliminado.') } })}>Eliminar evento</button></div>}</div></li>)}</ol>
        </div>
        {partido.estado === 'en_curso' && plantillasListas ? <EventoForm partido={partido} eventos={eventos} plantillas={plantillas} onGuardar={async datos => { await partidoService.crearEvento(partidoId, datos); recargar('Evento registrado correctamente.') }} />
          : <div className="panel"><h2>Registro de eventos</h2><p className="nota">{partido.estado === 'en_curso' ? 'No se pudieron cargar las plantillas.' : 'Los eventos se habilitan cuando el partido está en curso.'}</p></div>}
      </div>
      {editar && <Modal titulo="Editar partido" onCerrar={() => setEditar(false)}><PartidoForm partido={partido} inscripciones={inscripciones} permitirEquipos={partido.estado === 'programado' && eventos.length === 0} onCancelar={() => setEditar(false)} onGuardar={async datos => { await partidoService.actualizar(partidoId, datos); setEditar(false); recargar('Partido actualizado.') }} /></Modal>}
      {corregir && <Modal titulo="Corregir minuto del evento" onCerrar={() => setCorregir(null)}><MinutoForm evento={corregir} onGuardar={async minuto => { await partidoService.actualizarEvento(corregir.id, minuto); setCorregir(null); recargar('Minuto corregido.') }} /></Modal>}
    </>}
    {confirmacion && <Confirmacion titulo={confirmacion.titulo} texto={confirmacion.texto} onConfirmar={confirmacion.accion} onCerrar={() => setConfirmacion(null)} />}
  </>
}
export default PartidoDetallePage
