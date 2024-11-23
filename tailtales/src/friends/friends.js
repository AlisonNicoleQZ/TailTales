import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayRemove
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
const db = getFirestore(app);

// Obtener el userId de los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

// Verificar si la página anterior es `profile.html` o `profile.js`
const cameFromProfile = document.referrer.includes("profile.html") || document.referrer.includes("profile.js");

if (userId) {
    console.log(`Cargando amigos para el usuario con ID: ${userId}`);
    loadFriends(userId, cameFromProfile); // Pasa la variable `cameFromProfile`
} else {
    console.error("No se proporcionó un userId en la URL.");
    document.getElementById("friends-list").innerHTML = "<p>Error: No se encontró el usuario.</p>";
}

// Función para cargar amigos desde Firestore
async function loadFriends(userId, showUnfollowButton) {
    try {
        const friendsListDoc = doc(db, "friendsList", userId);
        const friendsListSnapshot = await getDoc(friendsListDoc);

        if (friendsListSnapshot.exists()) {
            const friendsData = friendsListSnapshot.data();
            const friends = friendsData.friends || [];

            if (friends.length === 0) {
                document.getElementById("friends-list").innerHTML = "<p>No tiene amigos registrados.</p>";
                return;
            }

            const friendsListElement = document.getElementById("friends-list");
            friendsListElement.innerHTML = ""; // Limpia cualquier contenido previo

            for (const friendId of friends) {
                const friendDoc = await getDoc(doc(db, "users", friendId));

                if (friendDoc.exists()) {
                    const friendData = friendDoc.data();
                    const friendElement = document.createElement("div");
                    friendElement.className = "friend-item";

                    // Agrega el contenido básico
                    friendElement.innerHTML = `
                        <img src="${friendData.profilePic || '../img/default-profile-image.jpg'}" alt="Foto de perfil">
                        <span>@${friendData.username || "Usuario desconocido"}</span>
                    `;

                    // Agrega evento para redirigir al perfil del amigo
                    friendElement.addEventListener("click", () => {
                        window.location.href = `../follow/otherProfile.html?userId=${friendId}`;
                    });

                    // Si viene desde `profile.html`, añade el botón Unfollow
                    if (showUnfollowButton) {
                        const unfollowButton = document.createElement("button");
                        unfollowButton.textContent = "Unfollow";
                        unfollowButton.style.marginLeft = "10px";
                        unfollowButton.addEventListener("click", (event) => {
                            event.stopPropagation(); // Evita que se redirija al hacer clic en el botón
                            removeFriend(userId, friendId); // Llama a la función para eliminar al amigo
                        });
                        friendElement.appendChild(unfollowButton);
                    }

                    friendsListElement.appendChild(friendElement);
                }
            }
        } else {
            document.getElementById("friends-list").innerHTML = "<p>No se encontró la lista de amigos.</p>";
        }
    } catch (error) {
        console.error("Error al cargar la lista de amigos:", error);
        document.getElementById("friends-list").innerHTML = "<p>Error al cargar los datos.</p>";
    }
}

// Función para eliminar a un amigo (Unfollow)
async function removeFriend(userId, friendId) {
    try {
        const currentUserDoc = doc(db, "friendsList", userId);
        const targetUserDoc = doc(db, "friendsList", friendId);

        // Eliminar al amigo de la lista del usuario actual
        await updateDoc(currentUserDoc, {
            friends: arrayRemove(friendId)
        });

        // Eliminar al usuario actual de la lista del amigo
        await updateDoc(targetUserDoc, {
            friends: arrayRemove(userId)
        });

        alert(`Has dejado de seguir al usuario`);

        // Recargar la lista de amigos para reflejar los cambios
        loadFriends(userId, cameFromProfile);
    } catch (error) {
        console.error("Error al intentar dejar de seguir:", error);
        alert("Hubo un error al procesar tu solicitud. Intenta de nuevo.");
    }
}
