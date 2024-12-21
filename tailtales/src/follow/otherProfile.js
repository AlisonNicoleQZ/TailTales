import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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
const auth = getAuth(app);

let currentUserId = null;
let currentImages = [];
let currentImageIndex = 0;

// Verifica el usuario logueado
function checkCurrentUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            initializePage();
        } else {
            alert("No se encontró un usuario logueado. Redirigiendo al inicio de sesión...");
            window.location.href = "../login/login.html";
        }
    });
}

async function initializePage() {
    console.log("initializePage llamada");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId"); // ID del perfil abierto

    // Verifica si el userId es el mismo que el currentUserId
    if (userId === currentUserId) {
        window.location.href = '../profile/profile.html';
        return;
    }

    // Verifica si el currentUserId está bloqueado por el userId
    const targetUserDoc = doc(db, "friendsList", userId);
    const targetUserSnapshot = await getDoc(targetUserDoc);

    if (targetUserSnapshot.exists()) {
        const targetUserData = targetUserSnapshot.data();
        const isBlockedByTargetUser = targetUserData.blocked && targetUserData.blocked.includes(currentUserId);

        if (isBlockedByTargetUser) {
            alert("Perfil de usuario no disponible.");
            window.history.back(); // O redirige a otra página si lo prefieres
            return;
        }
    }


    // Cargar datos del perfil
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
        alert("Perfil no encontrado.");
        window.history.back();
        return;
    }

    const userData = userSnapshot.data();
    const privacySettings = userData.privacySettings;

    // Mostrar los datos básicos del perfil
    displayBasicProfileInfo(userData);

    // Verificar si el usuario actual está en la lista de amigos
    const friendsListDoc = doc(db, "friendsList", userId);
    const friendsListSnapshot = await getDoc(friendsListDoc);

    const isFriend =
        friendsListSnapshot.exists() &&
        friendsListSnapshot.data().friends &&
        friendsListSnapshot.data().friends.includes(currentUserId);

    if (privacySettings === 0 && !isFriend) {
        // Restringir acceso a publicaciones y lista de amigos
        restrictAccess();
    } else {
        // Si no hay restricciones, cargar publicaciones y permitir acceso a la lista de amigos
        loadUserPosts(userId);
        setupFriendsList(userId, friendsListSnapshot);
    }

    // Verificar bloqueos
    checkBlockStatus(userId);

    // Asignar eventos a botones
    const followBtn = document.getElementById("follow-btn");
    followBtn.addEventListener("click", () => toggleFollow(userId));

    const blockBtn = document.getElementById("block-btn");
    blockBtn.addEventListener("click", () => toggleBlock(userId));

    const backBtn = document.getElementById("back-btn");
    backBtn.addEventListener("click", () => {
        window.history.back();
    });
}

// Mostrar la información básica del perfil
function displayBasicProfileInfo(userData) {
    document.getElementById("profile-photo").src = userData.profilePic || "../img/default-profile-image.jpg";
    document.getElementById("profile-name").textContent = userData.name || "Nombre no disponible";
    document.getElementById("profile-username").textContent = userData.username ? `@${userData.username}` : "@usuario_no_disponible";
    document.getElementById("profile-bio").textContent = userData.bio || "Biografía no disponible";
    document.getElementById("profile-location").textContent = userData.location || "Ubicación no disponible";
    const ageText = `${userData.age} ${userData.age_format === "years" ? "años" : "meses"}`;
    document.getElementById("profile-age").innerText = ageText;
}

// Configurar la lista de amigos si es accesible
function setupFriendsList(userId, friendsListSnapshot) {
    const friendsCountElement = document.getElementById("friends-count");

    if (friendsListSnapshot.exists()) {
        const friendsData = friendsListSnapshot.data();
        const numFriends = friendsData.friends ? friendsData.friends.length : 0;
        friendsCountElement.textContent = `Friends: ${numFriends}`;
        friendsCountElement.addEventListener("click", () => {
            window.location.href = `../friends/friends.html?userId=${userId}`;
        });
    } else {
        friendsCountElement.textContent = "Friends: 0";
    }
}

