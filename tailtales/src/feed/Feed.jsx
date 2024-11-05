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
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                    <img className='story' src={fotoPerfil} alt="Imagen de perfil"/>
                 </div>
            </section>
            <div className='perfil-container'>
            <img className='foto-perfil' src={fotoPerfil} alt="Imagen de perfil"/>
            <h3 className='username'>@tigritothecat</h3>
            </div>
            <section id="posts-feed" class="posts-feed">
               <div id="posts-container">
               <img className='foto-perfil-publicacion' src={fotoPerfil} alt="Imagen de perfil"/> <p>@hcocoa</p>
                 </div>
            </section>
        </div>
    </div>
    </>
  )
}
