const trazos = {
  resumen: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  equipos: 'M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6z',
  jugadores: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  partidos: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M9 9h6l2 5-5 4-5-4z M12 3v6 M3.5 15l3.5-1 M20.5 15 17 14 M12 18v3',
  calendario: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2 M7 14h2 M15 14h2 M7 18h2',
  tabla: 'M4 4h16v16H4z M4 9h16 M4 14h16 M9 4v16',
  estadisticas: 'M4 20h16 M7 16V9 M12 16V4 M17 16v-5',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  cerrar: 'M6 6l12 12 M18 6 6 18',
  mas: 'M12 5v14 M5 12h14',
  puntos: 'M5 12h.01 M12 12h.01 M19 12h.01',
  exito: 'M9 12l2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  alerta: 'M12 8v5 M12 16h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
}
function Icono({ nombre, className = '' }) {
  return <svg className={'icono ' + className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={nombre === 'puntos' ? 3 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={trazos[nombre] || trazos.resumen} /></svg>
}
export default Icono
