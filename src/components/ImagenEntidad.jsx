import { useState } from 'react'
import { urlImagen } from '../services/api'
function ImagenEntidad({ ruta, nombre }) {
  const [fallo, setFallo] = useState('')
  const src = urlImagen(ruta)
  return src && fallo !== src
    ? <img className="imagen-entidad" src={src} alt={nombre} loading="lazy" onError={() => setFallo(src)} />
    : <span className="imagen-entidad placeholder-entidad" aria-label={'Sin imagen de ' + nombre}>{nombre?.trim().slice(0, 2).toUpperCase() || 'BE'}</span>
}
export default ImagenEntidad
