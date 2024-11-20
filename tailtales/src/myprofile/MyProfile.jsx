import React from 'react'
import styles from './Perfil.module.css'
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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

export const Profile = () => {

// Detectar si el usuario ha iniciado sesión

{/* 
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario autenticado:", user);
    loadUserProfile(user.uid);
  } else {
    alert('Debe iniciar sesión para ver su perfil.');
    window.location.href = '../login/login.html';
  }
});

// Función para formatear la fecha
function formatDate(timestamp) {
  if (timestamp && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('es-ES'); 
  }
  return "Fecha no disponible";
}

// Función para cargar el perfil del usuario
async function loadUserProfile(uid) {
  try {
    console.log("Cargando datos para UID:", uid);
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Datos del usuario:", userData);
      document.getElementById('profile-name').innerText = userData.name;
      document.getElementById('profile-species').innerText = userData.species;
      document.getElementById('profile-breed').innerText = userData.breed;
      document.getElementById('profile-bio').innerText = userData.bio;
      document.getElementById('profile-location').innerText = userData.location;
      document.getElementById('profile-pic').src = userData.profilePic || '../img/default-profile-image.jpg';
      document.getElementById('profile-birth').innerText = formatDate(userData.birth); 
    } else {
      console.warn('No se encontraron datos del usuario con UID:', uid);
      alert('No se encontraron datos del usuario.');
    }
  } catch (error) {
    console.error("Error al cargar el perfil: ", error);
    alert("Hubo un error al cargar el perfil.");
  }
}

// Función para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function() {
  signOut(auth).then(() => {
    alert('Sesión cerrada exitosamente.');
    window.location.href = '../login/login.html';
  }).catch((error) => {
    console.error("Error al cerrar sesión: ", error);
    alert('Error al cerrar sesión.');
  });
});

*/}
  return (
    <>
    <a href='/perfil'><img src={logo} className={styles.logo} alt="logo" /></a>
    <title>Perfil - @tigritothecat</title>
    <a className='salir' href='#'>Salir</a>
    <div className={styles.menuNav}>
    <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
    </div>
    <img src={fotoDePerfil} className={styles.fotoPerfil} alt='Foto de perfil'/>
    <div className={styles.infoUser}>
    <h3 className={styles.username}>@tigritothecat</h3>
      <p className={styles.bio}>Soy del 10% de gatos que hace un reguero cuando come</p>
      <img src={apariencia} className={`${styles.icon} ${styles.aparienciaIcon}`}/>
      <p className={styles.especieYRaza}>Gato atigrado</p>
      <img src={nacimiento} className={`${styles.icon} ${styles.nacimientoIcon}`}/>
      <p className={styles.nacimiento}>Agosto 2022</p>
      <img src={ubicacion} className={`${styles.icon} ${styles.ubicacionIcon}`}/>
      <p className={styles.ubicacion}>Heredia, Costa Rica</p>
      <img src={calendario} className={`${styles.icon} ${styles.calendarioIcon}`}/>
      <p className={styles.union}>Se unió en Septiembre del 2024</p>
    </div>
    
    <div className={styles.publicaciones}>
    <img src={publicacion3} className={styles.publicacion}/>
    <img src={publicacion2} className={styles.publicacion}/>
    <img src={publicacion1} className={styles.publicacion}/>
    </div>
    </>
  )
}
