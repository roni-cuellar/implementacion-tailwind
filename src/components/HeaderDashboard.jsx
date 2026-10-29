import { Link } from 'react-router-dom'
import Icono from './Icono'
function HeaderDashboard({ liga, ligaId, abierta, onMenu }) {
  return <header className="header-dashboard">
    <button className="boton-menu-dashboard boton boton-borde" aria-controls="sidebar-liga" aria-expanded={abierta} onClick={onMenu}><Icono nombre="menu" /><span className="sr-only">Menú de la liga</span></button>
    <div className="header-identidad"><span className="etiqueta">CAMPEONATO</span><strong>{liga?.nombre || 'Liga seleccionada'}</strong></div>
    <Link className="boton boton-borde boton-pequeno" to={'/ligas/' + ligaId + '/calendario#configuracion'}>Configuración</Link>
  </header>
}
export default HeaderDashboard
