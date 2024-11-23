import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    updateDoc,
    arrayUnion,
    setDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Selecciona los contenedores donde se mostrarán los perfiles y las solicitudes pendientes
const profilesContainer = document.getElementById('profiles-container');
const pendingContainer = document.getElementById('pending-requests');

// Función para crear una notificación
async function createNotification(petId, type, message, status = 2) {
    try {
        const notificationData = {
            petId,
            type,
            message,
            status,
            createdAt: new Date()
        };
        await addDoc(collection(db, "notifications"), notificationData);
    } catch (error) {
        console.error("Error al crear la notificación:", error);
    }
}

// Función para aceptar una solicitud
async function acceptRequest(requestId, senderId) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Usuario no autenticado.");
        return;
    }

    try {
        // Cambiar el estado de la solicitud a 2 (aceptada)
        const requestDoc = doc(db, "friendRequest", requestId);
        await updateDoc(requestDoc, { status: 2 });

        // Agregar a ambas personas a sus listas de amigos
        const currentUserDoc = doc(db, "friendsList", currentUser.uid);
        const senderUserDoc = doc(db, "friendsList", senderId);

        const currentUserSnapshot = await getDoc(currentUserDoc);
        const senderUserSnapshot = await getDoc(senderUserDoc);

        if (currentUserSnapshot.exists()) {
            await updateDoc(currentUserDoc, {
                friends: arrayUnion(senderId)
            });
        } else {
            await setDoc(currentUserDoc, {
                friends: [senderId],
                blocked: []
            });
        }

        if (senderUserSnapshot.exists()) {
            await updateDoc(senderUserDoc, {
                friends: arrayUnion(currentUser.uid)
            });
        } else {
            await setDoc(senderUserDoc, {
                friends: [currentUser.uid],
                blocked: []
            });
        }

        // Crear notificaciones
        const currentUserData = await getDoc(doc(db, "users", currentUser.uid));
        const senderData = await getDoc(doc(db, "users", senderId));

        if (currentUserData.exists() && senderData.exists()) {
            const currentUsername = currentUserData.data().username || "Usuario";
            const senderUsername = senderData.data().username || "Usuario";

            // Notificación para el usuario que aceptó
            await createNotification(
                currentUser.uid,
                1,
                `Follow request de @${senderUsername} ha sido aceptada`,
                1
            );

            // Notificación para el usuario que fue aceptado
            await createNotification(
                senderId,
                1,
                `@${currentUsername} ha aceptado tu follow request`,
                1
            );
        }

        alert(`Has aceptado la follow request`);
        await loadPendingRequests(); // Actualizar la lista de solicitudes pendientes
    } catch (error) {
        console.error("Error al aceptar la solicitud:", error);
        alert("Ocurrió un error al aceptar la solicitud.");
    }
}

// Función para denegar una solicitud
async function denyRequest(requestId, senderId) {
    try {
        // Cambiar el estado de la solicitud a 3 (rechazada)
        const requestDoc = doc(db, "friendRequest", requestId);
        await updateDoc(requestDoc, { status: 3 });

        alert(`Has denegado la follow request`);

        // Recargar la lista de solicitudes pendientes
        await loadPendingRequests();
    } catch (error) {
        console.error("Error al denegar la solicitud:", error);
        alert("Ocurrió un error al denegar la solicitud.");
    }
}


// Cargar las solicitudes pendientes de la base de datos
async function loadPendingRequests() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Usuario no autenticado.");
        return;
    }

    // Consulta las solicitudes pendientes
    const querySnapshot = await getDocs(query(
        collection(db, "friendRequest"),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", 1), // Solo solicitudes pendientes
        orderBy("createdAt", "desc") // Ordenar por fecha (más reciente primero)
    ));

    pendingContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas solicitudes

    for (const docSnapshot of querySnapshot.docs) {
        const requestId = docSnapshot.id;
        const requestData = docSnapshot.data();

        // Obtiene los datos del remitente (senderId) desde la colección `users`
        const senderDoc = await getDoc(doc(db, "users", requestData.senderId));
        if (!senderDoc.exists()) {
            console.warn(`Usuario con ID ${requestData.senderId} no encontrado.`);
            continue;
        }

        const senderData = senderDoc.data();

        // Crear la tarjeta para la solicitud pendiente
        const pendingCard = document.createElement('div');
        pendingCard.classList.add('profile-card', 'pending-card');

        // Crear la imagen del perfil del remitente
        const profileImg = document.createElement('img');
        profileImg.src = senderData.profilePic || '../img/default-profile-image.jpg';
        profileImg.onerror = () => {
            profileImg.src = '../img/default-profile-image.jpg';
        };

        // Crear el nombre del remitente (username)
        const senderName = document.createElement('h3');
        senderName.textContent = `@${senderData.username || "Usuario"}`;

        // Crear los botones de aceptar y denegar
        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = "Aceptar";
        acceptBtn.addEventListener('click', () => acceptRequest(requestId, requestData.senderId));

        const denyBtn = document.createElement('button');
        denyBtn.textContent = "Denegar";
        denyBtn.addEventListener('click', () => denyRequest(requestId, requestData.senderId));

        // Agregar elementos al contenedor de la solicitud pendiente
        pendingCard.appendChild(profileImg);
        pendingCard.appendChild(senderName);
        pendingCard.appendChild(acceptBtn);
        pendingCard.appendChild(denyBtn);
        pendingContainer.appendChild(pendingCard);
    }
}

// Cargar los perfiles recomendados
async function loadProfiles() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Usuario no autenticado.");
        return;
    }

    const querySnapshot = await getDocs(collection(db, "users"));
    profilesContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos perfiles
    querySnapshot.forEach((doc) => {
        const userData = doc.data();

        // Excluir el perfil del usuario que está logueado
        if (currentUser && doc.id === currentUser.uid) {
            return;
        }

        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        // Crear la imagen de perfil
        const profileImg = document.createElement('img');
        profileImg.src = userData.profilePic || '../img/default-profile-image.jpg';

        profileImg.onerror = () => {
            profileImg.src = '../img/default-profile-image.jpg';
        };

        // Crear el nombre de perfil
        const profileName = document.createElement('h3');
        profileName.textContent = userData.name;

        // Añade el evento para redirigir al perfil de la otra mascota
        profileCard.addEventListener('click', () => {
            window.location.href = `otherProfile.html?userId=${doc.id}`;
        });

        // Agregar elementos al contenedor del perfil
        profileCard.appendChild(profileImg);
        profileCard.appendChild(profileName);
        profilesContainer.appendChild(profileCard);
    });
}

// Ejecutar las funciones al iniciar la página
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadPendingRequests(); // Cargar solicitudes pendientes
        loadProfiles(); // Cargar perfiles recomendados
    } else {
        window.location.href = '../login.html';
    }
});
