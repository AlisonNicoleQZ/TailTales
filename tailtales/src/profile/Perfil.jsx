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

export const Perfil = () => {

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

// Navegación a otras páginas
document.getElementById('feed-btn').addEventListener('click', function() {
  window.location.href = '../feed/feed.html';
});

document.getElementById('edit-profile-btn').addEventListener('click', function() {
  window.location.href = '../profile/editProfile.html'; 
});

document.getElementById('search-btn').addEventListener('click', function() {
  window.location.href = '../search/search.html'; 
});

document.getElementById('notifications-btn').addEventListener('click', function() {
  window.location.href = '../notifications/notifications.html'; 
});

document.getElementById('follow-btn').addEventListener('click', function() {
  window.location.href = '../follow/follow.html'; 
});

document.getElementById('new-post-btn').addEventListener('click', function() {
  window.location.href = '../post/new-post.html'; 
});

document.getElementById('profile-btn').addEventListener('click', function() {
  window.location.href = '../profile/profile.html'; 
});
*/}
  return (
    <>
    <a href='#'><img src={logo} className="logo" alt="logo" /></a>
    <title>Perfil - @tigritothecat</title>
    <a className='salir' href='#'>Salir</a>
    <div className="menu-nav">
    
    <a href='#'><img src={feed} className="feed" alt="Feed" /></a>
    <a href='#'><img src={buscar} className="buscar" alt="Buscar" /></a>
    <a href='#'><img src={notif} className="notif" alt="Notificaciones" /></a>
    <a href='#'><img src={amistades} className="amistades" alt="Amistades y Seguimientos" /></a>
    <a href='#'><img src={publicar} className="publicar" alt="Publicar" /></a>
    <a href='./Perfil.jsx'><img src={perfil} className="perfil" alt="Perfil" /></a>

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
