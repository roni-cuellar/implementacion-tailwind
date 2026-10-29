import { create } from 'zustand'
import partidoService from '../services/partidoService'
import { mensajeError } from '../services/api'
const usePartidoStore = create((set, get) => ({
  partidos: [], ligaId: '', cargando: false, error: '',
  cargar: async ligaId => {
    const id = String(ligaId)
    set({ ligaId: id, partidos: [], cargando: true, error: '' })
    try {
      const partidos = await partidoService.listar(id)
      if (get().ligaId === id) set({ partidos })
    } catch (error) {
      if (get().ligaId === id) set({ error: mensajeError(error) })
    } finally {
      if (get().ligaId === id) set({ cargando: false })
    }
  },
}))
export default usePartidoStore
