import React from 'react'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
//import amistades from '../img/camara.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';

export const Perfil = () => {
  return (
    <>
    <a href='../gestionUsuarios/Landing.jsx'><img src={logo} className="logo" alt="logo" /></a>

    <div className="menu-nav">
    <a href='#'><img src={feed} className="icono-menu" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="icono-menu" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="icono-menu" alt="Notificaciones" /></a>
    <a href='#'><img src={publicar} className="icono-menu" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="icono-menu" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="icono-menu" alt="Perfil" /></a>
    </div>
    <img src="" className="profile-pic" alt="Foto de perfil"/>
    </>
  )
}
