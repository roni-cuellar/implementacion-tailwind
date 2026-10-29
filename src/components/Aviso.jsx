import Icono from './Icono'

function Aviso({ error, exito, onCerrar }) {
  if (!error && !exito) return null
  return <div className={'aviso ' + (error ? 'aviso-error' : 'aviso-exito')} role={error ? 'alert' : 'status'}>
    <Icono nombre={error ? 'alerta' : 'exito'} />
    <p>{error || exito}</p>
    {onCerrar && <button type="button" className="aviso-cerrar" aria-label="Cerrar aviso" onClick={onCerrar}><Icono nombre="cerrar" /></button>}
  </div>
}
export default Aviso
