import styles from './Follow.module.css'
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
    <img src={logo} className={styles.logo} alt="logo" />
        <nav className={styles.menuNav}>
        <a href='#'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='#'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='#'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='#'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='#'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='./Perfil.jsx'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Solicitudes de seguimiento</h2>
            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@nara0802 te mandó solicitud de seguimiento</p><br/>
                    <button className={styles.buttonAceptar}>Aceptar</button>
                    <button className={styles.buttonRechazar}>Rechazar</button>
            </div>
            </div>
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendados</h3>
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoPerfil} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@nara0802</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
        </section>
    </main>
    </>
  )
}
