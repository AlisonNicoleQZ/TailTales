import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
    loadUserProfile(user.uid);
  } else {
    alert('Debe iniciar sesión para ver su perfil.');
    window.location.href = '../login/login.html';
  }
});

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
      document.getElementById('profile-age').innerText = userData.age + " años";
      document.getElementById('profile-bio').innerText = userData.bio;
      document.getElementById('profile-location').innerText = userData.location;
      document.getElementById('profile-pic').src = userData.profilePic || '../img/default-profile-image.jpg';
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

document.getElementById('likes-btn').addEventListener('click', function() {
  window.location.href = '../likes/likes.html'; 
});

document.getElementById('new-post-btn').addEventListener('click', function() {
  window.location.href = '../post/new-post.html'; 
});

document.getElementById('profile-btn').addEventListener('click', function() {
  window.location.href = '../profile/profile.html'; 
});
