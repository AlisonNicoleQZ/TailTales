import React from 'react'
import styles from './NavBar.module.css'
import logo from './img/logo.svg';
import feed from './img/casa.svg';
import buscar from './img/lupa.svg';
import notif from './img/campana.svg';
import amistades from './img/amistades.svg';
import publicar from './img/camara.svg';
import perfil from './img/perfil.svg';

export const NavBar = () => {
  return (
    <>
        <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
            <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
            <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
            <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
            <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
            <a href='/stories'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
            <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </>
  )
}
