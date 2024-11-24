import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
  authDomain: "tailtales-78e10.firebaseapp.com",
  projectId: "tailtales-78e10",
  storageBucket: "tailtales-78e10.appspot.com",
  messagingSenderId: "365635220712",
  appId: "1:365635220712:web:38f961847c39673e93c55d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para cargar notificaciones del usuario
async function loadNotifications(petId) {
  // Crear una consulta ordenada por fecha de creación
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("petId", "==", petId),
    orderBy("createdAt", "desc")
  );

  const notificationsSnapshot = await getDocs(notificationsQuery);

  const notifications = [];
  notificationsSnapshot.forEach((doc) => {
    const notificationData = doc.data();
    notificationData.id = doc.id; // Agregar ID del documento
    notifications.push(notificationData);
  });

  return notifications;
}

// Función para renderizar notificaciones
function renderNotifications(notifications) {
  const notificationsContainer = document.getElementById("notifications-container");
  notificationsContainer.innerHTML = ""; // Limpiar el contenedor

  if (notifications.length === 0) {
    notificationsContainer.innerHTML = "<p>No tienes notificaciones nuevas.</p>";
    return;
  }

  notifications.forEach((notification) => {
    const notificationElement = document.createElement("div");
    notificationElement.classList.add("notification-item");

    // Tipo de notificación
    const typeMessageMap = {
      1: "Solicitud de amistad",
      2: "Comentario",
      3: "Me gusta",
      4: "Compartido",
      5: "Mención",
      6: "Mensaje Directo",
    };
    const typeMessage = typeMessageMap[notification.type] || "Notificación";

    // Mostrar tipo y mensaje
    const message = document.createElement("p");
    message.innerText = `${typeMessage}: ${notification.message}`;
    notificationElement.appendChild(message);

    // Fecha de la notificación
    const date = document.createElement("span");
    const formattedDate = new Date(notification.createdAt?.seconds * 1000).toLocaleString();
    date.innerText = `Fecha: ${formattedDate}`;
    notificationElement.appendChild(date);

    // Añadir estado de lectura
    if (notification.status === 2) {
      notificationElement.classList.add("unread"); // Añadir clase para las no leídas
    }

    notificationsContainer.appendChild(notificationElement);
  });
}

// Detectar si el usuario ha iniciado sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.uid);

    // Aquí obtendrás el `petId` del usuario autenticado
    const petId = user.uid; // Ajustar según cómo manejas `petId`
    const notifications = await loadNotifications(petId);

    renderNotifications(notifications);
  } else {
    alert("Debe iniciar sesión para ver las notificaciones.");
    window.location.href = "../login/login.html";
  }
});
