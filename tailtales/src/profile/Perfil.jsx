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

export const Perfil = () => {


  let userUid;
  let mediaUrls = [];
  let isEditing = false;
  let currentEditPostId = null;
  let currentImageIndex = 0;
  let currentImages = [];
  
  // Observar cambios de autenticación
  onAuthStateChanged(auth, (user) => {
      if (user) {
          userUid = user.uid;
          loadUserProfile(user.uid);
          //loadUserPosts(user.uid);
          //verifyAndCreateFriendsList(user.uid);
      } else {
          alert('Debe iniciar sesión para ver su perfil.');
          window.location.href = '/login-register';
      }
  });
  
  // Función para cargar el perfil del usuario
  async function loadUserProfile(uid) {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
          const userData = userDoc.data();
          document.getElementById('profile-name').innerText = userData.name;
          document.getElementById('profile-username').innerText = `@${userData.username}`;
          document.getElementById('profile-title-username').innerText = `@${userData.username}`;
          document.getElementById('profile-species').innerText = userData.species;
          document.getElementById('profile-breed').innerText = userData.breed;
          document.getElementById('profile-bio').innerText = userData.bio;
          document.getElementById('profile-location').innerText = userData.location;
          document.getElementById('profile-pic').src = userData.profilePic || '../img/default-profile-image.jpg';
          document.getElementById('profile-age').innerText = `${userData.age} ${userData.age_format === 'years' ? 'años' : 'meses'}`;
  {/**
          // Cargar el número de amigos
          const friendsListDoc = doc(db, "friendsList", uid);
          const friendsListSnapshot = await getDoc(friendsListDoc);
  
          if (friendsListSnapshot.exists()) {
              const friendsData = friendsListSnapshot.data();
              const numFriends = friendsData.friends ? friendsData.friends.length : 0;
              const friendsInfoElement = document.getElementById("friends-info");
  
              friendsInfoElement.textContent = `Friends: ${numFriends}`;
              friendsInfoElement.addEventListener("click", () => {
                  // Redirigir a friends.html con el userId
                  window.location.href = `../friends/friends.html?userId=${uid}`;
              });
          } else {
              document.getElementById("friends-info").textContent = "Friends: 0";
          }
          */}
      }
  }
  
