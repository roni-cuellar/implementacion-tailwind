import { useEffect, useRef } from 'react'
import Icono from './Icono'
function Modal({ titulo, onCerrar, bloqueado = false, children }) {
  const referencia = useRef(null)
  useEffect(() => { referencia.current.showModal() }, [])
  return (
    <dialog ref={referencia} className="modal" aria-label={titulo} onCancel={e => { e.preventDefault(); if (!bloqueado) onCerrar() }}>
      <div className="modal-cabecera"><h2>{titulo}</h2><button type="button" className="boton-icono" onClick={onCerrar} disabled={bloqueado} aria-label="Cerrar ventana"><Icono nombre="cerrar" /></button></div>
      {children}
    </dialog>
  )
}
export default Modal
