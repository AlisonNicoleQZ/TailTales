import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

async function loadHeader(title) {
    const response = await fetch('../header.html');
    const headerHTML = await response.text();
    document.getElementById("header-container").innerHTML = headerHTML;

    // Establece el título de la página dinámicamente
    document.getElementById("page-title").innerText = title;

    // Asigna eventos a los botones después de cargar el header
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth).then(() => {
            alert('Sesión cerrada exitosamente.');
            window.location.href = '../login/login.html';
        }).catch((error) => {
            console.error("Error al cerrar sesión: ", error);
            alert('Error al cerrar sesión.');
        });
    });

    document.getElementById('feed-btn').addEventListener('click', () => {
        window.location.href = '../feed/feed.html';
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        window.location.href = '../search/search.html';
    });

    document.getElementById('notifications-btn').addEventListener('click', () => {
        window.location.href = '../notifications/notifications.html';
    });

    document.getElementById('follow-btn').addEventListener('click', () => {
        window.location.href = '../follow/follow.html';
    });
    
    document.getElementById('profile-btn').addEventListener('click', () => {
        window.location.href = '../profile/profile.html';
    });
}

// Exporta la función si se utiliza en múltiples archivos
export { loadHeader };