{/**
  // Abrir el modal para crear o editar una publicación
  function openPostModal(postData = null, postId = null) {
      document.getElementById('new-post-modal').style.display = 'block';
      document.getElementById('post-modal-title').innerText = postData ? 'Editar Publicación' : 'Nueva Publicación';
      document.getElementById('media-urls-container').innerHTML = '';
  
      if (postData) {
          document.getElementById('post-description').value = postData.content.text || '';
          mediaUrls = postData.mediaUrls;
          isEditing = true;
          currentEditPostId = postId;
          document.getElementById('publish-post').innerText = 'Guardar cambios';
  
          mediaUrls.forEach((url, index) => {
              const urlContainer = document.createElement("div");
              const urlInput = document.createElement("input");
              urlInput.type = "text";
              urlInput.value = url;
              urlInput.readOnly = true;
              urlInput.classList.add("media-url-field");
  
              const deleteBtn = document.createElement("button");
              deleteBtn.textContent = "Eliminar";
              deleteBtn.classList.add("delete-media-url");
              deleteBtn.onclick = () => {
                  mediaUrls.splice(index, 1);
                  urlContainer.remove();
              };
  
              urlContainer.appendChild(urlInput);
              urlContainer.appendChild(deleteBtn);
              document.getElementById("media-urls-container").appendChild(urlContainer);
          });
      } else {
          isEditing = false;
          currentEditPostId = null;
          mediaUrls = [];
          document.getElementById('post-description').value = '';
          document.getElementById('post-media-url').value = '';
          document.getElementById('publish-post').innerText = 'Publicar';
      }
  }
  
  // Cerrar el modal de publicación
  function closePostModal() {
      document.getElementById('new-post-modal').style.display = 'none';
      isEditing = false;
      currentEditPostId = null;
      mediaUrls = [];
  }
  
  document.getElementById('close-modal').addEventListener('click', closePostModal);
  
  // Abrir modal de vista para ver la publicación en detalle
  function openViewPostModal(postData) {
      currentImages = postData.mediaUrls;
      currentImageIndex = 0;
  
      document.getElementById('view-post-modal').style.display = 'flex';
      document.getElementById('view-post-description').innerText = postData.content.text;
  
      document.getElementById('prev').style.display = currentImages.length > 1 ? 'block' : 'none';
      document.getElementById('next').style.display = currentImages.length > 1 ? 'block' : 'none';
  
      updateCarouselImage();
  }
  
  // Actualizar la imagen del carrusel en el modal
  function updateCarouselImage() {
      document.getElementById('view-post-image').src = currentImages[currentImageIndex];
  }
  
  // Navegar a la imagen anterior en el modal
  document.getElementById('prev').addEventListener('click', () => {
      currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : currentImages.length - 1;
      updateCarouselImage();
  });
  
  // Navegar a la siguiente imagen en el modal
  document.getElementById('next').addEventListener('click', () => {
      currentImageIndex = (currentImageIndex < currentImages.length - 1) ? currentImageIndex + 1 : 0;
      updateCarouselImage();
  });
  
  // Cerrar el modal de vista
  document.getElementById('close-view-modal').addEventListener('click', () => {
      document.getElementById('view-post-modal').style.display = 'none';
  });
  
  // Publicar o guardar cambios en la publicación
  document.getElementById('publish-post').addEventListener('click', async () => {
      const description = document.getElementById('post-description').value;
      const mediaUrlInput = document.getElementById('post-media-url').value.trim();
  
      // Agregar automáticamente el valor en el campo de URL al array de mediaUrls si no está vacío
      if (mediaUrlInput && !mediaUrls.includes(mediaUrlInput)) {
          mediaUrls.push(mediaUrlInput);
      }
  
      if (mediaUrls.length === 0) {
          alert("Debes agregar al menos una URL de imagen.");
          return;
      }
  
      const postData = {
          petId: userUid,
          content: { text: description || '' },
          mediaUrls: mediaUrls,
          createdAt: serverTimestamp(),
          visibility: 1,
          likesCount: 0,
          sharesCount: 0,
      };
  
      try {
          if (isEditing && currentEditPostId) {
              await updateDoc(doc(db, "posts", currentEditPostId), postData);
              alert("Publicación actualizada exitosamente.");
          } else {
              await addDoc(collection(db, "posts"), postData);
              alert("Publicación creada exitosamente.");
          }
  
          closePostModal();
          loadUserPosts(userUid);
      } catch (error) {
          console.error("Error al publicar:", error);
      }
  });
  
  // Cargar publicaciones del usuario con opción de edición y eliminación
  async function loadUserPosts(uid) {
      const postsSection = document.getElementById('posts-section');
      postsSection.innerHTML = ''; 
  
      const postsQuery = query(collection(db, "posts"), where("petId", "==", uid));
      const postsSnapshot = await getDocs(postsQuery);
  
      postsSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          const postElement = document.createElement('div');
          postElement.classList.add('post-item');
  
          const previewImage = document.createElement('img');
          previewImage.src = postData.mediaUrls[0];
          previewImage.addEventListener('click', () => openViewPostModal(postData));
  
          postElement.appendChild(previewImage);
  
          const description = document.createElement('p');
          description.innerText = postData.content.text;
          postElement.appendChild(description);
  
          const editButton = document.createElement('button');
          editButton.innerText = 'Editar';
          editButton.classList.add('edit-btn');
          editButton.addEventListener('click', () => openPostModal(postData, postDoc.id));
          postElement.appendChild(editButton);
  
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Eliminar';
          deleteButton.addEventListener('click', async () => {
              await deleteDoc(doc(db, "posts", postDoc.id));
              alert('Publicación eliminada');
              loadUserPosts(uid);
          });
          postElement.appendChild(deleteButton);
  
          postsSection.appendChild(postElement);
      });
  }
  
  // Configuración para los eventos del botón de crear nueva publicación
  document.getElementById('new-post-btn').addEventListener('click', () => {
      openPostModal();
  });
  
  // Cargar el evento para el botón de editar perfil
  document.addEventListener('DOMContentLoaded', () => {
      const editProfileBtn = document.getElementById('edit-profile-btn');
      if (editProfileBtn) {
          editProfileBtn.addEventListener('click', () => {
              window.location.href = '../profile/editProfile.html';
          });
      }
  });
  
  // Agregar URL de imagen adicional en el formulario de nueva publicación
  document.getElementById('add-media-url').addEventListener('click', () => {
      const url = document.getElementById('post-media-url').value;
      if (url) {
          mediaUrls.push(url);
          const urlItem = document.createElement('div');
          urlItem.innerText = url;
          document.getElementById('media-urls-container').appendChild(urlItem);
          document.getElementById('post-media-url').value = '';
      }
  });
  
  // Función para verificar y crear friendsList
  async function verifyAndCreateFriendsList(uid) {
      try {
          const friendsListDocRef = doc(db, "friendsList", uid); 
          const friendsListDoc = await getDoc(friendsListDocRef);
  
          if (!friendsListDoc.exists()) {
              await setDoc(friendsListDocRef, {
                  userId: uid,    
                  friends: [],    
                  blocked: []     
              });
              //console.log("Colección friendsList creada para el usuario:", uid);
          } else {
              //console.log("La colección friendsList ya existe para el usuario:", uid);
          }
      } catch (error) {
          console.error("Error al verificar o crear friendsList:", error);
      }
  }
*/}
  return (
    <>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
    <title id='profile-title-username'></title>
    <div className={styles.menuNav}>
    <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
    </div>
    <img src={fotoDePerfil} id='profile-pic' className={styles.fotoPerfil} alt='Foto de perfil'/>
    <div className={styles.infoUser}>
    <h3 className={styles.username} id='profile-username'></h3>
    <h4 className={styles.name} id='profile-name'></h4>
    <button className={styles.botonEditarPerfil}><a href='/editar-perfil'>Editar perfil</a></button>
      <p className={styles.bio} id='profile-bio'></p>
      <img src={apariencia} className={`${styles.icon} ${styles.aparienciaIcon}`}/>
      <p className={styles.especie} id='profile-species'></p>
      <p className={styles.raza} id='profile-breed'></p>
      <img src={nacimiento} className={`${styles.icon} ${styles.nacimientoIcon}`}/>
      <p className={styles.nacimiento} id='profile-age'></p>
      <img src={ubicacion} className={`${styles.icon} ${styles.ubicacionIcon}`}/>
      <p className={styles.ubicacion} id='profile-location'></p>
     </div>
    
    <div className={styles.publicaciones}>
    <img src={publicacion3} className={styles.publicacion}/>
    <img src={publicacion2} className={styles.publicacion}/>
    <img src={publicacion1} className={styles.publicacion}/>
    </div>
    </>
  )
}
