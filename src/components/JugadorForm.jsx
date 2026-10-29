import { useState } from 'react'
import Aviso from './Aviso'
import { mensajeError } from '../services/api'
function JugadorForm({ jugador, onGuardar, onCancelar }) {
  const [hoy] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [datos, setDatos] = useState({ nombre: jugador?.nombre || '', apellido: jugador?.apellido || '', fecha_nacimiento: jugador?.fecha_nacimiento?.slice(0, 10) || '', foto: jugador?.foto || '' })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  function cambiar(e) { setDatos({ ...datos, [e.target.name]: e.target.value }) }
  async function guardar(e) {
    e.preventDefault(); setGuardando(true); setError('')
    try { await onGuardar({ ...datos, nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), foto: datos.foto.trim() || null }) }
    catch (e) { setError(mensajeError(e)); setGuardando(false) }
  }
  return <form onSubmit={guardar}><Aviso error={error} />
    <div className="dos-columnas"><label>Nombre<input required maxLength={100} name="nombre" value={datos.nombre} onChange={cambiar} /></label><label>Apellido<input required maxLength={100} name="apellido" value={datos.apellido} onChange={cambiar} /></label></div>
    <label>Fecha de nacimiento<input required type="date" name="fecha_nacimiento" max={hoy} value={datos.fecha_nacimiento} onInput={cambiar} onChange={cambiar} /></label>
    <label>URL de la foto (opcional)<input name="foto" maxLength={255} placeholder="https://..." value={datos.foto} onChange={cambiar} /></label>
    <div className="acciones"><button type="button" className="boton boton-borde" onClick={onCancelar} disabled={guardando}>Cancelar</button><button className="boton boton-verde" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar jugador'}</button></div>
  </form>
}
export default JugadorForm
