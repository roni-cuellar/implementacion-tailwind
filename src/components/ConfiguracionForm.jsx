import { useEffect, useState } from 'react'
import ligaService from '../services/ligaService'
import { mensajeError } from '../services/api'
import Aviso from './Aviso'
import EstadoVista from './EstadoVista'

const periodos = { inicio_inscripciones: 'Inicio de inscripciones', fin_inscripciones: 'Fin de inscripciones', inicio_transferencias: 'Inicio de transferencias', fin_transferencias: 'Fin de transferencias' }
function ConfiguracionForm({ ligaId, hayPartidos }) {
  const [datos, setDatos] = useState(null)
  const [guardada, setGuardada] = useState(false)
  const [revision, setRevision] = useState(0)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)
  useEffect(() => {
    let vigente = true
    async function consultar() {
      setDatos(null); setError('')
      try {
        const respuesta = await ligaService.configuracion(ligaId)
        if (!vigente) return
        const configuracion = { ...respuesta.configuracion }
        for (const campo of Object.keys(periodos)) configuracion[campo] = configuracion[campo]?.slice(0, 10) || ''
        setDatos(configuracion); setGuardada(respuesta.guardada)
      } catch (e) { if (vigente) setError(mensajeError(e)) }
    }
    consultar()
    return () => { vigente = false }
  }, [ligaId, revision])
  async function guardar(evento) {
    evento.preventDefault(); setError(''); setExito('')
    for (const tipo of ['inscripciones', 'transferencias']) {
      if (datos['inicio_' + tipo] && datos['fin_' + tipo] && datos['fin_' + tipo] < datos['inicio_' + tipo]) {
        setError('La fecha final de ' + tipo + ' no puede ser anterior al inicio.'); return
      }
    }
    setGuardando(true)
    const valores = { numero_vueltas: Number(datos.numero_vueltas), orden_desempate: datos.orden_desempate }
    for (const campo of Object.keys(periodos)) valores[campo] = datos[campo] || null
    try {
      if (guardada) await ligaService.actualizarConfiguracion(ligaId, valores)
      else await ligaService.crearConfiguracion(ligaId, valores)
      setGuardada(true); setExito('Configuración guardada correctamente.')
    } catch (e) { setError(mensajeError(e)) }
    finally { setGuardando(false) }
  }
  return <section className="configuracion-panel">
    <div className="fila-entre"><h2>Formato y periodos</h2>{datos && !guardada && <span className="estado">Sin guardar</span>}</div>
    {!datos ? <EstadoVista cargando={!error} error={error} reintentar={() => setRevision(r => r + 1)} /> : <>
      {hayPartidos && <p className="nota">Las vueltas están bloqueadas porque ya hay partidos{!guardada ? ' y no se puede crear una configuración nueva' : ''}.</p>}
      <form className="formulario" onSubmit={guardar}>
        <div className="campos-dobles">
          <label>Vueltas<select value={datos.numero_vueltas} disabled={hayPartidos || guardando} onChange={e => setDatos({ ...datos, numero_vueltas: e.target.value })}><option value="1">Una vuelta</option><option value="2">Dos vueltas · ida y regreso</option></select></label>
          <label>Orden de desempate<select value={datos.orden_desempate} disabled={guardando} onChange={e => setDatos({ ...datos, orden_desempate: e.target.value })}>
            <option value="puntos,diferencia_goles,goles_favor">Puntos, diferencia de goles, goles a favor</option>
            <option value="puntos,goles_favor,diferencia_goles">Puntos, goles a favor, diferencia de goles</option>
          </select></label>
          {Object.entries(periodos).map(([campo, etiqueta]) => <label key={campo}>{etiqueta}<input type="date" value={datos[campo]} onInput={e => setDatos({ ...datos, [campo]: e.target.value })} onChange={e => setDatos({ ...datos, [campo]: e.target.value })} /></label>)}
        </div>
        <Aviso error={error} exito={exito} />
        <div><button className="boton boton-verde" disabled={guardando || (hayPartidos && !guardada)}>{guardando ? 'Guardando…' : 'Guardar configuración'}</button></div>
      </form>
    </>}
  </section>
}
export default ConfiguracionForm
