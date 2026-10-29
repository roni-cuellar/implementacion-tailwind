import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ligaService from '../services/ligaService'
import { mensajeError } from '../services/api'
import EstadoVista from '../components/EstadoVista'

function TablaPage() {
  const { ligaId } = useParams()
  const [tabla, setTabla] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setCargando(true); setError(''); setTabla([])
      try { const respuesta = await ligaService.tabla(ligaId); if (vigente) setTabla(respuesta.tabla) }
      catch (e) { if (vigente) setError(mensajeError(e)) }
      finally { if (vigente) setCargando(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, revision])
  const columnas = ['PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'PTS']
  const nombres = { PJ: 'Partidos jugados', PG: 'Ganados', PE: 'Empatados', PP: 'Perdidos', GF: 'Goles a favor', GC: 'Goles en contra', DG: 'Diferencia de goles', PTS: 'Puntos' }
  return <>
    <div className="cabecera-pagina"><div><h1>Tabla de posiciones</h1><p className="texto-suave">Solo partidos finalizados.</p></div><button className="boton boton-borde" onClick={() => setRevision(r => r + 1)} disabled={cargando}>Actualizar</button></div>
    <EstadoVista cargando={cargando} error={error} vacio={!tabla.length} reintentar={() => setRevision(r => r + 1)} titulo="No hay equipos en la tabla" texto="Inscribe equipos para comenzar la competición." />
    {!cargando && !error && tabla.length > 0 && <div className="panel tabla-contenedor"><table><caption className="sr-only">Clasificación del campeonato</caption><thead><tr><th>Pos.</th><th>Equipo</th>{columnas.map(c => <th key={c} title={nombres[c]} aria-label={nombres[c]}>{c}</th>)}</tr></thead><tbody>
      {tabla.map(equipo => <tr key={equipo.equipo_id}><td>{equipo.posicion}</td><td><strong>{equipo.nombre}</strong></td>{columnas.map(c => <td className={c === 'PTS' ? 'puntos-tabla' : ''} key={c}>{equipo[c]}</td>)}</tr>)}
    </tbody></table></div>}
  </>
}
export default TablaPage
