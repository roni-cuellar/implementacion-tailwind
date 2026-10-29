import { useState } from 'react'
import Modal from './Modal'
import Aviso from './Aviso'
import { mensajeError } from '../services/api'
function Confirmacion({ titulo, texto, onConfirmar, onCerrar }) {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  async function confirmar() {
    setGuardando(true)
    setError('')
    try { await onConfirmar(); onCerrar() }
    catch (error) { setError(mensajeError(error)); setGuardando(false) }
  }
  return <Modal titulo={titulo} onCerrar={onCerrar} bloqueado={guardando}>
    <p className="texto-suave">{texto}</p><Aviso error={error} />
    <div className="acciones"><button className="boton boton-borde" disabled={guardando} onClick={onCerrar}>Cancelar</button>
      <button className="boton boton-verde" disabled={guardando} onClick={confirmar}>{guardando ? 'Procesando…' : 'Confirmar'}</button></div>
  </Modal>
}
export default Confirmacion
