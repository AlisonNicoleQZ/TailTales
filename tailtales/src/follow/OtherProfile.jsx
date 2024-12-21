import React, { useEffect, useState } from 'react';
import { initializeApp} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, setDoc, addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import styles from './OtherProfile.module.css';
import { NavBar } from "../NavBar";
import nacimiento from '../img/nacimiento.svg';
import apariencia from '../img/especie-y-raza.svg';
import ubicacion from '../img/ubicacion.svg';

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
const auth = getAuth(app);

export const OtherProfile = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [privacySettings, setPrivacySettings] = useState(null);

  useEffect(() => {
    const checkCurrentUser = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUserId(user.uid);
          initializePage();
        } else {
          alert("No se encontró un usuario logueado. Redirigiendo al inicio de sesión...");
          window.location.href = "/login-register";
        }
      });
    };

    const initializePage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      if (userId === currentUserId) {
        window.location.href = '/perfil';
        return;
      }

      const targetUserDoc = doc(db, "friendsList", userId);
      const targetUserSnapshot = await getDoc(targetUserDoc);

      if (targetUserSnapshot.exists()) {
        const targetUserData = targetUserSnapshot.data();
        const isBlockedByTargetUser = targetUserData.blocked && targetUserData.blocked.includes(currentUserId);

        if (isBlockedByTargetUser) {
          alert("Perfil de usuario no disponible.");
          window.history.back();
          return;
        }
      }

      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        alert("Perfil no encontrado.");
        window.history.back();
        return;
      }

      const userData = userSnapshot.data();
      setUserData(userData);
      setPrivacySettings(userData.privacySettings);

      const friendsListDoc = doc(db, "friendsList", userId);
      const friendsListSnapshot = await getDoc(friendsListDoc);

      if (friendsListSnapshot.exists()) {
        const friendsData = friendsListSnapshot.data();
        setIsFriend(friendsData.friends.includes(currentUserId));
        setFriendsCount(friendsData.friends.length);
      }

      loadUserPosts(userId);
    };

    const loadUserPosts = async (userId) => {
      const postsQuery = query(collection(db, "posts"), where("petId", "==", userId));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => doc.data());
      setPosts(postsData);
    };

    checkCurrentUser();
  }, [currentUserId]);

  const handleFollowToggle = async (userId) => {
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
  };

  const handleBlockToggle = async (userId) => {
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
  };

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

  return (
    <div>
              <NavBar/>
     
       <title>Perfil</title> 
      {userData && (
        <div>
          <img className={styles.fotoPerfil} src={userData.profilePic || "../img/default-profile-image.jpg"} alt="Profile" />
           <div className={styles.infoUser}>
          <h3 className={styles.username}>{userData.username ? `@${userData.username}` : "@usuario_no_disponible"}</h3>
          <h4 className={styles.name}>{userData.name || "Nombre no disponible"}</h4>
          <p className={styles.bio}>{userData.bio || "Biografía no disponible"}</p>
          <img src={apariencia} className={`${styles.icon} ${styles.aparienciaIcon}`}/>
          <p className={styles.especie}>{userData.species}</p>
          <p className={styles.raza}>{userData.breed}</p>
          <img src={nacimiento} className={`${styles.icon} ${styles.nacimientoIcon}`}/>
          <p className={styles.nacimiento}>{`${userData.age} ${userData.age_format === "years" ? "años" : "meses"}`}</p>
           <img src={ubicacion} className={`${styles.icon} ${styles.ubicacionIcon}`}/>
          <p className={styles.ubicacion}>{userData.location || "Ubicación no disponible"}</p>
          </div>
        </div>
      )}
      <button className={styles.followButton} onClick={() => handleFollowToggle(userData.id)}>Follow/Unfollow</button>
      <button className={styles.blockButton} onClick={() => handleBlockToggle(userData.id)}>Block/Unblock</button>
      <h3>Friends: {friendsCount}</h3>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <p>{post.content.text}</p>
            {post.mediaUrls && post.mediaUrls.map((url, i) => (
              <img key={i} src={url} alt={`Post Media ${i}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};