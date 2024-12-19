import React, { useState, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './Friends.module.css';

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

export const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const userId = new URLSearchParams(location.search).get("userId");
    const cameFromProfile = new URLSearchParams(location.search).get("fromProfile") === "true";

    useEffect(() => {
        if (userId) {
            loadFriends(userId);
        } else {
            setError("No se proporcionó un userId en la URL.");
        }
    }, [userId]);

    const loadFriends = async (userId) => {
        try {
            const friendsListDoc = doc(db, "friendsList", userId);
            const friendsListSnapshot = await getDoc(friendsListDoc);

            if (friendsListSnapshot.exists()) {
                const friendsData = friendsListSnapshot.data();
                setFriends(friendsData.friends || []);
            } else {
                setError("No se encontró la lista de amigos.");
            }
        } catch (error) {
            console.error("Error al cargar la lista de amigos:", error);
            setError("Error al cargar los datos.");
        }
    };

    const removeFriend = async (friendId) => {
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

            alert(`Has dejado de seguir al usuario.`);

            // Actualizar la lista de amigos
            setFriends((prevFriends) => prevFriends.filter((id) => id !== friendId));
        } catch (error) {
            console.error("Error al intentar dejar de seguir:", error);
            alert("Hubo un error al procesar tu solicitud. Intenta de nuevo.");
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!friends.length) {
        return <div className="no-friends">No tiene amigos registrados.</div>;
    }

    return (
        <div id="friends-list">
            {friends.map((friendId) => (
                <FriendItem
                    key={friendId}
                    friendId={friendId}
                    onUnfollow={() => removeFriend(friendId)}
                    showUnfollowButton={cameFromProfile}
                />
            ))}
        </div>
    );
};

const FriendItem = ({ friendId, onUnfollow, showUnfollowButton }) => {
    const [friendData, setFriendData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const friendDoc = await getDoc(doc(db, "users", friendId));
                if (friendDoc.exists()) {
                    setFriendData(friendDoc.data());
                } else {
                    console.error("No se encontró el usuario.");
                }
            } catch (error) {
                console.error("Error al cargar los datos del amigo:", error);
            }
        };

        fetchFriendData();
    }, [friendId]);

    if (!friendData) {
        return null;
    }

    return (
        <div
            className={styles.friendItem}
            onClick={() => navigate(`/otro-perfil/${friendId}`)}
        >
            <img
                src={friendData.profilePic || "../img/default-profile-image.jpg"}
                alt="Foto de perfil"
            />
            <span>@{friendData.username || "Usuario desconocido"}</span>
            {showUnfollowButton && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnfollow();
                    }}
                >
                    Unfollow
                </button>
            )}
        </div>
    );
};
