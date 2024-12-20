import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import logo from './img/logo.svg';
import feed from './img/casa.svg';
import buscar from './img/lupa.svg';
import notif from './img/campana.svg';
import amistades from './img/amistades.svg';
import publicar from './img/camara.svg';
import perfil from './img/perfil.svg';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

export const NavBar = () => {
  const [profile, setProfile] = useState({
    privacySettings: null, // Aseguramos un estado inicial
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await loadUserProfile(currentUser.uid);
      } else {
        alert("Debe iniciar sesión para editar su perfil.");
        window.location.href = "/login-register";
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        alert('No se encontraron datos del usuario.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil: ", error);
      alert("Hubo un error al cargar el perfil.");
    }
  };

  return (
    <>
      <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
      <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
        <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
        <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
        {profile.privacySettings === 0 ? (
          <a href='/solicitudes-publicas'>
            <img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" />
          </a>
        ) : (
          <a href='/solicitudes'>
            <img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" />
          </a>
        )}
        <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
        <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
      </nav>
    </>
  );
};
