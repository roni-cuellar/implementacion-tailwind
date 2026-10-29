import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/branding/logo.png'
import Icono from './Icono'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  function cerrarMenu() { setMenuAbierto(false) }

  return (
    <header className="sticky top-0 z-[5] border-b border-solid border-[#ffffff20] bg-[#0f3d2e] text-white">
      <div className="mx-auto flex min-h-[86px] w-[min(1180px,calc(100%-80px))] items-center gap-8 max-[1000px]:gap-[30px] max-[800px]:min-h-[72px] max-[800px]:w-[calc(100%-40px)] max-[800px]:justify-between max-[800px]:gap-4">
        <Link className="relative block h-16 w-[200px] shrink-0 overflow-hidden max-[800px]:h-14 max-[800px]:w-40" to="/" onClick={cerrarMenu} aria-label="BEESOCC, inicio">
          <img className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 object-contain" src={logo} alt="Logo oficial de BEESOCC" width="1448" height="1086" />
        </Link>
        <button className="hidden items-center gap-3 rounded-[5px] border border-solid border-[#ffffff50] bg-transparent px-3 py-2.5 text-xs text-white transition-colors hover:bg-white/10 max-[800px]:inline-flex" type="button" aria-controls="navegacion-principal"
          aria-expanded={menuAbierto} onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? 'Cerrar' : 'Menú'} <Icono nombre={menuAbierto ? 'cerrar' : 'menu'} />
        </button>
        <nav id="navegacion-principal" aria-label="Navegación principal"
          className={`flex flex-1 items-center justify-between gap-5 max-[800px]:absolute max-[800px]:inset-x-0 max-[800px]:top-full max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-6 max-[800px]:border-b max-[800px]:border-solid max-[800px]:border-[#ffffff20] max-[800px]:bg-[#0f3d2e] max-[800px]:px-5 max-[800px]:py-[25px] ${menuAbierto ? '' : 'max-[800px]:hidden'}`}
          onKeyDown={(evento) => { if (evento.key === 'Escape') cerrarMenu() }}>
          <div className="flex items-center gap-[27px] text-[13px] font-medium max-[1000px]:gap-[18px] max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-0">
            <Link className="transition-colors hover:text-[#a4d7b5] max-[800px]:py-3" to="/" onClick={cerrarMenu}>Inicio</Link>
            <Link className="transition-colors hover:text-[#a4d7b5] max-[800px]:py-3" to="/#caracteristicas" onClick={cerrarMenu}>Características</Link>
            <Link className="transition-colors hover:text-[#a4d7b5] max-[800px]:py-3" to="/#como-funciona" onClick={cerrarMenu}>Cómo funciona</Link>
          </div>
          <div className="flex items-center gap-[27px] text-[13px] font-medium max-[1000px]:gap-[18px] max-[800px]:justify-between max-[800px]:border-t max-[800px]:border-solid max-[800px]:border-[#ffffff20] max-[800px]:pt-5">
            <Link className="transition-colors hover:text-[#a4d7b5]" to="/login" onClick={cerrarMenu}>Iniciar sesión</Link>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[10px] border border-solid border-transparent bg-white px-[18px] py-2.5 text-center text-sm leading-[1.3] font-semibold text-[#0f3d2e] transition-colors hover:bg-[#e5f5e9]" to="/registro" onClick={cerrarMenu}>Registrarse</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
export default Navbar