// Restringir acceso a publicaciones y lista de amigos
function restrictAccess() {
    // Mostrar mensajes de privacidad en publicaciones y amigos
    const postsSection = document.getElementById("posts-section");
    postsSection.innerHTML = "<p>Publicaciones no disponibles debido a la configuración de privacidad.</p>";

    const friendsCountElement = document.getElementById("friends-count");
    friendsCountElement.style.cursor = "default";
    friendsCountElement.style.textDecoration = "none";
    friendsCountElement.textContent = "Friends: Privado";
    friendsCountElement.removeEventListener("click", () => {});
}

// Cargar publicaciones del usuario
async function loadUserPosts(userId) {
    console.log("Cargando publicaciones para: " + userId);
    const postsSection = document.getElementById("posts-section");
    postsSection.innerHTML = ""; // Limpiar publicaciones existentes

    const postsQuery = query(collection(db, "posts"), where("petId", "==", userId));
    const postsSnapshot = await getDocs(postsQuery);

    postsSnapshot.forEach((postDoc) => {
        const postData = postDoc.data();
        const postElement = document.createElement("div");
        postElement.classList.add("post-item");

        const carouselPreview = document.createElement("div");
        carouselPreview.classList.add("carousel-preview");

        let previewIndex = 0;

        const previewImage = document.createElement("img");
        previewImage.src = postData.mediaUrls[previewIndex];
        previewImage.addEventListener("click", () => openViewPostModal(postData));

        if (postData.mediaUrls.length > 1) {
            const prevPreview = document.createElement("span");
            prevPreview.classList.add("carousel-control", "prev");
            prevPreview.innerHTML = "&lt;";
            prevPreview.onclick = () => {
                previewIndex = (previewIndex > 0) ? previewIndex - 1 : postData.mediaUrls.length - 1;
                previewImage.src = postData.mediaUrls[previewIndex];
            };

            const nextPreview = document.createElement("span");
            nextPreview.classList.add("carousel-control", "next");
            nextPreview.innerHTML = "&gt;";
            nextPreview.onclick = () => {
                previewIndex = (previewIndex < postData.mediaUrls.length - 1) ? previewIndex + 1 : 0;
                previewImage.src = postData.mediaUrls[previewIndex];
            };

            carouselPreview.appendChild(prevPreview);
            carouselPreview.appendChild(nextPreview);
        }

        carouselPreview.appendChild(previewImage);
        postElement.appendChild(carouselPreview);

        const description = document.createElement("p");
        description.innerText = postData.content.text || "";
        postElement.appendChild(description);

        postsSection.appendChild(postElement);
    });
}

// Inicia la verificación del usuario logueado
//checkCurrentUser();


// Abre el modal de visualización de publicación
function openViewPostModal(postData) {
    currentImages = postData.mediaUrls;
    currentImageIndex = 0;

    const modal = document.getElementById("view-post-modal");
    modal.style.display = "flex";

    document.getElementById("view-post-description").innerText = postData.content.text || "";
    updateCarouselImage();

    document.getElementById("prev").style.display = currentImages.length > 1 ? "block" : "none";
    document.getElementById("next").style.display = currentImages.length > 1 ? "block" : "none";
}

// Actualiza la imagen en el carrusel del modal
function updateCarouselImage() {
    document.getElementById("view-post-image").src = currentImages[currentImageIndex];
}

// Navegar a la imagen anterior en el modal
document.getElementById("prev").addEventListener("click", () => {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1;
    updateCarouselImage();
});

// Navegar a la siguiente imagen en el modal
document.getElementById("next").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateCarouselImage();
});

// Cierra el modal de publicación
document.getElementById("close-view-modal").addEventListener("click", () => {
    document.getElementById("view-post-modal").style.display = "none";
});

