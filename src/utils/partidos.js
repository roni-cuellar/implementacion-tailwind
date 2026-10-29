export const estadosPartido = ['programado', 'en_curso', 'suspendido', 'finalizado', 'cancelado']
export const transicionesPartido = {
  programado: ['en_curso', 'cancelado'],
  en_curso: ['suspendido', 'finalizado', 'cancelado'],
  suspendido: ['en_curso', 'cancelado'],
  finalizado: [],
  cancelado: [],
}
export function fechaLocalCampo(fecha) {
  if (!fecha) return ''
  const valor = new Date(fecha)
  if (Number.isNaN(valor.getTime())) return ''
  const dos = n => String(n).padStart(2, '0')
  return valor.getFullYear() + '-' + dos(valor.getMonth() + 1) + '-' + dos(valor.getDate()) + 'T' + dos(valor.getHours()) + ':' + dos(valor.getMinutes())
}
export function nombreParticipante(partido, rol) {
  return partido.participantes?.find(p => p.rol === rol)?.campeonato_equipo?.equipo?.nombre || 'Equipo no definido'
}
