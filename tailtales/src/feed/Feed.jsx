import React from 'react'
import styles from './Feed.module.css'
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

export const Feed = () => {
  return (
    <>
    <title>Feed - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
    <div className={styles.container}>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
       <div className="main-feed">
            <section id="friend-stories" className={styles.friendStories}>
                <div id="stories-container" className={styles.storiesContainer}>
                  <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                 </div>
            </section>
            <div className={styles.perfilContainer}>
            <img className={styles.fotoPerfil} src={fotoPerfil} alt="Imagen de perfil"/>
            <h3 className={styles.username}>@tigritothecat</h3>
            </div>
            <section id="posts-feed" className={styles.postsFeed}>
            <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                  <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                  <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
            </section>
        </div>
    </div>
    </>
  )
}
