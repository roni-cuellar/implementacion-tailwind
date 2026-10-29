import api from './api.js'
const equipoService = {
  listar: async () => (await api.get('/equipos')).data,
  crear: async datos => (await api.post('/equipos', datos)).data.equipo,
  actualizar: async (id, datos) => (await api.patch('/equipos/' + id, datos)).data.equipo,
  eliminar: async id => (await api.delete('/equipos/' + id)).data,
  inscripciones: async ligaId => (await api.get('/campeonatos/' + ligaId + '/inscripciones-equipos')).data,
  inscribir: async (ligaId, equipoId) => (await api.post('/campeonatos/' + ligaId + '/inscripciones-equipos', { equipo_id: Number(equipoId) })).data.inscripcion,
  estadoInscripcion: async (id, estado) => (await api.patch('/inscripciones-equipos/' + id, { estado })).data.inscripcion,
  eliminarInscripcion: async id => (await api.delete('/inscripciones-equipos/' + id)).data,
}
export default equipoService
