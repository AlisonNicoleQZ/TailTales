import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
    loadFriendStories();
    loadUserPosts();
  } else {
    alert('Debe iniciar sesión para ver el feed.');
    window.location.href = '../login/login.html';
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

// Funciones para los botones de navegación

document.getElementById('profile-btn').addEventListener('click', function() {
  window.location.href = '../profile/profile.html';
});

document.getElementById('feed-btn').addEventListener('click', function() {
  window.location.href = '../feed/feed.html';
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
  window.location.href = '../new-post/new-post.html';
});
