import { useState } from 'react'
import Aviso from './Aviso'
import { mensajeError } from '../services/api'
function PlantillaForm({ modo, plantilla, jugadores, plantillas, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => ({ jugador_id: '', dorsal: plantilla?.dorsal || '', posicion: plantilla?.posicion || '', fecha_ingreso: new Date().toLocaleDateString('en-CA'), fecha_salida: new Date().toLocaleDateString('en-CA') }))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  function cambiar(e) { setDatos({ ...datos, [e.target.name]: e.target.value }) }
  async function guardar(e) {
    e.preventDefault(); setError('')
    if (modo !== 'salida' && plantillas.some(p => !p.fecha_salida && p.id !== plantilla?.id && Number(p.dorsal) === Number(datos.dorsal))) { setError('Ese dorsal ya lo utiliza otro jugador activo del equipo.'); return }
    let envio
    if (modo === 'salida') envio = { fecha_salida: datos.fecha_salida }
    else if (modo === 'editar') envio = { dorsal: Number(datos.dorsal), posicion: datos.posicion.trim() }
    else envio = { jugador_id: Number(datos.jugador_id), dorsal: Number(datos.dorsal), posicion: datos.posicion.trim(), fecha_ingreso: datos.fecha_ingreso }
    setGuardando(true)
    try { await onGuardar(envio) }
    catch (e) { setError(mensajeError(e)); setGuardando(false) }
  }
  return <form onSubmit={guardar}><Aviso error={error} />
    {modo === 'inscribir' && <label>Jugador existente<select required name="jugador_id" value={datos.jugador_id} onChange={cambiar}><option value="">Selecciona un jugador</option>{jugadores.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido} · #{j.id}</option>)}</select></label>}
    {modo !== 'salida' && <div className="dos-columnas"><label>Dorsal<input type="number" name="dorsal" required min="1" max="99" step="1" value={datos.dorsal} onChange={cambiar} /></label><label>Posición<input name="posicion" required maxLength={50} value={datos.posicion} onChange={cambiar} placeholder="Delantero" /></label></div>}
    {modo === 'inscribir' && <label>Fecha de ingreso<input required type="date" name="fecha_ingreso" value={datos.fecha_ingreso} onInput={cambiar} onChange={cambiar} /></label>}
    {modo === 'salida' && <><label>Fecha de salida<input required type="date" name="fecha_salida" min={plantilla.fecha_ingreso.slice(0, 10)} value={datos.fecha_salida} onInput={cambiar} onChange={cambiar} /></label><p className="nota">La salida cierra esta inscripción y conserva el historial.</p></>}
    <div className="acciones"><button className="boton boton-borde" type="button" onClick={onCancelar} disabled={guardando}>Cancelar</button><button className="boton boton-verde" disabled={guardando}>{guardando ? 'Guardando…' : modo === 'salida' ? 'Registrar salida' : 'Guardar inscripción'}</button></div>
  </form>
}
export default PlantillaForm
