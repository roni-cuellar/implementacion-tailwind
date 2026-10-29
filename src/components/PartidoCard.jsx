import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import partidoService from '../services/partidoService'
import { mensajeError } from '../services/api'
function PartidoCard({ partido, ligaId }) {
  const [marcador, setMarcador] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let vigente = true
    partidoService.marcador(partido.id).then(datos => { if (vigente) setMarcador(datos) })
      .catch(e => { if (vigente) setError(mensajeError(e)) })
    return () => { vigente = false }
  }, [partido.id, partido.updated_at])
  const local = partido.participantes?.find(p => p.rol === 'local')?.campeonato_equipo?.equipo?.nombre || 'Local no definido'
  const visitante = partido.participantes?.find(p => p.rol === 'visitante')?.campeonato_equipo?.equipo?.nombre || 'Visitante no definido'
  return <article className="panel partido-card">
    <div className="fila-entre"><span className="etiqueta">JORNADA {partido.jornada}</span><span className={'estado estado-' + partido.estado}>{partido.estado.replaceAll('_', ' ')}</span></div>
    <div className="partido-equipos"><strong>{local}</strong><span className="partido-marcador">{marcador ? marcador.local.goles + ' – ' + marcador.visitante.goles : '—'}</span><strong>{visitante}</strong></div>
    {error && <p className="nota" role="alert">{error}</p>}
    <p className="texto-suave">{partido.fecha_hora ? new Date(partido.fecha_hora).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Fecha por programar'} · {partido.lugar || 'Lugar por definir'}</p>
    <Link className="enlace-texto" to={'/ligas/' + ligaId + '/partidos/' + partido.id}>Ver partido y eventos</Link>
  </article>
}
export default PartidoCard
