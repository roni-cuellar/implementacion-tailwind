import { useState } from 'react'
import Aviso from './Aviso'
import { mensajeError } from '../services/api'
function EquipoForm({ equipo, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ nombre: equipo?.nombre || '', ciudad: equipo?.ciudad || '', escudo: equipo?.escudo || '' })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  function cambiar(e) { setDatos({ ...datos, [e.target.name]: e.target.value }) }
  async function guardar(e) {
    e.preventDefault(); setError(''); setGuardando(true)
    try { await onGuardar({ nombre: datos.nombre.trim(), ciudad: datos.ciudad.trim(), escudo: datos.escudo.trim() || null }) }
    catch (e) { setError(mensajeError(e)); setGuardando(false) }
  }
  return <form onSubmit={guardar}>
    <Aviso error={error} />
    <label>Nombre del equipo<input required name="nombre" maxLength={150} value={datos.nombre} onChange={cambiar} /></label>
    <label>Ciudad<input required name="ciudad" maxLength={100} value={datos.ciudad} onChange={cambiar} /></label>
    <label>URL del escudo (opcional)<input name="escudo" maxLength={255} value={datos.escudo} onChange={cambiar} placeholder="https://..." /></label>
    
    <div className="acciones"><button type="button" className="boton boton-borde" disabled={guardando} onClick={onCancelar}>Cancelar</button><button className="boton boton-verde" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar equipo'}</button></div>
  </form>
}
export default EquipoForm
