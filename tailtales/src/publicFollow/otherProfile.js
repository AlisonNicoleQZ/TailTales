import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
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
const db = getFirestore(app);

// Obtener el ID de usuario de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

// Función para formatear la fecha
function formatDate(timestamp) {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('es-ES'); // Formato de fecha en español
    }
    return "Fecha no disponible";
}

// Cargar los datos del perfil de la base de datos
async function loadProfile() {
    const userDoc = doc(db, "users", userId);
    const docSnapshot = await getDoc(userDoc);

    if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        // Asigna los datos al HTML
        document.getElementById('profile-photo').src = userData.profilePic || '../img/default-profile-image.jpg'; // Usa una imagen por defecto si no hay foto
        document.getElementById('profile-name').textContent = userData.name || "Nombre no disponible";
        document.getElementById('profile-bio').textContent = userData.bio || "Biografía no disponible";
        document.getElementById('profile-location').textContent = userData.location || "Ubicación no disponible";
        
        // Asegúrate de que userData.birth sea un Timestamp
        document.getElementById('profile-birth').innerText = formatDate(userData.birth);
    } else {
        console.error("No se encontró el documento de usuario");
    }
}

// Añadir el evento para el botón de regresar
document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back(); // Regresar a la página anterior
});

// Ejecuta la función para cargar el perfil al iniciar la página
loadProfile();
