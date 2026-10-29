import { create } from 'zustand'
import ligaService from '../services/ligaService'
import { mensajeError } from '../services/api'

const useLigaStore = create((set, get) => ({
  ligas: [], liga: null, solicitada: '', cargando: false, error: '',
  cargarLigas: async () => {
    set({ cargando: true, error: '', ligas: [] })
    try { set({ ligas: await ligaService.listar() }) }
    catch (error) { set({ error: mensajeError(error) }) }
    finally { set({ cargando: false }) }
  },
  cargarLiga: async id => {
    set({ liga: null, solicitada: String(id), cargando: true, error: '' })
    try {
      const liga = await ligaService.obtener(id)
      if (get().solicitada === String(id)) set({ liga })
    } catch (error) {
      if (get().solicitada === String(id)) set({ error: mensajeError(error) })
    } finally {
      if (get().solicitada === String(id)) set({ cargando: false })
    }
  },
}))
export default useLigaStore
