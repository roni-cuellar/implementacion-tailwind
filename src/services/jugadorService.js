import api from './api.js'
const jugadorService = {
  listar: async () => (await api.get('/jugadores')).data,
  crear: async datos => (await api.post('/jugadores', datos)).data.jugador,
  actualizar: async (id, datos) => (await api.patch('/jugadores/' + id, datos)).data.jugador,
  eliminar: async id => (await api.delete('/jugadores/' + id)).data,
  plantillas: async inscripcionId => (await api.get('/inscripciones-equipos/' + inscripcionId + '/plantillas')).data,
  inscribir: async (id, datos) => (await api.post('/inscripciones-equipos/' + id + '/plantillas', datos)).data.plantilla,
  actualizarPlantilla: async (id, datos) => (await api.patch('/plantillas/' + id, datos)).data.plantilla,
  eliminarPlantilla: async id => (await api.delete('/plantillas/' + id)).data,
}
export default jugadorService
