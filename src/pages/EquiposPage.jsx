import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useEquipoStore from '../stores/useEquipoStore'
import equipoService from '../services/equipoService'
import EquipoCard from '../components/EquipoCard'
import EquipoForm from '../components/EquipoForm'
import ImagenEntidad from '../components/ImagenEntidad'
import Modal from '../components/Modal'
import Confirmacion from '../components/Confirmacion'
import EstadoVista from '../components/EstadoVista'
import Aviso from '../components/Aviso'
import { mensajeError } from '../services/api'

function EquiposPage() {
  const { ligaId } = useParams()
  const { equipos, inscripciones, cargando, error, cargar } = useEquipoStore()
  const [tab, setTab] = useState('inscritos')
  const [formulario, setFormulario] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [inscribir, setInscribir] = useState(false)
  const [equipoId, setEquipoId] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorInscripcion, setErrorInscripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  useEffect(() => { cargar(ligaId) }, [ligaId, cargar])
  const disponibles = equipos.filter(e => !inscripciones.some(i => i.equipo_id === e.id))
  async function guardarEquipo(datos) {
    if (formulario.id) await equipoService.actualizar(formulario.id, datos)
    else await equipoService.crear(datos)
    setFormulario(null); setMensaje('Equipo guardado correctamente.'); setTab('catalogo')
    await cargar(ligaId)
  }
  async function inscribirEquipo(e) {
    e.preventDefault(); setGuardando(true); setErrorInscripcion('')
    try {
      await equipoService.inscribir(ligaId, equipoId)
      setInscribir(false); setTab('inscritos'); setMensaje('Equipo inscrito correctamente.'); await cargar(ligaId)
    } catch (e) { setErrorInscripcion(mensajeError(e)) }
    finally { setGuardando(false) }
  }
  function cambiarEstado(i) {
    const estado = i.estado === 'activo' ? 'retirado' : 'activo'
    setConfirmacion({ titulo: estado === 'retirado' ? 'Retirar equipo' : 'Reactivar equipo', texto: 'Se conservará el historial. Los partidos pendientes no cambiarán.', accion: async () => { await equipoService.estadoInscripcion(i.id, estado); setMensaje('Estado de la inscripción actualizado.'); await cargar(ligaId) } })
  }
  function eliminarInscripcion(i) {
    setConfirmacion({ titulo: 'Eliminar inscripción', texto: '¿Eliminar esta inscripción? Si tiene historial, utiliza Retirar.', accion: async () => { await equipoService.eliminarInscripcion(i.id); await cargar(ligaId); setMensaje('Inscripción eliminada correctamente.') } })
  }
  return <>
    <div className="titulo-pagina"><div><h1>Equipos</h1><p className="texto-suave">Gestiona los equipos de tu liga.</p></div>
      <div className="acciones"><button className="boton boton-borde" onClick={() => setFormulario({})}>Registrar equipo</button><button className="boton boton-verde" disabled={cargando || Boolean(error)} onClick={() => { setInscribir(true); setEquipoId(''); setErrorInscripcion('') }}>Inscribir equipo</button></div></div>
    <Aviso exito={mensaje} />
    <div className="pestanas" aria-label="Vistas de equipos"><button className={tab === 'inscritos' ? 'activa' : ''} onClick={() => setTab('inscritos')}>Inscritos en esta liga ({inscripciones.length})</button><button className={tab === 'catalogo' ? 'activa' : ''} onClick={() => setTab('catalogo')}>Catálogo general ({equipos.length})</button></div>
    <EstadoVista cargando={cargando} error={error} vacio={tab === 'inscritos' ? !inscripciones.length : !equipos.length} titulo={tab === 'inscritos' ? 'Aún no hay equipos inscritos' : 'No hay equipos registrados'} reintentar={() => cargar(ligaId)} />
    {!cargando && !error && (tab === 'inscritos' ? <div className="rejilla-tarjetas">{inscripciones.map(i => <EquipoCard key={i.id} inscripcion={i} onEditar={setFormulario} onEstado={cambiarEstado} onEliminar={eliminarInscripcion} />)}</div>
      : equipos.length > 0 && <div className="panel tabla-contenedor"><table><thead><tr><th>Equipo</th><th>Ciudad</th><th>Acciones</th></tr></thead><tbody>{equipos.map(e => <tr key={e.id}><td><div className="celda-entidad"><ImagenEntidad ruta={e.escudo} nombre={e.nombre} />{e.nombre}</div></td><td>{e.ciudad}</td><td><div className="acciones acciones-compactas"><button className="boton boton-borde" onClick={() => setFormulario(e)}>Editar</button><button className="boton-texto peligro" onClick={() => setConfirmacion({ titulo: 'Eliminar equipo', texto: '¿Eliminar el equipo? Solo es posible si no tiene inscripciones.', accion: async () => { await equipoService.eliminar(e.id); await cargar(ligaId) } })}>Eliminar</button></div></td></tr>)}</tbody></table></div>)}
    {formulario && <Modal titulo={formulario.id ? 'Editar equipo' : 'Registrar equipo'} onCerrar={() => setFormulario(null)}><EquipoForm equipo={formulario} onGuardar={guardarEquipo} onCancelar={() => setFormulario(null)} /></Modal>}
    {inscribir && <Modal titulo="Inscribir equipo" onCerrar={() => setInscribir(false)} bloqueado={guardando}><form onSubmit={inscribirEquipo}><Aviso error={errorInscripcion} /><label>Equipo<select required value={equipoId} onChange={e => setEquipoId(e.target.value)}><option value="">Selecciona un equipo</option>{disponibles.map(e => <option key={e.id} value={e.id}>{e.nombre} · {e.ciudad}</option>)}</select></label>{!disponibles.length && <p className="nota">No hay equipos disponibles. Registra uno o reactiva una inscripción.</p>}<button className="boton boton-verde" disabled={guardando || !equipoId}>{guardando ? 'Inscribiendo…' : 'Confirmar inscripción'}</button></form></Modal>}
    {confirmacion && <Confirmacion titulo={confirmacion.titulo} texto={confirmacion.texto} onConfirmar={confirmacion.accion} onCerrar={() => setConfirmacion(null)} />}
  </>
}
export default EquiposPage
