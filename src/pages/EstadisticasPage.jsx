import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ligaService from '../services/ligaService'
import { mensajeError } from '../services/api'
import EstadoVista from '../components/EstadoVista'

const tipos = { goleadores: 'Goleadores', asistencias: 'Asistencias', amarillas: 'Amarillas', rojas: 'Rojas', faltas: 'Faltas', equipos: 'Equipos' }
function EstadisticasPage() {
  const { ligaId } = useParams()
  const [tipo, setTipo] = useState('goleadores')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setCargando(true); setError(''); setResultados([])
      try { const respuesta = await ligaService.estadisticas(ligaId, tipo); if (vigente) setResultados(respuesta.resultados) }
      catch (e) { if (vigente) setError(mensajeError(e)) }
      finally { if (vigente) setCargando(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, tipo, revision])
  const mayor = Math.max(1, ...resultados.map(r => r.total || 0))
  return <>
    <div className="cabecera-pagina"><div><h1>Estadísticas</h1><p className="texto-suave">Rendimiento del campeonato.</p></div><button className="boton boton-borde" onClick={() => setRevision(r => r + 1)} disabled={cargando}>Actualizar</button></div>
    <div className="pestanas" role="group" aria-label="Tipo de estadística">{Object.entries(tipos).map(([clave, titulo]) => <button key={clave} className={tipo === clave ? 'activa' : ''} aria-pressed={tipo === clave} onClick={() => setTipo(clave)}>{titulo}</button>)}</div>
    <EstadoVista cargando={cargando} error={error} vacio={!resultados.length} reintentar={() => setRevision(r => r + 1)} titulo="Aún no hay estadísticas" texto="Registra eventos para consultar el rendimiento." />
    {!cargando && !error && resultados.length > 0 && <section className="panel"><h2>{tipos[tipo]}</h2><div className="tabla-contenedor"><table><thead><tr><th>Pos.</th><th>{tipo === 'equipos' ? 'Equipo' : 'Jugador'}</th>{tipo === 'equipos' ? <><th>Goles</th><th>Amarillas</th><th>Rojas</th><th>Faltas</th></> : <th>Total</th>}</tr></thead><tbody>
      {resultados.map((r, indice) => <tr key={r.jugador_id || r.equipo_id}><td>{indice + 1}</td><td><strong>{r.nombre} {r.apellido || ''}</strong>{tipo !== 'equipos' && <div className="barra-estadistica" aria-hidden="true"><span style={{ width: (r.total / mayor * 100) + '%' }} /></div>}</td>
        {tipo === 'equipos' ? ['goles', 'amarillas', 'rojas', 'faltas'].map(campo => <td key={campo}>{r[campo]}</td>) : <td className="puntos-tabla">{r.total}</td>}</tr>)}
    </tbody></table></div></section>}
    
  </>
}
export default EstadisticasPage
