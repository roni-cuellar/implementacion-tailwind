import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/branding/logo.png'

function AccesoLayout() {
  return <div className="acceso-layout">
    <main className="acceso-contenido" id="contenido">
      <section className="acceso-panel" aria-label="Acceso a BEESOCC">
        <Link className="marca-logo" to="/" aria-label="BEESOCC, inicio"><img src={logo} alt="BEESOCC" width="1448" height="1086" /></Link>
        <div className="acceso-formulario"><Outlet /></div>
        <Link className="acceso-volver" to="/">Volver al inicio</Link>
      </section>
    </main>
  </div>
}
export default AccesoLayout
