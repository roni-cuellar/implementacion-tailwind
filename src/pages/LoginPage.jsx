import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoginPage() {
  const navegar = useNavigate()
  const [datos, setDatos] = useState({ correo: '', contrasena: '' })
  function entrar(evento) {
    evento.preventDefault()
    // Los campos de acceso solo viven en este formulario.
    setDatos({ correo: '', contrasena: '' })
    navegar('/mis-ligas', { replace: true })
  }
  return <>
    <h1>Iniciar sesión</h1>
    <p className="acceso-subtitulo">Tu próximo campeonato te espera.</p>
    <form onSubmit={entrar} noValidate autoComplete="off">
      <label htmlFor="login-correo">Correo electrónico<input id="login-correo" type="email" autoComplete="off" placeholder="nombre@correo.com" value={datos.correo} onChange={e => setDatos({ ...datos, correo: e.target.value })} /></label>
      <label htmlFor="login-contrasena">Contraseña<input id="login-contrasena" type="password" autoComplete="off" placeholder="Escribe tu contraseña" value={datos.contrasena} onChange={e => setDatos({ ...datos, contrasena: e.target.value })} /></label>
      <button className="boton boton-verde" type="submit">Iniciar sesión</button>
    </form>
    <p className="acceso-alternativa">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
  </>
}
export default LoginPage
