import ilustracion from '../assets/branding/ayuda_2.png'
function EstadoVista({ cargando, error, vacio, titulo = 'Todavía no hay registros', texto = 'Comienza agregando la información de tu campeonato.', reintentar, accion, className = '' }) {
  if (cargando) return <div className="estado-vista" role="status"><span className="spinner" /> Cargando información…</div>
  if (error) return <div className="estado-vista"><p className="aviso aviso-error" role="alert">{error}</p>{reintentar && <button className="boton boton-borde" onClick={reintentar}>Volver a intentar</button>}</div>
  if (vacio) return <div className={'estado-vista ' + className}><img src={ilustracion} alt="" loading="lazy" /><h2>{titulo}</h2><p>{texto}</p>{accion && <div className="estado-accion">{accion}</div>}</div>
  return null
}
export default EstadoVista
