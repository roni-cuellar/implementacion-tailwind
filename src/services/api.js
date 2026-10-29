import axios from 'axios'

const direccion = (import.meta.env?.VITE_API_URL || '/api').replace(/\/+$/, '')
const api = axios.create({
  baseURL: direccion.endsWith('/api') ? direccion : direccion + '/api',
  headers: { Accept: 'application/json' },
  timeout: 20000,
})

function textoError(mensaje) {
  if (typeof mensaje !== 'string' || /SQLSTATE|Illuminate|Stack trace|Exception|vendor[\\/]/i.test(mensaje)) return 'No se pudo completar la operación.'
  const campos = {
    campeonato_equipo_id: 'equipo inscrito', equipo_partido_id: 'equipo participante',
    gol_relacionado_id: 'gol relacionado', campeonato_id: 'campeonato', jugador_id: 'jugador',
    equipo_id: 'equipo', local_id: 'equipo local', visitante_id: 'equipo visitante',
    fecha_nacimiento: 'fecha de nacimiento', fecha_ingreso: 'fecha de ingreso',
    fecha_salida: 'fecha de salida', fecha_hora: 'fecha y hora', numero_vueltas: 'vueltas',
    orden_desempate: 'orden de desempate',
  }
  return mensaje.replace(/\b[a-z_]+\b/g, campo => Object.hasOwn(campos, campo) ? campos[campo] : campo)
}

export function mensajeError(error) {
  if (!error.response) return 'No se pudo conectar. Intenta de nuevo.'
  const { status, data } = error.response
  if (status >= 500) return 'No se pudo completar la solicitud. Intenta de nuevo.'
  if (status === 404) return 'No encontramos este registro.'
  if (status === 422 && data?.errors) return Object.values(data.errors).flat().map(textoError).join(' ')
  if (data?.message) return textoError(data.message)
  if (status === 409) return 'La operación no está permitida para este registro.'
  return 'No se pudo completar la operación.'
}

export function urlImagen(ruta) {
  if (!ruta || typeof ruta !== 'string') return ''
  const texto = ruta.trim()
  if (/^https?:\/\//i.test(texto)) return texto
  if (texto.startsWith('//') || /^[a-z]+:/i.test(texto)) return ''
  const base = api.defaults.baseURL.startsWith('http') ? new URL(api.defaults.baseURL).origin : ''
  return base + (texto.startsWith('/') ? texto : '/storage/' + texto)
}
export default api
