import api from './api.js'
const partidoService = {
  listar: async ligaId => (await api.get('/campeonatos/' + ligaId + '/partidos')).data,
  obtener: async id => (await api.get('/partidos/' + id)).data,
  crear: async (ligaId, datos) => (await api.post('/campeonatos/' + ligaId + '/partidos', datos)).data.partido,
  actualizar: async (id, datos) => (await api.patch('/partidos/' + id, datos)).data.partido,
  eliminar: async id => (await api.delete('/partidos/' + id)).data,
  generar: async ligaId => (await api.post('/campeonatos/' + ligaId + '/generar-calendario')).data,
  marcador: async id => (await api.get('/partidos/' + id + '/marcador')).data,
  eventos: async id => (await api.get('/partidos/' + id + '/eventos')).data,
  crearEvento: async (id, datos) => (await api.post('/partidos/' + id + '/eventos', datos)).data.evento,
  actualizarEvento: async (id, minuto) => (await api.patch('/eventos/' + id, { minuto: Number(minuto) })).data.evento,
  eliminarEvento: async id => (await api.delete('/eventos/' + id)).data,
}
export default partidoService
