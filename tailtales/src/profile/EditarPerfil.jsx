import React from 'react';
import styles from './EditarPerfil.module.css'; // Importa el módulo CSS
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoDePerfil from '../img/profile-pic.png';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

export const EditarPerfil = () => {

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
const storage = getStorage(app);

// Detectar si el usuario ha iniciado sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
//        loadUserProfile(user.uid);
    } else {
        alert('Debe iniciar sesión para editar su perfil.');
        window.location.href = '/login-register';
    }
});

// Función para formatear la fecha
function formatDate(timestamp) {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('es-ES'); // Formato de fecha en español
    }
    return "Fecha no disponible";
}
/**
// Función para cargar el perfil del usuario
async function loadUserProfile(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('name').value = userData.name;
            document.getElementById('species').value = userData.species;
            document.getElementById('breed').value = userData.breed;
            document.getElementById('location').value = userData.location;

            // Formatear la fecha para el campo de tipo date
            if (userData.birth && userData.birth.seconds) {
                const birthDate = new Date(userData.birth.seconds * 1000);
                const formattedDate = birthDate.toISOString().split('T')[0]; // Convertir a formato 'YYYY-MM-DD'
                document.getElementById('birth').value = formattedDate;
            }

            document.getElementById('bio').value = userData.bio;
            document.getElementById('profile-pic').src = userData.profilePic || '../img/default-profile-image.jpg';
        } else {
            alert('No se encontraron datos del usuario.');
        }
    } catch (error) {
        console.error("Error al cargar el perfil: ", error);
        alert("Hubo un error al cargar el perfil.");
    }
}
 
// Función para manejar la actualización del perfil
document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const user = auth.currentUser;
    const name = document.getElementById('name').value;
    const species = document.getElementById('species').value;
    const breed = document.getElementById('breed').value;
    const birth = document.getElementById('birth').value; // Obtener el valor del campo de fecha
    const location = document.getElementById('location').value;
    const bio = document.getElementById('bio').value;

    try {
        const fileInput = document.getElementById('profile-pic-input');
        let profilePicUrl = document.getElementById('profile-pic').src; // Usar la URL existente por defecto

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            profilePicUrl = await getDownloadURL(storageRef); // Obtener URL de la nueva imagen
        }

        // Guardar la fecha como un Timestamp en Firestore
        const birthTimestamp = new Date(birth).getTime() / 1000; // Convertir a Timestamp
        await updateDoc(doc(db, "users", user.uid), {
            name,
            species,
            breed,
            birth: { seconds: birthTimestamp }, // Asegúrate de que aquí estés enviando un Timestamp.
            location,
            bio,
            profilePic: profilePicUrl 
        });
        
        alert("Perfil actualizado exitosamente.");
        window.location.href = '../profile/profile.html'; // Redirigir al perfil después de actualizar
    } catch (error) {
        console.error("Error al actualizar el perfil: ", error);
        alert("Hubo un error al actualizar el perfil.");
    }
});

// Funciones para los botones
document.getElementById('logout-btn').addEventListener('click', function() {
    signOut(auth).then(() => {
        alert('Sesión cerrada exitosamente.');
        window.location.href = '/login-register';
    }).catch((error) => {
        console.error("Error al cerrar sesión: ", error);
        alert('Error al cerrar sesión.');
    });
});
*/
  return (
    <>
      <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
      <main>
        <title>Editar Perfil - TailTales</title>
        <div className={styles.menuNav}>
          <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </div>

        <form id="edit-profile-form">
          <img src={fotoDePerfil} className={styles.fotoPerfil} alt="Foto de perfil" />
          <input type="file" id="profile-pic-input" accept="image/*" className={styles.inputFile}/>
          <div className={styles.editarInfo}>
            <div>
              <label htmlFor="name">Nombre: </label>
              <input type="text" id="name" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="species">Especie: </label>
              <input type="text" id="species" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="breed">Raza: </label>
              <input type="text" id="breed" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="birth">Cumpleaños: </label>
              <input type="date" id="birth" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="location">Ubicación: </label>
              <input type="text" id="location" required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="bio">Biografía: </label>
              <textarea id="bio" rows="3"></textarea>
            </div>
          </div>
          <button className={styles.btnActualizar} type="submit">Actualizar Perfil</button>
        </form>
      </main>
    </>
  );
};
