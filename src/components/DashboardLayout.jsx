import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useLigaStore from '../stores/useLigaStore'
import Sidebar from './Sidebar'
import HeaderDashboard from './HeaderDashboard'
import EstadoVista from './EstadoVista'
function DashboardLayout() {
  const { ligaId } = useParams()
  const { liga, error, cargando, cargarLiga } = useLigaStore()
  const [abierta, setAbierta] = useState(false)
  useEffect(() => { cargarLiga(ligaId) }, [ligaId, cargarLiga])
  const ligaActual = String(liga?.id) === ligaId ? liga : null
  return <div className="dashboard-layout">
    <a className="saltar-contenido" href="#contenido-dashboard">Saltar al contenido</a>
    <Sidebar ligaId={ligaId} abierta={abierta} onCerrar={() => setAbierta(false)} />
    <div className="dashboard-contenido">
      <HeaderDashboard liga={ligaActual} ligaId={ligaId} abierta={abierta} onMenu={() => setAbierta(!abierta)} />
      <main className="dashboard-main" id="contenido-dashboard" tabIndex={-1}>
        {cargando || error || !ligaActual ? <EstadoVista cargando={cargando} error={error} reintentar={() => cargarLiga(ligaId)} /> : <Outlet context={{ liga: ligaActual }} />}
      </main>
    </div>
  </div>
}
export default DashboardLayout
