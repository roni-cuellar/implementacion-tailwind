import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function RegistroPage() {
  const navegar = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', correo: '', contrasena: '', confirmacion: '' })
  function continuar(evento) {
    evento.preventDefault()
    // No se crean usuarios ni se envían credenciales.
    setDatos({ nombre: '', correo: '', contrasena: '', confirmacion: '' })
    navegar('/mis-ligas', { replace: true })
  }
  function cambiar(campo, valor) { setDatos({ ...datos, [campo]: valor }) }
  return <>
    <h1>Crear cuenta</h1>
    <p className="acceso-subtitulo">Dale forma a tu próxima liga.</p>
    <form onSubmit={continuar} noValidate autoComplete="off">
      <label htmlFor="registro-nombre">Nombre<input id="registro-nombre" autoComplete="off" placeholder="Tu nombre" value={datos.nombre} onChange={e => cambiar('nombre', e.target.value)} /></label>
      <label htmlFor="registro-correo">Correo electrónico<input id="registro-correo" type="email" autoComplete="off" placeholder="nombre@correo.com" value={datos.correo} onChange={e => cambiar('correo', e.target.value)} /></label>
      <label htmlFor="registro-contrasena">Contraseña<input id="registro-contrasena" type="password" autoComplete="off" placeholder="Escribe tu contraseña" value={datos.contrasena} onChange={e => cambiar('contrasena', e.target.value)} /></label>
      <label htmlFor="registro-confirmacion">Confirmar contraseña<input id="registro-confirmacion" type="password" autoComplete="off" placeholder="Repite tu contraseña" value={datos.confirmacion} onChange={e => cambiar('confirmacion', e.target.value)} /></label>
      <button className="boton boton-verde" type="submit">Crear cuenta</button>
    </form>
    <p className="acceso-alternativa">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
  </>
}
export default RegistroPage
