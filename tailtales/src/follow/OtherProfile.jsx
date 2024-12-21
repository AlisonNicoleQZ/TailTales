import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
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
    setDoc,
    addDoc
} from "firebase/firestore";
import {
    getAuth,
    onAuthStateChanged
} from "firebase/auth";

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

export const OtherProfile = () => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [userData, setUserData] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [privacySettings, setPrivacySettings] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [followStatus, setFollowStatus] = useState("Follow");

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
                initializePage(user.uid);
            } else {
                alert("No se encontró un usuario logueado. Redirigiendo al inicio de sesión...");
                window.location.href = "../login/login.html";
            }
        });
    };

    const initializePage = async (currentUserId) => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");

        if (userId === currentUserId) {
            window.location.href = '../profile/profile.html';
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

        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);

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

        const isFriend = friendsListSnapshot.exists() &&
            friendsListSnapshot.data().friends &&
            friendsListSnapshot.data().friends.includes(currentUserId);

        setIsFriend(isFriend);

        if (userData.privacySettings === 0 && !isFriend) {
            restrictAccess();
        } else {
            loadUserPosts(userId);
            setupFriendsList(userId, friendsListSnapshot);
        }

        checkBlockStatus(userId);
    };

    const displayBasicProfileInfo = (userData) => {
        return (
            <div className="profile-container">
                <img id="profile-photo" src={userData.profilePic || "../img/default-profile-image.jpg"} alt="Foto de Mascota" />
                <div className="friends-info">
                    <span id="friends-count" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Friends: 0</span>
                </div>
                <h2 id="profile-name">{userData.name || "Nombre no disponible"}</h2>
                <p id="profile-username" style={{ color: '#555', fontSize: '14px' }}>{userData.username ? `@${userData.username}` : "@usuario_no_disponible"}</p>
                <p id="profile-bio">{userData.bio || "Biografía no disponible"}</p>
                <p id="profile-location">{userData.location || "Ubicación no disponible"}</p>
                <p id="profile-age">{`${userData.age} ${userData.age_format === "years" ? "años" : "meses"}`}</p>
                <div className="action-buttons">
                    <button id="follow-btn" onClick={() => toggleFollow(userData.id)}>{followStatus}</button>
                    <button id="block-btn" onClick={() => toggleBlock(userData.id)}>{isBlocked ? "Unblock" : "Block"}</button>
                </div>
            </div>
        );
    };

    const setupFriendsList = (userId, friendsListSnapshot) => {
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
    };

    const restrictAccess = () => {
        const postsSection = document.getElementById("posts-section");
        postsSection.innerHTML = "<p>Publicaciones no disponibles debido a la configuración de privacidad.</p>";

        const friendsCountElement = document.getElementById("friends-count");
        friendsCountElement.style.cursor = "default";
        friendsCountElement.style.textDecoration = "none";
        friendsCountElement.textContent = "Friends: Privado";
        friendsCountElement.removeEventListener("click", () => { });
    };

    const loadUserPosts = async (userId) => {
        const postsSection = document.getElementById("posts-section");
        postsSection.innerHTML = "";

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
    };

    const openViewPostModal = (postData) => {
        setCurrentImages(postData.mediaUrls);
        setCurrentImageIndex(0);

        const modal = document.getElementById("view-post-modal");
        modal.style.display = "flex";

        document.getElementById("view-post-description").innerText = postData.content.text || "";
        updateCarouselImage();

        document.getElementById("prev").style.display = currentImages.length > 1 ? "block" : "none";
        document.getElementById("next").style.display = currentImages.length > 1 ? "block" : "none";
    };

    const updateCarouselImage = () => {
        document.getElementById("view-post-image").src = currentImages[currentImageIndex];
    };

    const createNotification = async (petId, type, message, status = 1) => {
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
    };

    const toggleFollow = async (userId) => {
        try {
            const userDoc = doc(db, "users", userId);
            const userSnapshot = await getDoc(userDoc);

            if (!userSnapshot.exists()) {
                alert("El usuario no existe.");
                return;
            }

            const userData = userSnapshot.data();
            const privacySettings = userData.privacySettings;

            const currentUserDoc = doc(db, "friendsList", currentUserId);
            const targetUserDoc = doc(db, "friendsList", userId);
            const currentUserSnapshot = await getDoc(currentUserDoc);
            const targetUserSnapshot = await getDoc(targetUserDoc);

            if (privacySettings === 0) {
                const friendRequestData = {
                    senderId: currentUserId,
                    receiverId: userId,
                    status: 0,
                    createdAt: new Date()
                };

                await setDoc(doc(collection(db, "friendRequest")), friendRequestData);

                const currentUsername = await getUsernameById(currentUserId);

                await createNotification(
                    userId,
                    0,
                    `@${currentUsername} te envió una solicitud de seguimiento`
                );

                alert("Su follow request fue enviada.");
                checkFriendStatus(userId);
                return;
            }

            if (privacySettings === 1) {
                const isFriend = currentUserSnapshot.exists() &&
                    currentUserSnapshot.data().friends &&
                    currentUserSnapshot.data().friends.includes(userId);

                if (isFriend) {
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

                    const currentUsername = await getUsernameById(currentUserId);

                    await createNotification(
                        userId,
                        0,
                        `@${currentUsername} comenzó a seguirte`
                    );

                    alert("Has comenzado a seguir a este usuario.");
                }

                checkFriendStatus(userId);
            } else {
                alert("Configuración de privacidad no válida.");
            }
        } catch (error) {
            alert("Ocurrió un error. Por favor, intenta de nuevo.");
        }
    };

    const getUsernameById = async (userId) => {
        try {
            const userDoc = doc(db, "users", userId);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return userData.username || "Usuario";
            } else {
                return "Usuario";
            }
        } catch (error) {
            return "Usuario";
        }
    };

    const checkFriendStatus = async (userId) => {
        try {
            const friendsListDoc = doc(db, "friendsList", currentUserId);
            const friendsListSnapshot = await getDoc(friendsListDoc);

            if (friendsListSnapshot.exists()) {
                const friendsData = friendsListSnapshot.data();
                const isFriend = friendsData.friends && friendsData.friends.includes(userId);

                if (isFriend) {
                    setFollowStatus("Unfollow");
                    return;
                }
            }

            const friendRequestQuery = query(
                collection(db, "friendRequest"),
                where("senderId", "==", currentUserId),
                where("receiverId", "==", userId),
                where("status", "==", 0)
            );
            const friendRequestSnapshot = await getDocs(friendRequestQuery);

            if (!friendRequestSnapshot.empty) {
                setFollowStatus("Pending");
            } else {
                setFollowStatus("Follow");
            }
        } catch (error) {
            setFollowStatus("Follow");
        }
    };

    const toggleBlock = async (userId) => {
        try {
            const currentUserDoc = doc(db, "friendsList", currentUserId);
            const targetUserDoc = doc(db, "friendsList", userId);

            const currentUserSnapshot = await getDoc(currentUserDoc);
            const targetUserSnapshot = await getDoc(targetUserDoc);

            if (currentUserSnapshot.exists()) {
                const currentUserData = currentUserSnapshot.data();
                const isBlocked = currentUserData.blocked && currentUserData.blocked.includes(userId);

                if (isBlocked) {
                    await updateDoc(currentUserDoc, {
                        blocked: arrayRemove(userId)
                    });
                    alert(`Has desbloqueado a este usuario.`);
                } else {
                    if (currentUserData.friends && currentUserData.friends.includes(userId)) {
                        await updateDoc(currentUserDoc, {
                            friends: arrayRemove(userId)
                        });
                    }

                    await updateDoc(currentUserDoc, {
                        blocked: arrayUnion(userId)
                    });

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
                await setDoc(currentUserDoc, {
                    blocked: [userId],
                    friends: []
                });
                alert(`Has bloqueado a este usuario.`);
            }

            checkBlockStatus(userId);
            checkFriendStatus(userId);
        } catch (error) {
            alert("Ocurrió un error. Por favor, intenta de nuevo.");
        }
    };

    const checkBlockStatus = async (userId) => {
        const friendsListDoc = doc(db, "friendsList", currentUserId);
        const friendsListSnapshot = await getDoc(friendsListDoc);

        if (friendsListSnapshot.exists()) {
            const data = friendsListSnapshot.data();
            const isBlocked = data.blocked && data.blocked.includes(userId);

            setIsBlocked(isBlocked);
        } else {
            setIsBlocked(false);
        }
    };

    return (
        <div>
            <header>
                <h1>Perfil de Mascota</h1>
                <button id="back-btn" onClick={() => window.history.back()}>Regresar</button>
            </header>
            <main>
                {userData && displayBasicProfileInfo(userData)}
                <section id="posts-section"></section>
            </main>
            <div id="view-post-modal" className="modal">
                <div className="modal-content">
                    <span id="close-view-modal" className="close">&times;</span>
                    <img id="view-post-image" src="" alt="Post" />
                    <p id="view-post-description"></p>
                    <button id="prev" className="carousel-control prev">&lt;</button>
                    <button id="next" className="carousel-control next">&gt;</button>
                </div>
            </div>
        </div>
    );
};
