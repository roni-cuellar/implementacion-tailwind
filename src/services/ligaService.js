import api from './api.js'
const ligaService = {
  listar: async () => (await api.get('/campeonatos')).data,
  obtener: async id => (await api.get('/campeonatos/' + id)).data,
  crear: async datos => (await api.post('/campeonatos', datos)).data.campeonato,
  actualizar: async (id, datos) => (await api.patch('/campeonatos/' + id, datos)).data.campeonato,
  eliminar: async id => (await api.delete('/campeonatos/' + id)).data,
  tabla: async id => (await api.get('/campeonatos/' + id + '/tabla-posiciones')).data,
  estadisticas: async (id, tipo) => (await api.get('/campeonatos/' + id + '/estadisticas/' + tipo)).data,
  configuracion: async id => (await api.get('/campeonatos/' + id + '/configuracion')).data,
  crearConfiguracion: async (id, datos) => (await api.post('/campeonatos/' + id + '/configuracion', datos)).data,
  actualizarConfiguracion: async (id, datos) => (await api.patch('/campeonatos/' + id + '/configuracion', datos)).data,
}
export default ligaService
