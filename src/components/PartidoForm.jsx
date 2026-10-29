import { useState } from 'react'
import Aviso from './Aviso'
import { mensajeError } from '../services/api'
import { fechaLocalCampo } from '../utils/partidos'
function PartidoForm({ partido, inscripciones, permitirEquipos = true, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    jornada: partido?.jornada || 1, fecha_hora: fechaLocalCampo(partido?.fecha_hora), lugar: partido?.lugar || '',
    local_id: partido?.participantes?.find(p => p.rol === 'local')?.campeonato_equipo_id || '',
    visitante_id: partido?.participantes?.find(p => p.rol === 'visitante')?.campeonato_equipo_id || '',
  })
  const [cambiarEquipos, setCambiarEquipos] = useState(!partido)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  function cambiar(e) { setDatos({ ...datos, [e.target.name]: e.target.value }) }
  async function guardar(e) {
    e.preventDefault(); setError('')
    if (cambiarEquipos && Number(datos.local_id) === Number(datos.visitante_id)) { setError('El local y el visitante deben ser diferentes.'); return }
    const envio = { jornada: Number(datos.jornada), fecha_hora: datos.fecha_hora ? new Date(datos.fecha_hora).toISOString() : null, lugar: datos.lugar.trim() || null }
    if (cambiarEquipos) { envio.local_id = Number(datos.local_id); envio.visitante_id = Number(datos.visitante_id) }
    setGuardando(true)
    try { await onGuardar(envio) }
    catch (e) { setError(mensajeError(e)); setGuardando(false) }
  }
  return <form onSubmit={guardar}><Aviso error={error} />
    <div className="dos-columnas"><label>Jornada<input type="number" min="1" step="1" required name="jornada" value={datos.jornada} onChange={cambiar} /></label><label>Fecha y hora (opcional)<input type="datetime-local" name="fecha_hora" value={datos.fecha_hora} onInput={cambiar} onChange={cambiar} /></label></div>
    <label>Lugar (opcional)<input maxLength={150} name="lugar" value={datos.lugar} onChange={cambiar} /></label>
    
    {partido && permitirEquipos && <label className="campo-checkbox"><input type="checkbox" checked={cambiarEquipos} onChange={e => setCambiarEquipos(e.target.checked)} /> Cambiar local y visitante</label>}
    {cambiarEquipos && <div className="dos-columnas">{[['local_id', 'Equipo local'], ['visitante_id', 'Equipo visitante']].map(([campo, titulo]) => <label key={campo}>{titulo}<select name={campo} required value={datos[campo]} onChange={cambiar}><option value="">Selecciona un equipo activo</option>{inscripciones.filter(i => i.estado === 'activo').map(i => <option key={i.id} value={i.id}>{i.equipo.nombre}</option>)}</select></label>)}</div>}
    <div className="acciones"><button type="button" className="boton boton-borde" disabled={guardando} onClick={onCancelar}>Cancelar</button><button className="boton boton-verde" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar partido'}</button></div>
  </form>
}
export default PartidoForm