// Función para crear una notificación
async function createNotification(petId, type, message, status = 1) {
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

// Alterna entre seguir y dejar de seguir al usuario
async function toggleFollow(userId) {
    try {
        console.log(`Verificando el atributo privacySettings del usuario con ID: ${userId}`);

        // Obtiene los datos del usuario objetivo
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            console.error(`El usuario con ID: ${userId} no existe en la colección users.`);
            alert("El usuario no existe.");
            return;
        }

        const userData = userSnapshot.data();
        const privacySettings = userData.privacySettings;

        console.log(`Usuario verificado: ${userId}`);
        console.log(`Valor de privacySettings: ${privacySettings}`);

        const currentUserDoc = doc(db, "friendsList", currentUserId);
        const targetUserDoc = doc(db, "friendsList", userId);
        const currentUserSnapshot = await getDoc(currentUserDoc);
        const targetUserSnapshot = await getDoc(targetUserDoc);

        // Si privacySettings es 1, crea una solicitud en la colección friendRequest
        if (privacySettings === 0) {
            console.log(`Creando solicitud de amistad para el usuario con ID: ${userId}`);
            const friendRequestData = {
                senderId: currentUserId,
                receiverId: userId,
                status: 0, // Estado: pendiente
                createdAt: new Date() // Marca de tiempo
            };

            // Crear un documento en la colección friendRequest
            await setDoc(doc(collection(db, "friendRequest")), friendRequestData);

            // Crear notificación para el usuario objetivo
            const currentUsername = await getUsernameById(currentUserId);


            await createNotification(
                userId,
                0, // Tipo: Solicitud de amistad
                `@${currentUsername} te envió una solicitud de seguimiento`
            );

            alert("Su follow request fue enviada.");
            checkFriendStatus(userId);
            return;
        }

        // Si privacySettings es 2, gestionar la relación directamente

        if (privacySettings === 1) {
            const isFriend =
                currentUserSnapshot.exists() &&
                currentUserSnapshot.data().friends &&
                currentUserSnapshot.data().friends.includes(userId);

            if (isFriend) {
                // Eliminar el usuario de la lista de amigos de ambos perfiles
                console.log(`El usuario ${userId} ya es amigo. Eliminándolo de la lista de amigos.`);
                await updateDoc(currentUserDoc, {
                    friends: arrayRemove(userId)
                });
                if (targetUserSnapshot.exists()) {
                    await updateDoc(targetUserDoc, {
                        friends: arrayRemove(currentUserId)
                    });
                }
                alert("Has dejado de seguir a este usuario.");
            } else {
                // Agregar el usuario a la lista de amigos de ambos perfiles
                console.log(`El usuario ${userId} no es amigo. Agregándolo a la lista de amigos.`);
                if (currentUserSnapshot.exists()) {
                    await updateDoc(currentUserDoc, {
                        friends: arrayUnion(userId)
                    });
                } else {
                    await setDoc(currentUserDoc, {
                        friends: [userId],
                        blocked: []
                    });
                }

                if (targetUserSnapshot.exists()) {
                    await updateDoc(targetUserDoc, {
                        friends: arrayUnion(currentUserId)
                    });
                } else {
                    await setDoc(targetUserDoc, {
                        friends: [currentUserId],
                        blocked: []
                    });
                }
                console.log("Datos del usuario actual:", currentUserSnapshot.data());

                // Crear notificación para el usuario objetivo
                const currentUsername = await getUsernameById(currentUserId);
                console.log("Datos del usuario actual:", currentUsername);

                await createNotification(
                    userId,
                    0, // Tipo: Seguimiento directo
                    `@${currentUsername} comenzó a seguirte`
                );

                alert("Has comenzado a seguir a este usuario.");
            }

            checkFriendStatus(userId);
        } else {
            console.error(`Configuración de privacidad inválida para el usuario ${userId}.`);
            alert("Configuración de privacidad no válida.");
        }
    } catch (error) {
        console.error(`Error al procesar el seguimiento para el usuario ${userId}:`, error);
        alert("Ocurrió un error. Por favor, intenta de nuevo.");
    }
}

// Función para obtener el username de un usuario por su ID
async function getUsernameById(userId) {
    try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return userData.username || "Usuario"; // Devuelve el username o un valor predeterminado
        } else {
            console.error(`El usuario con ID ${userId} no existe en la colección 'users'.`);
            return "Usuario";
        }
    } catch (error) {
        console.error(`Error al obtener el username para el ID ${userId}:`, error);
        return "Usuario";
    }
}

