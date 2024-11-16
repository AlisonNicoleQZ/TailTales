import React from 'react'
import './EditarPerfil.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';

import fotoDePerfil from '../img/profile-pic.png';

export const EditarPerfil = () => {
    

  return (
    <>
    <a><img src={logo} className="logo" alt="logo" /></a>
    <main>
        <title>Editar Perfil - TailTales</title>
    <div className="menu-nav">
    
    <a href='#'><img src={feed} className="feed" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="buscar" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="notif" alt="Notificaciones" /></a>
    <a href='#'><img src={amistades} className="amistades" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="publicar" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="perfil" alt="Perfil" /></a>

    </div>

        <form id="edit-profile-form">
            <img src={fotoDePerfil} className='foto-perfil' alt='Foto de perfil'/>
                <input type="file" id="profile-pic-input" accept="image/*"/>
                <div className='editar-info'>
            <div>
                <label for="name">Nombre: </label>
                <input type="text" id="name" required/>
            </div>
            <div className='textBox'>
                <label for="species">Especie: </label>
                <input type="text" id="species" required/>
            </div>
            <div className='textBox'>
                <label for="breed">Raza: </label>
                <input type="text" id="breed" required/>
            </div>
            <div className='textBox'>
                <label for="birth">Cumpleaños: </label>
                <input type="date" id="birth" required/>
            </div>
            <div className='textBox'>
                <label for="location">Ubicación: </label>
                <input type="text" id="location" required/>
            </div>
            <div className='textBox'>
                <label for="bio">Biografía: </label>
                <textarea id="bio" rows="3"></textarea>
            </div>
            </div>
            <button className='btn-actualizar' type="submit">Actualizar Perfil</button>
        </form>
    </main>
    </>
  )
}
