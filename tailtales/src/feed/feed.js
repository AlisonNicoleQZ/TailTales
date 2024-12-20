import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, query, where, getDocs, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Función para obtener el nombre de usuario de un usuario
async function getUsername(userId) {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().username || 'Usuario desconocido';
  } else {
    console.error("Usuario no encontrado:", userId);
    return 'Usuario desconocido';
  }
}

// Mostrar modal con detalles de la publicación
function openViewPostModal(postData) {
  const modal = document.getElementById('post-modal');
  const modalImage = document.getElementById('modal-image');
  const modalText = document.getElementById('modal-text');
  const likeBtn = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  const commentsList = document.getElementById('comments-list');

  // Cargar datos de la publicación
  modalImage.src = postData.mediaUrls[0];
  modalText.textContent = postData.content.text || 'Sin descripción';
  likeCount.textContent = postData.likes || 0;

  // Actualizar interacción de "Me gusta"
  likeBtn.onclick = async () => {
      await toggleLike(postData.id);
      const updatedPost = await getPostData(postData.id);
      likeCount.textContent = updatedPost.likes || 0;
  };

  // Cargar comentarios
  loadComments(postData.id);

  // Enviar comentario
  document.getElementById('comment-btn').onclick = async () => {
      const commentInput = document.getElementById('comment-input').value.trim();
      if (commentInput) {
          await addComment(postData.id, commentInput);
          document.getElementById('comment-input').value = '';
          loadComments(postData.id);
      }
  };

  modal.style.display = 'flex';
}

// Cerrar modal
document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('post-modal').style.display = 'none';
});

// Función para renderizar publicaciones
function renderPosts(posts) {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>No se encontraron publicaciones.</p>';
    return;
  }

  posts.forEach((postData) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post-item');

    const author = document.createElement('h5');
    author.innerText = `@${postData.username}`;
    postElement.appendChild(author);

    const previewImage = document.createElement('img');
    previewImage.src = postData.mediaUrls[0];
    previewImage.alt = 'Vista previa';
    previewImage.addEventListener('click', () => openViewPostModal(postData));
    postElement.appendChild(previewImage);

    const description = document.createElement('p');
    description.innerText = postData.content.text;
    postElement.appendChild(description);

    postsContainer.appendChild(postElement);
  });
}

// Función para obtener la lista de amigos de un usuario
async function getFriendsList(userId) {
  const friendDocRef = doc(db, "friendsList", userId);
  const friendDoc = await getDoc(friendDocRef);

  if (friendDoc.exists()) {
    return friendDoc.data().friends || [];
  } else {
    console.error("No se encontró el documento de amigos para el usuario:", userId);
    return [];
  }
}

// Función de búsqueda de publicaciones
async function searchPosts(queryText) {
  const postsQuery = query(collection(db, "posts"));
  const postsSnapshot = await getDocs(postsQuery);

  const posts = [];

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data();
    postData.id = postDoc.id;

    const username = await getUsername(postData.petId);
    postData.username = username;

    const postText = postData.content?.text || '';

    if (
      postText.toLowerCase().includes(queryText.toLowerCase()) ||
      username.toLowerCase().includes(queryText.toLowerCase())
    ) {
      posts.push(postData);
    }
  }

  return posts;
}

// Obtener datos de la publicación
async function getPostData(postId) {
  const postDoc = await getDoc(doc(db, "posts", postId));
  return postDoc.exists() ? postDoc.data() : null;
}

// Cambiar estado de "Me gusta"
async function toggleLike(postId) {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para dar 'Me gusta'.");
    return;
  }

  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);

  if (postDoc.exists()) {
    const postData = postDoc.data();
    const likes = postData.likes || 0;
    const likedBy = postData.likedBy || [];  // Lista de usuarios que dieron "Me gusta"

    // Verificar si el usuario actual ya ha dado "Me gusta"
    const userIndex = likedBy.indexOf(user.uid);

    if (userIndex === -1) {
      // Si no ha dado "Me gusta", agregar al arreglo y aumentar el número de "Me gusta"
      likedBy.push(user.uid);
      await updateDoc(postRef, { 
        likes: likes + 1, 
        likedBy: likedBy 
      });
    } else {
      // Si ya ha dado "Me gusta", quitarlo y disminuir el número de "Me gusta"
      likedBy.splice(userIndex, 1);
      await updateDoc(postRef, { 
        likes: likes - 1, 
        likedBy: likedBy 
      });
    }
  }
}

// Cargar comentarios
async function loadComments(postId) {
  const commentsRef = collection(db, "posts", postId, "comments");
  const commentsSnapshot = await getDocs(commentsRef);

  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';

  commentsSnapshot.forEach((commentDoc) => {
      const commentData = commentDoc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `${commentData.username}: ${commentData.text}`;
      commentsList.appendChild(listItem);
  });
}

// Agregar comentario
async function addComment(postId, commentText) {
  const user = auth.currentUser;

  if (user) {
    const username = await getUsername(user.uid);

    const commentRef = collection(db, "posts", postId, "comments");
    await addDoc(commentRef, {  // Correcto: usar addDoc() en lugar de add()
      username,
      text: commentText,
      createdAt: new Date(),
    });
  } else {
    alert("Debes iniciar sesión para comentar.");
  }
}

// Agregar el evento de búsqueda
document.getElementById('search-input').addEventListener('input', async () => {
  const queryText = document.getElementById('search-input').value;
  if (queryText.trim()) {
    const searchResults = await searchPosts(queryText);
    renderPosts(searchResults);
  } else {
    loadAllPosts();
  }
});

// Función para cargar todas las publicaciones
async function loadAllPosts() {
  const allPosts = [];
  const user = auth.currentUser;
  if (user) {
    // Cargar publicaciones del propio usuario
    const userPosts = await loadUserPosts(user.uid);
    for (const post of userPosts) {
      const username = await getUsername(user.uid);
      post.username = username;
    }
    allPosts.push(...userPosts);

    // Cargar publicaciones de los amigos
    const friends = await getFriendsList(user.uid);
    for (const friendId of friends) {
      const friendPosts = await loadUserPosts(friendId);

      for (const post of friendPosts) {
        const username = await getUsername(friendId);
        post.username = username;
      }

      allPosts.push(...friendPosts);
    }

    // Ordenar publicaciones por fecha
    allPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    renderPosts(allPosts);
  } else {
    alert('Debe iniciar sesión para ver el feed.');
    window.location.href = '../login/login.html';
  }
}

// Detectar si el usuario ha iniciado sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.uid);
    loadAllPosts();
  } else {
    alert('Debe iniciar sesión para ver el feed.');
    window.location.href = '../login/login.html';
  }
});
