import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import equipoService from '../services/equipoService'
import jugadorService from '../services/jugadorService'
import ligaService from '../services/ligaService'
import usePartidoStore from '../stores/usePartidoStore'
import PartidoCard from '../components/PartidoCard'
import EstadoVista from '../components/EstadoVista'
import Aviso from '../components/Aviso'
import { mensajeError } from '../services/api'

function DashboardPage() {
  const { liga } = useOutletContext()
  const { ligaId } = useParams()
  const { partidos, cargando, error, cargar } = usePartidoStore()
  const [resumen, setResumen] = useState({ equipos: null, jugadores: null, tabla: [], error: '' })
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    let vigente = true
    cargar(ligaId)
    async function consultar() {
      setResumen({ equipos: null, jugadores: null, tabla: [], error: '' })
      const [inscripciones, tabla] = await Promise.allSettled([equipoService.inscripciones(ligaId), ligaService.tabla(ligaId)])
      let equipos = null, jugadores = null
      const errores = []
      if (inscripciones.status === 'fulfilled') {
        equipos = inscripciones.value.length
        const plantillas = await Promise.allSettled(inscripciones.value.map(i => jugadorService.plantillas(i.id)))
        if (plantillas.every(p => p.status === 'fulfilled')) jugadores = new Set(plantillas.flatMap(p => p.value.map(j => j.jugador_id))).size
        else errores.push('No fue posible consultar todas las plantillas.')
      } else errores.push(mensajeError(inscripciones.reason))
      if (tabla.status === 'rejected') errores.push(mensajeError(tabla.reason))
      if (vigente) setResumen({ equipos, jugadores, tabla: tabla.status === 'fulfilled' ? tabla.value.tabla : [], error: errores.join(' ') })
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, cargar, intento])
  const proximos = partidos.filter(p => p.estado === 'programado').sort((a, b) => (a.fecha_hora ? new Date(a.fecha_hora).getTime() : Infinity) - (b.fecha_hora ? new Date(b.fecha_hora).getTime() : Infinity) || a.jornada - b.jornada).slice(0, 3)
  const ultimos = partidos.filter(p => p.estado === 'finalizado').sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 3)
  return <>
    <div className="titulo-pagina"><div><p className="etiqueta">TEMPORADA {liga.temporada}</p><h1>Resumen</h1>{liga.descripcion && <p className="texto-suave">{liga.descripcion}</p>}</div><span className={'estado estado-' + liga.estado}>{liga.estado.replaceAll('_', ' ')}</span></div>
    <div className="rejilla-resumen">{[['Equipos inscritos', resumen.equipos], ['Jugadores', resumen.jugadores], ['Partidos', cargando || error ? null : partidos.length]].map(([titulo, cantidad]) => <div className="panel cifra" key={titulo}><span>{titulo}</span><strong>{cantidad ?? '—'}</strong>{cantidad === null && <small>No disponible</small>}</div>)}</div>
    <Aviso error={resumen.error} /><EstadoVista cargando={cargando} error={error} reintentar={() => setIntento(intento + 1)} />
    <div className="accesos-rapidos">{[['equipos', 'Inscribir equipos'], ['jugadores', 'Gestionar plantillas'], ['calendario', 'Organizar calendario']].map(([ruta, texto]) => <Link className="boton boton-borde" key={ruta} to={'/ligas/' + ligaId + '/' + ruta}>{texto}</Link>)}</div>
    {!cargando && !error && <>
      <div className="seccion-titulo"><h2>Próximos encuentros</h2><Link to={'/ligas/' + ligaId + '/partidos'}>Ver todos</Link></div>
      {proximos.length ? <div className="rejilla-tarjetas">{proximos.map(p => <PartidoCard key={p.id} partido={p} ligaId={ligaId} />)}</div> : <p className="panel texto-suave">No hay encuentros programados.</p>}
      <div className="seccion-titulo"><h2>Últimos resultados</h2></div>
      {ultimos.length ? <div className="rejilla-tarjetas">{ultimos.map(p => <PartidoCard key={p.id} partido={p} ligaId={ligaId} />)}</div> : <p className="panel texto-suave">Aún no hay partidos finalizados.</p>}
    </>}
    <div className="seccion-titulo"><h2>Clasificación</h2><Link to={'/ligas/' + ligaId + '/tabla'}>Tabla completa</Link></div>
    <div className="panel tabla-contenedor"><table><thead><tr><th>Pos.</th><th>Equipo</th><th>PJ</th><th>PTS</th></tr></thead><tbody>{resumen.tabla.slice(0, 5).map(f => <tr key={f.equipo_id}><td>{f.posicion}</td><td>{f.nombre}</td><td>{f.PJ}</td><td><strong>{f.PTS}</strong></td></tr>)}</tbody></table>{!resumen.tabla.length && <p className="nota">Sin clasificación disponible.</p>}</div>
  </>
}
export default DashboardPage
