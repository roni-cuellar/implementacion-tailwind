import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ligaService from '../services/ligaService'
import { mensajeError } from '../services/api'
import Aviso from '../components/Aviso'
import EstadoVista from '../components/EstadoVista'

function CrearLigaPage() {
  const { ligaId } = useParams()
  const navegar = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', descripcion: '', temporada: '', formato: 'todos_contra_todos' })
  const [cargando, setCargando] = useState(Boolean(ligaId))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [errorConsulta, setErrorConsulta] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setCargando(Boolean(ligaId)); setErrorConsulta(''); setError('')
      setDatos({ nombre: '', descripcion: '', temporada: '', formato: 'todos_contra_todos' })
      if (!ligaId) return
      try {
        const liga = await ligaService.obtener(ligaId)
        if (vigente) setDatos({ nombre: liga.nombre, descripcion: liga.descripcion || '', temporada: liga.temporada, formato: liga.formato })
      } catch (e) { if (vigente) setErrorConsulta(mensajeError(e)) }
      finally { if (vigente) setCargando(false) }
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, revision])
  function cambiar(e) { setDatos({ ...datos, [e.target.name]: e.target.value }) }
  async function guardar(e) {
    e.preventDefault()
    setGuardando(true); setError('')
    try {
      const envio = { ...datos, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() || null, temporada: datos.temporada.trim() }
      if (ligaId) await ligaService.actualizar(ligaId, envio)
      else await ligaService.crear(envio)
      navegar('/mis-ligas', { state: { mensaje: ligaId ? 'Liga actualizada correctamente.' : 'Liga creada correctamente.' } })
    } catch (e) { setError(mensajeError(e)); setGuardando(false) }
  }
  return <section className="pagina-app contenedor">
    <Link className="enlace-texto" to="/mis-ligas">Mis ligas</Link>
    <div className="titulo-pagina"><div><h1>{ligaId ? 'Editar liga' : 'Crear liga'}</h1></div></div>
    <EstadoVista cargando={cargando} error={errorConsulta} reintentar={() => setRevision(r => r + 1)} />
    {!cargando && !errorConsulta && <form className="panel formulario-liga" onSubmit={guardar}>
      <Aviso error={error} />
      <label>Nombre<input name="nombre" required maxLength={150} value={datos.nombre} onChange={cambiar} /></label>
      <label>Descripción (opcional)<textarea name="descripcion" value={datos.descripcion} onChange={cambiar} /></label>
      <div className="dos-columnas"><label>Temporada<input name="temporada" required maxLength={50} placeholder="2026" value={datos.temporada} onChange={cambiar} /></label>
      <label>Formato<select name="formato" value={datos.formato} onChange={cambiar}><option value="todos_contra_todos">Todos contra todos</option></select></label></div>
      
      <div className="acciones"><Link className="boton boton-borde" to="/mis-ligas">Cancelar</Link><button className="boton boton-verde" disabled={guardando || (Boolean(ligaId) && !datos.nombre)}>{guardando ? 'Guardando…' : 'Guardar liga'}</button></div>
    </form>}
  </section>
}
export default CrearLigaPage
