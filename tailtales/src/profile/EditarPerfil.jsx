import React from 'react';
import styles from './EditarPerfil.module.css'; // Importa el módulo CSS
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
      <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
      <main>
        <title>Editar Perfil - TailTales</title>
        <div className={styles.menuNav}>
          <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </div>

        <form id="edit-profile-form">
          <img src={fotoDePerfil} className={styles.fotoPerfil} alt="Foto de perfil" />
          <input type="file" id="profile-pic-input" accept="image/*" className={styles.inputFile}/>
          <div className={styles.editarInfo}>
            <div>
              <label htmlFor="name">Nombre: </label>
              <input type="text" id="name" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="species">Especie: </label>
              <input type="text" id="species" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="breed">Raza: </label>
              <input type="text" id="breed" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="birth">Cumpleaños: </label>
              <input type="date" id="birth" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="location">Ubicación: </label>
              <input type="text" id="location" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="bio">Biografía: </label>
              <textarea id="bio" rows="3"></textarea>
            </div>
          </div>
          <button className={styles.btnActualizar} type="submit">Actualizar Perfil</button>
        </form>
      </main>
    </>
  );
};
