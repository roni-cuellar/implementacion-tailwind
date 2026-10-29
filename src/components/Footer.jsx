import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/branding/logo.png'

function Footer() {
  const [anio] = useState(() => new Date().getFullYear())
  return (
    <footer className="bg-[#0f3d2e] text-white">
      <div className="mx-auto flex w-[min(1180px,calc(100%-80px))] items-center justify-between gap-[30px] py-[46px] max-[800px]:w-[calc(100%-40px)] max-[800px]:flex-wrap">
        <Link className="relative block h-[90px] w-[250px] shrink-0 overflow-hidden" to="/" aria-label="BEESOCC, volver al inicio">
          <img className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 object-contain" src={logo} alt="BEESOCC. Todo tu campeonato en un solo lugar." width="1448" height="1086" loading="lazy" />
        </Link>
        <p className="text-xs text-[#c1d5ca]">El fútbol se vive en la cancha.<br />La organización comienza aquí.</p>
        <Link className="inline-flex items-center gap-2 text-[13px] font-semibold hover:underline hover:underline-offset-[5px]" to="/#como-funciona">Conoce la plataforma</Link>
      </div>
      <div className="mx-auto flex w-[min(1180px,calc(100%-80px))] justify-between gap-5 border-t border-solid border-[#ffffff20] py-[21px] text-[10px] text-[#c1d5ca] max-[800px]:w-[calc(100%-40px)] max-[800px]:flex-wrap max-[800px]:leading-[1.8]">
        <span>© {anio} BEESOCC 2.0</span><span>Hecho para el fútbol local.</span>
      </div>
    </footer>
  )
}
export default Footer
