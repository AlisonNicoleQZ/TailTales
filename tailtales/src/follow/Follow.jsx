import './Follow.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoPerfil from '../img/profile-pic.png';
import fotoPublicacion from '../img/publicacion_feed.png';
import iconLike from '../img/paw-like.svg';
import iconComentarios from '../img/icon-comentarios.svg';

export const Follow = () => {
  return (
    <>
    <header>
    <title>Follow - TailTales</title>
    <a><img src={logo} className="logo" alt="logo" /></a>
        <nav className="menu-nav">
        <a href='#'><img src={feed} className="feed" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="buscar" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="notif" alt="Notificaciones" /></a>
    <a href='#'><img src={amistades} className="amistades" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="publicar" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="perfil" alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
            <h2 className='titulo-solicitudes'>Solicitudes de seguimiento</h2>
            <div id="profiles-request-container">
                <div className='request'>
                    <img className='profile-pic' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='texto-solicitud'>@nara0802 te mandó solicitud de seguimiento</p><br/>
                    <button className='button-aceptar'>Aceptar</button>
                    <button className='button-rechazar'>Rechazar</button>
            </div>
            </div>
        </section>
        <section id="users-list">
            <h3 className='titulo-recomendados'>Recomendados</h3>
            <div id="profiles-container">
            <img className='profile-pic-recomendados' src={fotoPerfil} alt="Imagen de perfil"/>
            <p className='username-recomendado'>@nara0802</p><br/>
            <button className='button-seguir'>Seguir</button>
            </div>
        </section>
    </main>
    </>
  )
}
