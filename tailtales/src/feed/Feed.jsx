import React from 'react'
import './Feed.css'
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
    <a><img src={logo} className="logo" alt="logo" /></a>
    <div class="container">
        <nav className="menu-nav">
        <a href='#'><img src={feed} className="feed" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="buscar" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="notif" alt="Notificaciones" /></a>
    <a href='#'><img src={amistades} className="amistades" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="publicar" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="perfil" alt="Perfil" /></a>
        </nav>
       <div class="main-feed">
            <section id="friend-stories" class="friend-stories">
                <div id="stories-container">
                  <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                    <div className='story-individual'>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className='story-username'>@hcocoa</p>
                    </div>
                 </div>
            </section>
            <div className='perfil-container'>
            <img className='foto-perfil' src={fotoPerfil} alt="Imagen de perfil"/>
            <h3 className='username'>@tigritothecat</h3>
            </div>
            <section id="posts-feed" class="posts-feed">
            <div id="posts-container">
                  <div className='post'>
               <img className='foto-perfil-publicacion' src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className='username-post'>@hcocoa</p>
               <p className='texto-post'>Una foto mía durmiendo bien a gusto.</p>
               <div className='frame'>
               <img className='foto-post' src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className='icon-like' src={iconLike} alt="Icono like"/>
               <p className='numero-likes'> 50</p>
               <p className='numero-comentarios'>30 </p>
               <img className='icon-comentarios' src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container">
                  <div className='post'>
               <img className='foto-perfil-publicacion' src={fotoPerfil} alt="Imagen de perfil"/>
               <p className='username-post'>@hcocoa</p>
               <p className='texto-post'>Una foto mía durmiendo bien a gusto.</p>
               <div className='frame'>
               <img className='foto-post' src={fotoPublicacion} alt="Imagen de perfil"/>
               </div>
               <img className='icon-like' src={iconLike} alt="Icono like"/>
               <p className='numero-likes'> 50</p>
               <p className='numero-comentarios'>30 </p>
               <img className='icon-comentarios' src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container">
                  <div className='post'>
               <img className='foto-perfil-publicacion' src={fotoPerfil} alt="Imagen de perfil"/>
               <p className='username-post'>@hcocoa</p>
               <p className='texto-post'>Una foto mía durmiendo bien a gusto.</p>
               <div className='frame'>
               <img className='foto-post' src={fotoPublicacion} alt="Imagen de perfil"/>
               </div>
               <img className='icon-like' src={iconLike} alt="Icono like"/>
               <p className='numero-likes'> 50</p>
               <p className='numero-comentarios'>30 </p>
               <img className='icon-comentarios' src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
            </section>
        </div>
    </div>
    </>
  )
}
