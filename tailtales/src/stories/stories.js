import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
    authDomain: "tailtales-78e10.firebaseapp.com",
    projectId: "tailtales-78e10",
    storageBucket: "tailtales-78e10.appspot.com",
    messagingSenderId: "365635220712",
    appId: "1:365635220712:web:38f961847c39673e93c55d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let userUid;

onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
        userUid = user.uid;
    } else {
        alert("Debes iniciar sesión para usar esta función.");
    }
});

const storiesSection = document.createElement('section');
storiesSection.id = 'stories-section';
storiesSection.innerHTML = `
  <div id="active-stories"></div>
`;
document.body.insertBefore(storiesSection, document.querySelector('main'));

// Modal de visualización de las historias
const modal = document.getElementById('story-modal');
const modalImage = document.getElementById('modal-image');
const modalSpotify = document.getElementById('modal-spotify');
const closeModal = document.getElementById('close-modal');
const storiesContainer = document.getElementById('active-stories');

// Cargar historias
async function loadStories() {
    const storiesContainer = document.getElementById('active-stories');
    storiesContainer.innerHTML = '';

    const storiesQuery = query(collection(db, "stories"), where("visibility", "==", 1));
    const storiesSnapshot = await getDocs(storiesQuery);

    storiesSnapshot.forEach((doc) => {
        const story = doc.data();
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-item');
        storyElement.dataset.mediaUrl = story.mediaUrl;
        storyElement.dataset.songUrl = story.songEmbedUrl;
        storyElement.dataset.description = story.description;  // Agregar la descripción al dataset

        storyElement.innerHTML = `
            <img class="story-image" src="${story.mediaUrl}" alt="Estado">
            <div class="story-description">
                <strong>${story.username}</strong>: ${story.description}
            </div>
        `;
        storiesContainer.appendChild(storyElement);
    });
}

// Mostrar el modal al hacer clic en una historia
storiesContainer.addEventListener('click', (e) => {
    const storyItem = e.target.closest('.story-item');
    if (storyItem) {
        const mediaUrl = storyItem.dataset.mediaUrl;
        const songUrl = storyItem.dataset.songUrl;
        const description = storyItem.dataset.description; // Obtener la descripción de la historia

        // Mostrar la descripción sobre la imagen
        const modalDescription = document.getElementById('modal-description');
        if (modalDescription) {  // Asegurarse de que el modal-description exista
            modalDescription.textContent = description;
        }

        // Mostrar la imagen en el modal
        modalImage.src = mediaUrl;

        // Formatear el URL del iframe de Spotify
        if (songUrl) {
            const songEmbedUrl = songUrl.replace('https://open.spotify.com/track/', 'https://open.spotify.com/embed/track/');
            modalSpotify.src = songEmbedUrl;  // Asignar la URL del iframe
        } else {
            modalSpotify.src = '';  // Si no hay canción, vaciar el iframe
        }

        // Mostrar el modal
        modal.style.display = 'flex';
    }
});

// Cerrar el modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalSpotify.src = ''; // Detener la canción al cerrar el modal
});

// Crear una nueva historia
async function createStory() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) return alert("Debes seleccionar una imagen.");

        const storageRef = ref(storage, `stories/${file.name}`);

        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log("Archivo subido exitosamente.");
                return getDownloadURL(snapshot.ref);
            })
            .then(async (mediaUrl) => {
                const songEmbedUrl = await selectSpotifySong();

                // Solicitar descripción
                const description = prompt("Ingresa una descripción para tu estado:");

                // Obtener el nombre de usuario
                const user = getAuth(app).currentUser;
                const username = user ? user.displayName : 'Usuario Anónimo';

                await addDoc(collection(db, "stories"), {
                    mediaUrl,
                    songEmbedUrl: songEmbedUrl || "",
                    description,
                    username,
                    createdAt: serverTimestamp(),
                    visibility: 1,
                });
                alert("Estado creado.");
                loadStories();
            })
            .catch((error) => {
                console.error("Error al subir el archivo:", error);
                alert("Hubo un error al intentar subir el archivo.");
            });
    };
}

// Seleccionar una canción de Spotify
async function selectSpotifySong() {
    const searchQuery = prompt("Ingresa el nombre de la canción:");
    if (!searchQuery) return "";

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
            headers: {
                Authorization: `Bearer ${await getSpotifyToken()}`,
            },
        });
        const data = await response.json();
        const track = data.tracks.items[0];
        return track ? track.external_urls.spotify : "";
    } catch (error) {
        console.error("Error al buscar la canción:", error);
        return "";
    }
}

// Obtener el token de Spotify
async function getSpotifyToken() {
    const clientId = "33b642bc38f94b868d63577c016db3d9";
    const clientSecret = "08515d668a974b90984683d5360f71b7";

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
}

// Eliminar historias expiradas
async function deleteExpiredStories() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const storiesQuery = query(collection(db, "stories"), where("createdAt", "<=", fiveMinutesAgo));
    const storiesSnapshot = await getDocs(storiesQuery);

    storiesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
}

setInterval(deleteExpiredStories, 60000);
document.getElementById('new-story-btn').addEventListener('click', createStory);
loadStories();
