import styles from './PublicFollow.module.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoPerfil from '../img/profile-pic.png';
import fotoAria from '../img/aria10.png';
import fotoTaco from '../img/tacotaco.png';
import fotoHallie from '../img/hcoca.png';
import fotoGalleta from '../img/galletitas_felices.png';
import fotoChispita from '../img/chispita34.png';
import fotoPinkWaffle from '../img/pink_waffle.png';
import fotoPelusacute from '../img/pelusacute.png';
import fotoPublicacion from '../img/publicacion_feed.png';
import iconLike from '../img/paw-like.svg';
import iconComentarios from '../img/icon-comentarios.svg';
import { NavBar } from '../NavBar';

export const PublicFollow = () => {
  return (
    <>
    <header>
    <title>Public Follow - TailTales</title>
    
    <NavBar/>

    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Amistades</h2>
            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoAria} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@aria10 empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>
           {/**
                       <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoTaco} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@tacotaco empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>

            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoHallie} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@hcocoa empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>
            */}
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendaciones</h3>
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoGalleta} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@galletitas_felices</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
            {/**
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoChispita} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@chispita34</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoPinkWaffle} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pink_waffle</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoPelusacute} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pelusacute</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
             */}
        </section>
    </main>
    </>
  )
}