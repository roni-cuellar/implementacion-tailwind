import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useLigaStore from '../stores/useLigaStore'
import ligaService from '../services/ligaService'
import LigaCard from '../components/LigaCard'
import EstadoVista from '../components/EstadoVista'
import Confirmacion from '../components/Confirmacion'
import Aviso from '../components/Aviso'

function MisLigasPage() {
  const { ligas, cargando, error, cargarLigas } = useLigaStore()
  const [eliminar, setEliminar] = useState(null)
  const [mensaje, setMensaje] = useState(useLocation().state?.mensaje || '')
  useEffect(() => { cargarLigas() }, [cargarLigas])
  return <section className="pagina-app pagina-ligas contenedor">
    <div className="cabecera-ligas"><div><p className="etiqueta">COMPETENCIAS</p><h1>Mis ligas</h1><p className="texto-suave">Organiza tus campeonatos y sigue cada jornada.</p></div><Link className="boton boton-verde" to="/ligas/nueva">Crear liga</Link></div>
    
    <Aviso exito={mensaje} onCerrar={() => setMensaje('')} />
    <EstadoVista cargando={cargando} error={error} vacio={!ligas.length} titulo="Tu próximo campeonato empieza aquí" texto="Crea una liga y reúne a tus equipos. El resto del torneo comienza desde aquí." className="ligas-vacias" accion={<Link className="boton boton-verde" to="/ligas/nueva">Crear liga</Link>} reintentar={cargarLigas} />
    {!cargando && !error && ligas.length > 0 && <div className="ligas-conteo">{ligas.length} {ligas.length === 1 ? 'campeonato' : 'campeonatos'}</div>}
    {!cargando && !error && ligas.length > 0 && <div className={'rejilla-ligas' + (ligas.length === 1 ? ' rejilla-ligas-una' : '')}>{ligas.map(liga => <LigaCard key={liga.id} liga={liga} onEliminar={setEliminar} />)}</div>}
    {eliminar && <Confirmacion titulo="Eliminar liga" texto={'¿Eliminar “' + eliminar.nombre + '”? Solo se puede eliminar si no tiene equipos inscritos ni partidos.'} onCerrar={() => setEliminar(null)} onConfirmar={async () => { await ligaService.eliminar(eliminar.id); await cargarLigas(); setMensaje('Liga eliminada correctamente.') }} />}
  </section>
}
export default MisLigasPage
