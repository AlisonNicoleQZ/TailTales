import React from 'react'
import './Perfil.css';

import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
//import amistades from '../img/camara.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoDePerfil from '../img/profile-pic.png';

export const Perfil = () => {
  return (
    <>
    <a href='../gestionUsuarios/Landing.jsx'><img src={logo} className="logo" alt="logo" /></a>

    <div className="menu-nav">
    <a href='#'><img src={feed} className="" alt="Feed" /></a>
    
  {/* 
    
    <a href='#'><img src={buscar} className="" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="" alt="Notificaciones" /></a>
    <a href='#'><img src={publicar} className="" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="" alt="Perfil" /></a>
  */}
    </div>
    <img src={fotoDePerfil} className='foto-perfil' alt='Foto de perfil'/>
    <h3 className='username'>@tigritothecat</h3>
    <button className='boton-editar-perfil'><a href='#'>Editar perfil</a></button>
    <div className='info-user'>
      <p className='bio'>Soy del 10% de gatos que hace un reguero cuando come</p>
      <p className='especie-y-raza'>Gato atigrado</p>
      <p className='nacimiento'>Agosto 2022</p>
      <p className='ubicacion'>Heredia, Costa Rica</p>
      <p className='union'>Se unió en Septiembre del 2024</p>
    </div>
    </>
  )
}
