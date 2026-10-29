import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/branding/logo.png'

function AplicacionLayout() {
  return <div className="aplicacion-layout">
    <a className="saltar-contenido" href="#contenido-app">Saltar al contenido</a>
    <header className="aplicacion-cabecera"><div className="contenedor aplicacion-barra">
      <Link className="marca-logo" to="/mis-ligas" aria-label="BEESOCC, Mis ligas"><img src={logo} alt="BEESOCC" width="1448" height="1086" /></Link>
      <nav aria-label="Navegación de la aplicación"><NavLink to="/mis-ligas">Mis ligas</NavLink><Link to="/">Salir</Link></nav>
    </div></header>
    <main id="contenido-app" tabIndex={-1}><Outlet /></main>
  </div>
}
export default AplicacionLayout
