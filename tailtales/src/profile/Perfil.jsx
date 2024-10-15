import React from 'react'
import './Perfil.css'

import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import nacimiento from '../img/nacimiento.svg';
import apariencia from '../img/especie-y-raza.svg';
import ubicacion from '../img/ubicacion.svg';
import calendario from '../img/calendario.svg';

import fotoDePerfil from '../img/profile-pic.png';
import publicacion1 from '../img/publicacion-1.png';
import publicacion2 from '../img/publicacion-2.png';
import publicacion3 from '../img/publicacion-3.png';
export const Perfil = () => {
  return (
    <>
    <a href='#'><img src={logo} className="logo" alt="logo" /></a>
    <title>Perfil - @tigritothecat</title>
    <div className="menu-nav">
    
    <a href='#'><img src={feed} className="feed" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="buscar" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="notif" alt="Notificaciones" /></a>
    <a href='#'><img src={amistades} className="amistades" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="publicar" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="perfil" alt="Perfil" /></a>
  {/* 
    
  */}
    </div>
    <img src={fotoDePerfil} className='foto-perfil' alt='Foto de perfil'/>
    <div className='info-user'>
    <h3 className='username'>@tigritothecat</h3>
    <button className='boton-editar-perfil'><a href='#'>Editar perfil</a></button>
      <p className='bio'>Soy del 10% de gatos que hace un reguero cuando come</p>
      <img src={apariencia} className='icon apariencia-icon'/>
      <p className='especie-y-raza'>Gato atigrado</p>
      <img src={nacimiento} className='icon nacimiento-icon'/>
      <p className='nacimiento'>Agosto 2022</p>
      <img src={ubicacion} className='icon ubicacion-icon'/>
      <p className='ubicacion'>Heredia, Costa Rica</p>
      <img src={calendario} className='icon calendario-icon'/>
      <p className='union'>Se unió en Septiembre del 2024</p>
    </div>
    
    <div className='publicaciones'>
    <img src={publicacion3} className='publicacion'/>
    <img src={publicacion2} className='publicacion'/>
    <img src={publicacion1} className='publicacion'/>
    </div>
    </>
  )
}
