import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/branding/logo.png'
import Icono from './Icono'
const enlaces = [['dashboard', 'Resumen', 'resumen'], ['equipos', 'Equipos', 'equipos'], ['jugadores', 'Jugadores', 'jugadores'], ['partidos', 'Partidos', 'partidos'], ['calendario', 'Calendario', 'calendario'], ['tabla', 'Tabla de posiciones', 'tabla'], ['estadisticas', 'Estadísticas', 'estadisticas']]
function Sidebar({ ligaId, abierta, onCerrar }) {
  return <>
    {abierta && <button className="fixed inset-0 z-[6] border-0 bg-[#071f17ad] min-[761px]:hidden" aria-label="Cerrar navegación" onClick={onCerrar} />}
    <aside className={`fixed inset-y-0 left-0 z-[7] flex w-[235px] flex-col overflow-y-auto bg-[#0f3d2e] p-[17px] text-white transition-transform duration-150 motion-reduce:transition-none min-[761px]:visible min-[761px]:translate-x-0 min-[761px]:max-[900px]:w-[215px] ${abierta ? 'visible translate-x-0' : 'invisible -translate-x-full'}`} id="sidebar-liga" onKeyDown={e => { if (e.key === 'Escape') onCerrar() }}>
      <Link className="relative mb-[25px] block h-[72px] w-[195px] shrink-0 overflow-hidden min-[761px]:max-[900px]:w-[180px]" to="/mis-ligas" onClick={onCerrar}><img className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 object-contain" src={logo} alt="BEESOCC, Mis Ligas" width="1448" height="1086" /></Link>
      <p className="mx-3 mb-3 text-[9px] tracking-[0.15em] text-[#9cbaaa]">CAMPEONATO</p>
      <nav className="grid gap-1.5" aria-label="Módulos de la liga">{enlaces.map(([ruta, texto, icono]) => <NavLink className={({ isActive }) => `group flex items-center gap-3 rounded-[10px] px-[13px] py-3 text-[13px] transition-colors hover:bg-white/10 hover:text-white ${isActive ? 'bg-white/10 text-white shadow-[inset_3px_0_#16a34a]' : 'text-[#c9dcd1]'}`} key={ruta} to={'/ligas/' + ligaId + '/' + ruta} onClick={onCerrar}><Icono className="h-[19px] w-[19px] opacity-80 group-aria-[current=page]:opacity-100" nombre={icono} />{texto}</NavLink>)}</nav>
      <div className="mt-auto grid gap-[17px] px-3 pt-[30px] pb-3 text-xs"><Link className="transition-colors hover:text-green-300" to="/mis-ligas" onClick={onCerrar}>Mis ligas</Link><Link className="transition-colors hover:text-green-300" to="/" onClick={onCerrar}>Salir</Link></div>
    </aside>
  </>
}
export default Sidebar
