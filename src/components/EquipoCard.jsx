import ImagenEntidad from './ImagenEntidad'
import Icono from './Icono'
function EquipoCard({ inscripcion, onEditar, onEstado, onEliminar }) {
  const equipo = inscripcion.equipo
  return <article className="panel equipo-card">
    <div className="fila-entre"><ImagenEntidad ruta={equipo.escudo} nombre={equipo.nombre} /><span className={'estado estado-' + inscripcion.estado}>{inscripcion.estado}</span></div>
    <details className="menu-acciones"><summary aria-label={'Acciones de ' + equipo.nombre}><Icono nombre="puntos" /></summary><div>
      <button onClick={() => onEstado(inscripcion)}>{inscripcion.estado === 'activo' ? 'Retirar equipo' : 'Reactivar equipo'}</button>
      <button className="peligro" onClick={() => onEliminar(inscripcion)}>Eliminar inscripción</button>
    </div></details>
    <h2>{equipo.nombre}</h2><p className="texto-suave">{equipo.ciudad}</p>
    <button className="boton boton-borde" onClick={() => onEditar(equipo)}>Editar equipo</button>
  </article>
}
export default EquipoCard
