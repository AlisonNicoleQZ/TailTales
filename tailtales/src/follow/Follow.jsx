import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Follow.module.css'
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
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

export const Follow = () => {
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
    authDomain: "tailtales-78e10.firebaseapp.com",
    projectId: "tailtales-78e10",
    storageBucket: "tailtales-78e10.appspot.com",
    messagingSenderId: "365635220712",
    appId: "1:365635220712:web:38f961847c39673e93c55d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


return (
    <>
    <header>
    <title>Follow - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
    <h2 className={styles.tituloSolicitudes}>Solicitudes de seguimiento</h2>
    <div id="profiles-container" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {profiles.length === 0 ? (
        <p>Cargando perfiles...</p>
      ) : (
        profiles.map((profile) => (
          <div
            key={profile.id}
            className="profile-card"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/otherProfile?userId=${profile.id}`)}
          >
            <img
              src={profile.profilePic}
              alt={`${profile.name}'s profile`}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "8px",
              }}
              onError={(e) => {
                e.target.onerror = null; // Evitar loops
                e.target.src = "../img/default-profile-image.jpg";
              }}
            />
            <h3>{profile.name}</h3>
          </div>
        ))
      )}
    </div>
        {/** 
          <h2 className={styles.tituloSolicitudes}>Solicitudes de seguimiento</h2>
            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@nara0802 te mandó solicitud de seguimiento</p><br/>
                    <button className={styles.buttonAceptar}>Aceptar</button>
                    <button className={styles.buttonRechazar}>Rechazar</button>
            </div>
            </div>
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendados</h3>
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoPerfil} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@nara0802</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
        */}
        </section>
    </main>
    </>
  )
}
