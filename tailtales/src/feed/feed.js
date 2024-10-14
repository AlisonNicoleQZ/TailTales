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
        loadAllUserProfiles();
    } else {
        alert('Debe iniciar sesión para ver el feed de usuarios.');
        window.location.href = '../login/login.html';
    }
});

// Función para cargar todos los perfiles de usuarios
async function loadAllUserProfiles() {
    try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        displayUserProfiles(userList);
    } catch (error) {
        console.error("Error al cargar los perfiles de usuarios:", error);
    }
}

// Función para mostrar los perfiles de usuarios en el HTML
function displayUserProfiles(users) {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = ''; 

    users.forEach(user => {
        const profileDiv = document.createElement('div');
        profileDiv.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Especie:</strong> ${user.species}</p>
            <p><strong>Raza:</strong> ${user.breed}</p>
            <p><strong>Edad:</strong> ${user.age} años</p>
            <p><strong>Ubicación:</strong> ${user.location}</p>
            <p><strong>Biografía:</strong> ${user.bio}</p>
            <button onclick="viewProfile('${user.id}')">Ver Perfil</button>
            <hr>
        `;
        profilesContainer.appendChild(profileDiv);
    });
}

// Función para ver el perfil de un usuario
function viewProfile(userId) {
    window.location.href = `../profile/profile.html?uid=${userId}`; 
}

// Función para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function() {
    signOut(auth).then(() => {
        alert('Sesión cerrada exitosamente.');
        window.location.href = '../login/login.html';
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
        alert('Error al cerrar sesión.');
    });
});

document.getElementById('profile-btn').addEventListener('click', function() {
    window.location.href = '../profile/profile.html';
  })
