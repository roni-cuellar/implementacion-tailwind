import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import usePartidoStore from '../stores/usePartidoStore'
import partidoService from '../services/partidoService'
import PartidoCard from '../components/PartidoCard'
import EstadoVista from '../components/EstadoVista'
import Aviso from '../components/Aviso'
import Confirmacion from '../components/Confirmacion'
import ConfiguracionForm from '../components/ConfiguracionForm'
import Icono from '../components/Icono'

function CalendarioPage() {
  const { ligaId } = useParams()
  const { hash } = useLocation()
  const { partidos, cargando, error, cargar } = usePartidoStore()
  const [confirmar, setConfirmar] = useState(false)
  const [exito, setExito] = useState('')
  useEffect(() => { cargar(ligaId) }, [ligaId, cargar])
  const jornadas = [...new Set(partidos.map(p => p.jornada))].sort((a, b) => a - b)
  const participantes = new Map()
  partidos.forEach(p => p.participantes?.forEach(e => participantes.set(e.campeonato_equipo_id, e.campeonato_equipo?.equipo?.nombre)))
  async function generar() {
    const resultado = await partidoService.generar(ligaId)
    setExito('Calendario generado: ' + resultado.jornadas + ' jornadas y ' + resultado.partidos_creados + ' partidos.')
    await cargar(ligaId)
  }
  return <>
    <div className="cabecera-pagina"><div><h1>Calendario</h1><p className="texto-suave">Configura las vueltas y organiza los encuentros de tu liga.</p></div>
      <button className="boton boton-verde" disabled={cargando || !!error || partidos.length > 0} onClick={() => setConfirmar(true)}>Generar calendario</button></div>
    <Aviso exito={exito} />
    <details className="panel ajustes-calendario" id="configuracion" open={hash === '#configuracion' ? true : undefined}><summary>Configuración del campeonato<Icono nombre="mas" /></summary><ConfiguracionForm ligaId={ligaId} hayPartidos={partidos.length > 0} /></details>
    {partidos.length > 0 && <p className="nota">Ya hay partidos registrados. Abre uno para programarlo.</p>}
    <EstadoVista cargando={cargando} error={error} vacio={!partidos.length} reintentar={() => cargar(ligaId)} titulo="No hay partidos registrados" texto="Inscribe al menos dos equipos y configura las vueltas para generar el calendario." />
    {!cargando && !error && jornadas.map(jornada => {
      const encuentros = partidos.filter(p => p.jornada === jornada)
      const usados = new Set(encuentros.flatMap(p => p.participantes?.map(e => e.campeonato_equipo_id) || []))
      const sinEncuentro = [...participantes].filter(([id]) => !usados.has(id))
      return <section className="jornada-seccion" key={jornada}><div className="fila-entre"><h2>Jornada {jornada}</h2><span className="texto-suave">{encuentros.length} encuentro(s)</span></div>
        {participantes.size % 2 === 1 && sinEncuentro.length === 1 && <p className="nota">Sin encuentro: {sinEncuentro[0][1]}.</p>}
        <div className="rejilla-dos">{encuentros.map(partido => <PartidoCard key={partido.id} partido={partido} ligaId={ligaId} />)}</div></section>
    })}
    {confirmar && <Confirmacion titulo="Generar calendario" texto="Se crearán los encuentros con los equipos activos y las vueltas configuradas. ¿Continuar?" onCerrar={() => setConfirmar(false)} onConfirmar={generar} />}
  </>
}
export default CalendarioPage
