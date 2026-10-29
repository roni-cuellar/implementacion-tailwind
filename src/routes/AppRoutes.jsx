import { useEffect } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DashboardLayout from '../components/DashboardLayout'
import AccesoLayout from '../components/AccesoLayout'
import AplicacionLayout from '../components/AplicacionLayout'
import InicioPage from '../pages/InicioPage'
import LoginPage from '../pages/LoginPage'
import RegistroPage from '../pages/RegistroPage'
import MisLigasPage from '../pages/MisLigasPage'
import CrearLigaPage from '../pages/CrearLigaPage'
import DashboardPage from '../pages/DashboardPage'
import EquiposPage from '../pages/EquiposPage'
import JugadoresPage from '../pages/JugadoresPage'
import PartidosPage from '../pages/PartidosPage'
import PartidoDetallePage from '../pages/PartidoDetallePage'
import CalendarioPage from '../pages/CalendarioPage'
import TablaPage from '../pages/TablaPage'
import EstadisticasPage from '../pages/EstadisticasPage'

function PublicLayout() {
  return <><a className="saltar-contenido" href="#contenido">Saltar al contenido</a><Navbar /><main id="contenido" tabIndex={-1}><Outlet /></main><Footer /></>
}
function AppRoutes() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<InicioPage />} />
      <Route path="*" element={<section className="pagina-provisional contenedor"><p className="etiqueta">404</p><h1>Página no encontrada</h1><Link className="boton boton-verde" to="/mis-ligas">Volver a Mis ligas</Link></section>} />
    </Route>
    <Route element={<AccesoLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
    </Route>
    <Route element={<AplicacionLayout />}>
      <Route path="/mis-ligas" element={<MisLigasPage />} />
      <Route path="/ligas/nueva" element={<CrearLigaPage />} />
      <Route path="/ligas/:ligaId/editar" element={<CrearLigaPage />} />
    </Route>
    <Route path="/ligas/:ligaId" element={<DashboardLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="equipos" element={<EquiposPage />} />
      <Route path="jugadores" element={<JugadoresPage />} />
      <Route path="partidos" element={<PartidosPage />} />
      <Route path="partidos/:partidoId" element={<PartidoDetallePage />} />
      <Route path="calendario" element={<CalendarioPage />} />
      <Route path="tabla" element={<TablaPage />} />
      <Route path="estadisticas" element={<EstadisticasPage />} />
      <Route path="*" element={<section className="panel"><h1>Página no encontrada</h1><Link to="/mis-ligas" className="enlace-texto">Volver a Mis Ligas</Link></section>} />
    </Route>
  </Routes>
}
export default AppRoutes
