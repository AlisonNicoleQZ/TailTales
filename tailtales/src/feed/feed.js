import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Función para cargar las publicaciones de un usuario
async function loadUserPosts(uid) {
  const postsQuery = query(collection(db, "posts"), where("petId", "==", uid));
  const postsSnapshot = await getDocs(postsQuery);

  const posts = [];

  postsSnapshot.forEach((postDoc) => {
    const postData = postDoc.data();
    postData.id = postDoc.id; // Agregar ID del documento
    posts.push(postData);
  });

  return posts; // Devuelve las publicaciones en forma de array
}

// Función para renderizar publicaciones
function renderPosts(posts) {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = ''; // Limpiar el contenedor

  posts.forEach((postData) => {
    // Crear elemento para la publicación
    const postElement = document.createElement('div');
    postElement.classList.add('post-item');

    // Mostrar el nombre de usuario del autor
    const author = document.createElement('h5');
    author.innerText = `@${postData.username}`;
    postElement.appendChild(author);

    // Imagen de vista previa
    const previewImage = document.createElement('img');
    previewImage.src = postData.mediaUrls[0];
    previewImage.alt = 'Vista previa';
    previewImage.addEventListener('click', () => openViewPostModal(postData));
    postElement.appendChild(previewImage);

    // Descripción de la publicación
    const description = document.createElement('p');
    description.innerText = postData.content.text;
    postElement.appendChild(description);

    // Añadir la publicación al contenedor
    postsContainer.appendChild(postElement);
  });
}

// Función para obtener la lista de amigos de un usuario
async function getFriendsList(userId) {
  const friendDocRef = doc(db, "friendsList", userId);
  const friendDoc = await getDoc(friendDocRef);

  if (friendDoc.exists()) {
    return friendDoc.data().friends || []; // Devuelve el array de amigos
  } else {
    console.error("No se encontró el documento de amigos para el usuario:", userId);
    return [];
  }
}

// Detectar si el usuario ha iniciado sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.uid);
    
    const allPosts = [];
    const friends = await getFriendsList(user.uid);

    // Cargar las publicaciones de cada amigo y añadirlas al array general
    for (const friendId of friends) {
      const friendPosts = await loadUserPosts(friendId);

      // Obtener el nombre de usuario de cada publicación
      for (const post of friendPosts) {
        const userDocRef = doc(db, "users", friendId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          post.username = userDoc.data().username;
        } else {
          console.error("Usuario no encontrado:", friendId);
        }
      }

      allPosts.push(...friendPosts);
    }

    // Ordenar todas las publicaciones por 'createdAt' de más reciente a más antiguo
    allPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    // Renderizar las publicaciones ordenadas
    renderPosts(allPosts);
  } else {
    alert('Debe iniciar sesión para ver el feed.');
    window.location.href = '../login/login.html';
  }
});