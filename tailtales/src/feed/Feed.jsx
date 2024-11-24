import React from 'react'
import styles from './Feed.module.css'
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

export const Feed = () => {

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

// Detectar si el usuario ha iniciado sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario autenticado:", user);
   // loadFriendStories();
   // loadUserPosts();
  } else {
    alert('Debe iniciar sesión para ver el feed.');
    window.location.href = '/login-register';
  }
});
/*
// Función para cargar los estados de los amigos
async function loadFriendStories() {
  const storiesContainer = document.getElementById('stories-container');
  try {
    const storiesSnapshot = await getDocs(collection(db, "stories")); // Colección de historias
    storiesSnapshot.forEach(doc => {
      const storyData = doc.data();
      const storyDiv = document.createElement('div');
      storyDiv.innerHTML = `
        <img src="${storyData.profilePic}" alt="${storyData.name}" />
        <p>${storyData.name}</p>
      `;
      storiesContainer.appendChild(storyDiv);
    });
  } catch (error) {
    console.error("Error al cargar los estados de amigos:", error);
    alert("Hubo un error al cargar los estados de amigos.");
  }
}

// Función para cargar las publicaciones de los usuarios
async function loadUserPosts() {
  const postsContainer = document.getElementById('posts-container');
  try {
    const postsSnapshot = await getDocs(collection(db, "posts")); // Colección de publicaciones
    postsSnapshot.forEach(doc => {
      const postData = doc.data();
      const postDiv = document.createElement('div');
      postDiv.innerHTML = `
        <h3>${postData.name}</h3>
        <img src="${postData.imageUrl}" alt="Imagen de la publicación" />
        <p>${postData.caption}</p>
      `;
      postsContainer.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error al cargar las publicaciones:", error);
    alert("Hubo un error al cargar las publicaciones.");
  }
}*/

  return (
    <>
    <title>Feed - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
    <div className={styles.container}>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
       <div className="main-feed">
            <section id="friend-stories" className={styles.friendStories}>
                <div id="stories-container" className={styles.storiesContainer}>
                  <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                 </div>
            </section>
            <div className={styles.perfilContainer}>
            <a href='/perfil'>
            <img className={styles.fotoPerfil} src={fotoPerfil} alt="Imagen de perfil"/>
            <h3 className={styles.username}>@tigritothecat</h3>
            </a>
            </div>
            <section id="posts-feed" className={styles.postsFeed}>
            <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                  <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                  <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
                <div id="posts-container" className={styles.postsContainer}>
                  <div className={styles.post}>
                  <a href='/otro-perfil'>
                <img className={styles.fotoPerfilPublicacion} src={fotoPerfil} alt="Imagen de perfil post"/>
               <p className={styles.usernamePost}>@hcocoa</p></a>
               <p className={styles.textoPost}>Una foto mía durmiendo bien a gusto.</p>
               <div className={styles.frame}>
               <img className={styles.fotoPost} src={fotoPublicacion} alt="Foto post"/>
               </div>
               <img className={styles.iconLike} src={iconLike} alt="Icono like"/>
               <p className={styles.numeroLikes} > 50</p>
               <p className={styles.numeroComentarios} >30 </p>
               <img className={styles.iconComentarios}  src={iconComentarios} alt="Icono Comentarios"/>
               </div>
                </div>
            </section>
        </div>
    </div>
    </>
  )
}
