import styles from './Follow.module.css'
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

export const Follow = () => {
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

// Selecciona el contenedor donde se mostrarán los perfiles
const profilesContainer = document.getElementById('profiles-container');

// Cargar los perfiles de la base de datos
/**
async function loadProfiles() {
    const currentUser = auth.currentUser; // Obtén el usuario actual
    const querySnapshot = await getDocs(collection(db, "users"));
    profilesContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos perfiles
    querySnapshot.forEach((doc) => {
        const userData = doc.data();

        // Excluir el perfil del usuario que está logueado
        if (currentUser && doc.id === currentUser.uid) {
            return; // Si el usuario actual es el mismo que el perfil, no lo agregues
        }

        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        // Crea la imagen de perfil
        const profileImg = document.createElement('img');
        profileImg.src = userData.profilePic || '../img/default-profile-image.jpg'; 

        // Asegúrate de que la imagen se esté cargando correctamente
        profileImg.onload = () => {
            console.log('Imagen de perfil cargada:', profileImg.src);
        };
        profileImg.onerror = () => {
            console.error('Error al cargar la imagen de perfil:', profileImg.src);
            profileImg.src = '../img/default-profile-image.jpg'; // Cambia a la imagen por defecto si hay un error
        };

        // Crea el nombre de perfil
        const profileName = document.createElement('h3');
        profileName.textContent = userData.name;

        // Añade el evento para redirigir al perfil de la otra mascota
        profileCard.addEventListener('click', () => {
            window.location.href = `otherProfile.html?userId=${doc.id}`; // Redirige a otherProfile.html con el userId en la URL
        });

        // Agrega la imagen y el nombre al contenedor del perfil
        profileCard.appendChild(profileImg);
        profileCard.appendChild(profileName);
        profilesContainer.appendChild(profileCard);
    });
}
 */
// Ejecuta la función para cargar los perfiles al iniciar la página
onAuthStateChanged(auth, (user) => {
    if (user) {
     //   loadProfiles(); // Solo carga los perfiles si hay un usuario autenticado
    } else {
        // Si no hay un usuario autenticado, puedes manejarlo aquí (por ejemplo, redirigir a la página de inicio de sesión)
        window.location.href = '/login-register'; 
    }
});
  return (
    <>
    <header>
    <title>Follow - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Solicitudes de seguimiento</h2>
            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} src={fotoPerfil} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@nara0802 te mandó solicitud de seguimiento</p><br/>
                    <button className={styles.buttonAceptar}>Aceptar</button>
                    <button className={styles.buttonRechazar}>Rechazar</button>
            </div>
            </div>
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendados</h3>
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} src={fotoPerfil} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@nara0802</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
        </section>
    </main>
    </>
  )
}
