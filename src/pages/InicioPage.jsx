import { Link } from 'react-router-dom'
import ayuda from '../assets/branding/ayuda.png'
import ayudaCampeonatos from '../assets/branding/ayuda_2.png'
import ayudaEquipos from '../assets/branding/ayuda_3.png'
import ayudaCalendario from '../assets/branding/ayuda_4.png'
import ayudaEstadisticas from '../assets/branding/ayuda_5.png'
import logoSolo from '../assets/branding/logo_solo.png'
import nombreLogo from '../assets/branding/nombre_logo.png'

const caracteristicas = [
  {
    numero: '01',
    titulo: 'Tu campeonato, a tu manera.',
    texto: 'Organiza tus ligas, define las vueltas y configura las reglas de desempate.',
    imagen: ayudaCampeonatos,
    alt: 'Trofeo de BEESOCC junto a un balón y recursos para organizar torneos',
  },
  {
    numero: '02',
    titulo: 'Equipos y jugadores',
    texto: 'Gestiona sus inscripciones, dorsales y posiciones sin perder el historial.',
    imagen: ayudaEquipos,
    alt: 'Jugadores con camisetas de BEESOCC, fichas de inscripción y una formación de equipo',
  },
  {
    numero: '03',
    titulo: 'Calendario y partidos',
    texto: 'Organiza las jornadas, programa los encuentros y sigue cada resultado.',
    imagen: ayudaCalendario,
    alt: 'Calendario de fútbol con un encuentro entre equipos y un silbato',
  },
  {
    numero: '04',
    titulo: 'Tabla de posiciones y estadísticas',
    texto: 'Consulta la clasificación, los goles, las asistencias y las tarjetas del torneo.',
    imagen: ayudaEstadisticas,
    alt: 'Tabla de posiciones y gráficos de estadísticas de un campeonato de fútbol',
  },
]

function InicioPage() {
  return (
    <>
      <section className="hero contenedor" aria-labelledby="titulo-inicio">
        <div className="hero-texto">
          <p className="etiqueta">
            <img className="icono-marca" src={logoSolo} alt="" width="1254" height="1254" />
            LA PASIÓN SE JUEGA. LA LIGA SE ORGANIZA.
          </p>
          <h1 id="titulo-inicio">Menos gestión.<br />Más <span>fútbol.</span></h1>
          <p className="hero-descripcion">
            Organiza equipos, partidos y resultados en un solo lugar.
          </p>
          <div className="grupo-botones">
            <Link className="boton boton-verde" to="/registro">
              Comenzar ahora
            </Link>
            <Link className="boton boton-borde" to="/#caracteristicas">
              Conocer más
            </Link>
          </div>
          <div className="hero-nota">
            <span aria-hidden="true">✓</span> Desde el primer equipo hasta el último silbatazo.
          </div>
        </div>
        <figure className="hero-visual">
          <img
            className="ilustracion-hero"
            src={ayuda}
            alt="Ilustración oficial de BEESOCC con gestión de torneos, partidos, equipos y estadísticas"
            width="1448"
            height="1086"
            fetchPriority="high"
          />
          
        </figure>
      </section>

      <div className="franja-marca">
        <div className="contenedor franja-contenido">
          <span>DEL BARRIO A LA LIGA.</span>
          <span className="franja-linea" />
          <p>La misma pasión. Una mejor organización.</p>
        </div>
      </div>

      <section id="caracteristicas" className="seccion contenedor" aria-labelledby="titulo-caracteristicas">
        <div className="encabezado-seccion">
          <div>
            <p className="etiqueta">UNA PLATAFORMA. TODO EL TORNEO.</p>
            <h2 id="titulo-caracteristicas">Concéntrate en el juego.<br />Ten el resto bajo control.</h2>
          </div>
          <p>Lo que necesitas para organizar tu competencia, desde la inscripción hasta la tabla final.</p>
        </div>
        <div className="rejilla-caracteristicas">
          {caracteristicas.map((caracteristica) => (
            <article className="tarjeta-caracteristica" key={caracteristica.numero}>
              <img
                className="ilustracion-caracteristica"
                src={caracteristica.imagen}
                alt={caracteristica.alt}
                width="1254"
                height="1254"
                loading="lazy"
                decoding="async"
              />
              <div className="tarjeta-texto">
                <span className="numero-caracteristica">{caracteristica.numero}</span>
                <h3>{caracteristica.titulo}</h3>
                <p>{caracteristica.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="seccion seccion-pasos" aria-labelledby="titulo-pasos">
        <div className="contenedor">
          <div className="encabezado-seccion">
            <div>
              <p className="etiqueta">DEL PRIMER PASO AL PITAZO FINAL</p>
              <h2 id="titulo-pasos">Tu próximo campeonato<br />comienza aquí.</h2>
            </div>
            <p>Una forma clara de organizar el fútbol que te mueve.</p>
          </div>
          <div className="rejilla-pasos">
            <article className="paso">
              <span className="numero-paso">01</span>
              <h3>Crea tu campeonato</h3>
              <p>Dale un nombre y define su temporada, formato y configuración.</p>
            </article>
            <article className="paso">
              <span className="numero-paso">02</span>
              <h3>Reúne a tus equipos</h3>
              <p>Inscribe equipos y jugadores. Asigna sus dorsales y posiciones.</p>
            </article>
            <article className="paso">
              <span className="numero-paso">03</span>
              <h3>Que ruede el balón</h3>
              <p>Organiza los partidos, registra los eventos y consulta los resultados.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="contenedor seccion seccion-cta" aria-labelledby="titulo-cta">
        <div className="bloque-cta">
          <div>
            <div className="nombre-marca">
              <img src={nombreLogo} alt="BEESOCC. Todo tu campeonato en un solo lugar." width="1448" height="1086" loading="lazy" />
            </div>
            <p className="etiqueta">TU CANCHA. TU GENTE. TU CAMPEONATO.</p>
            <h2 id="titulo-cta">La próxima gran liga<br />puede ser la tuya.</h2>
            <p>Empieza a darle forma con BEESOCC.</p>
          </div>
          <Link className="boton boton-blanco" to="/registro">
            Comenzar ahora
          </Link>
          <span className="circulo-cta" aria-hidden="true" />
        </div>
      </section>
    </>
  )
}

export default InicioPage
