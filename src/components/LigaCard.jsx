import { Link } from 'react-router-dom'
import ilustracion from '../assets/branding/ayuda_2.png'
import Icono from './Icono'

function LigaCard({ liga, onEliminar }) {
  const estado = liga.estado === 'planificacion' ? 'Planificación' : liga.estado.replaceAll('_', ' ')
  return <article className="liga-card">
    <div className="liga-card-visual">
      <img src={ilustracion} alt="" loading="lazy" width="1254" height="1254" />
      <span className={'estado estado-' + liga.estado}>{estado}</span>
    </div>
    <details className="menu-acciones" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false }} onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary').focus() } }}>
      <summary aria-label={'Acciones de ' + liga.nombre}><Icono nombre="puntos" /></summary>
      <div><Link to={'/ligas/' + liga.id + '/editar'}>Editar liga</Link><button className="peligro" onClick={() => onEliminar(liga)}>Eliminar liga</button></div>
    </details>
    <div className="liga-card-contenido">
      <p className="liga-temporada">Temporada {liga.temporada}</p>
      <h2 title={liga.nombre}>{liga.nombre}</h2>
      <p className="descripcion-liga">{liga.descripcion || 'Sin descripción'}</p>
      <Link className="boton boton-oscuro" to={'/ligas/' + liga.id + '/dashboard'}>Administrar</Link>
    </div>
  </article>
}
export default LigaCard
