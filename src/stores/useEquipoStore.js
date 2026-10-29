import { create } from 'zustand'
import equipoService from '../services/equipoService'
import { mensajeError } from '../services/api'
const useEquipoStore = create((set, get) => ({
  equipos: [], inscripciones: [], ligaId: '', cargando: false, error: '',
  cargar: async ligaId => {
    const id = String(ligaId)
    set({ ligaId: id, equipos: [], inscripciones: [], cargando: true, error: '' })
    try {
      const [equipos, inscripciones] = await Promise.all([equipoService.listar(), equipoService.inscripciones(id)])
      if (get().ligaId === id) set({ equipos, inscripciones })
    } catch (error) {
      if (get().ligaId === id) set({ error: mensajeError(error) })
    } finally {
      if (get().ligaId === id) set({ cargando: false })
    }
  },
}))
export default useEquipoStore