// Verifica si el usuario ya está en la lista de amigos o tiene una solicitud pendiente
async function checkFriendStatus(userId) {
    try {
        const friendsListDoc = doc(db, "friendsList", currentUserId);
        const friendsListSnapshot = await getDoc(friendsListDoc);

        const followBtn = document.getElementById("follow-btn");

        if (friendsListSnapshot.exists()) {
            const friendsData = friendsListSnapshot.data();
            const isFriend = friendsData.friends && friendsData.friends.includes(userId);

            if (isFriend) {
                followBtn.textContent = "Unfollow";
                return;
            }
        }

        // Si no está en la lista de amigos, verifica la colección friendRequest
        console.log(`Usuario ${userId} no está en la lista de amigos. Verificando solicitudes pendientes...`);

        const friendRequestQuery = query(
            collection(db, "friendRequest"),
            where("senderId", "==", currentUserId),
            where("receiverId", "==", userId),
            where("status", "==", 0) // Estado pendiente
        );
        const friendRequestSnapshot = await getDocs(friendRequestQuery);

        if (!friendRequestSnapshot.empty) {
            console.log(`Solicitud pendiente encontrada entre ${currentUserId} y ${userId}.`);
            followBtn.textContent = "Pending";
        } else {
            console.log(`No hay solicitudes pendientes entre ${currentUserId} y ${userId}.`);
            followBtn.textContent = "Follow";
        }
    } catch (error) {
        console.error("Error al verificar el estado de amistad:", error);
        followBtn.textContent = "Follow"; // Mostrar "Follow" como predeterminado en caso de error
    }
}


// Alterna entre bloquear y desbloquear a un usuario
async function toggleBlock(userId) {
    try {
        const currentUserDoc = doc(db, "friendsList", currentUserId);
        const targetUserDoc = doc(db, "friendsList", userId);

        const currentUserSnapshot = await getDoc(currentUserDoc);
        const targetUserSnapshot = await getDoc(targetUserDoc);

        if (currentUserSnapshot.exists()) {
            const currentUserData = currentUserSnapshot.data();
            const isBlocked = currentUserData.blocked && currentUserData.blocked.includes(userId);

            if (isBlocked) {
                // Desbloquear al usuario
                await updateDoc(currentUserDoc, {
                    blocked: arrayRemove(userId)
                });
                alert(`Has desbloqueado a este usuario.`);
            } else {
                // Bloquear al usuario
                // Eliminar de la lista de amigos del usuario actual
                if (currentUserData.friends && currentUserData.friends.includes(userId)) {
                    await updateDoc(currentUserDoc, {
                        friends: arrayRemove(userId)
                    });
                }

                await updateDoc(currentUserDoc, {
                    blocked: arrayUnion(userId)
                });

                // También eliminar de la lista de amigos del usuario bloqueado
                if (targetUserSnapshot.exists()) {
                    const targetUserData = targetUserSnapshot.data();
                    if (targetUserData.friends && targetUserData.friends.includes(currentUserId)) {
                        await updateDoc(targetUserDoc, {
                            friends: arrayRemove(currentUserId)
                        });
                    }
                }

                alert(`Has bloqueado a este usuario.`);
            }
        } else {
            // Si no existe el documento, crear uno nuevo
            await setDoc(currentUserDoc, {
                blocked: [userId],
                friends: []
            });
            alert(`Has bloqueado a este usuario.`);
        }

        // Actualiza el estado de bloqueo y amistad en la interfaz
        await checkBlockStatus(userId);
        await checkFriendStatus(userId); // Actualiza el botón de Follow/Unfollow
    } catch (error) {
        console.error("Error al bloquear/desbloquear:", error);
        alert("Ocurrió un error. Por favor, intenta de nuevo.");
    }
}



// Verifica si el usuario actual está bloqueado o bloqueó a alguien
async function checkBlockStatus(userId) {
    const friendsListDoc = doc(db, "friendsList", currentUserId);
    const friendsListSnapshot = await getDoc(friendsListDoc);

    const blockBtn = document.getElementById("block-btn");
    const followBtn = document.getElementById("follow-btn");

    if (friendsListSnapshot.exists()) {
        const data = friendsListSnapshot.data();
        const isBlocked = data.blocked && data.blocked.includes(userId);

        if (isBlocked) {
            blockBtn.textContent = "Unblock";
            followBtn.style.display = "none";
        } else {
            blockBtn.textContent = "Block";
            followBtn.style.display = "inline-block";
        }
    } else {
        blockBtn.textContent = "Block";
        followBtn.style.display = "inline-block";
    }
}

// Inicia la verificación del usuario logueado
checkCurrentUser();
