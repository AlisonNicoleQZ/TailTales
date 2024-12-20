import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, auth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
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

export const Stories = () => {
    const [stories, setStories] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [userUid, setUserUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            } else {
                alert("Debes iniciar sesión para usar esta función.");
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        loadStories();
        const interval = setInterval(deleteExpiredStories, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadStories = async () => {
        const storiesQuery = query(collection(db, "stories"), where("visibility", "==", 1));
        const storiesSnapshot = await getDocs(storiesQuery);
        const fetchedStories = storiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setStories(fetchedStories);
    };

    const createStory = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return alert("Debes seleccionar una imagen.");
            
            const storageRef = ref(storage, `stories/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const mediaUrl = await getDownloadURL(snapshot.ref);
            
            const description = prompt("Ingresa una descripción para tu estado:");
            const user = auth.currentUser;
            const username = user ? user.displayName : "Usuario Anónimo";
            
            await addDoc(collection(db, "stories"), {
                mediaUrl,
                description,
                username,
                createdAt: serverTimestamp(),
                visibility: 1,
            });
            alert("Historia creada.");
            loadStories();
        };
    };

    const deleteExpiredStories = async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const storiesQuery = query(
            collection(db, "stories"),
            where("createdAt", "<=", fiveMinutesAgo)
        );
        const storiesSnapshot = await getDocs(storiesQuery);
        storiesSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    };

    const openModal = (story) => {
        setModalData(story);
    };

    const closeModal = () => {
        setModalData(null);
    };
  return (
    <>
    <title>Estados - TailTales</title>

    <div>
            <button onClick={createStory}>Nueva Historia</button>
            <section id="stories-section">
                <div id="active-stories">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="story-item"
                            onClick={() => openModal(story)}
                        >
                            <img className="story-image" src={story.mediaUrl} alt="Estado" />
                            <div className="story-description">
                                <strong>{story.username}</strong>: {story.description}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {modalData && (
                <div id="story-modal" className="modal">
                    <button id="close-modal" onClick={closeModal}>
                        Cerrar
                    </button>
                    <img id="modal-image" src={modalData.mediaUrl} alt="Historia" />
                    <p id="modal-description">{modalData.description}</p>
                </div>
            )}
        </div>
    {/**
         <>
    <title>Estados - TailTales</title>

    <section id="stories-section">
        <button id="new-story-btn">Nuevo Estado</button>
        <div id="active-stories"></div>
    </section>

    <div id="story-modal" class="modal">
        <div class="modal-content">
            <div class="story-username" id="modal-username"></div> 
            <div class="story-description" id="modal-description"></div>
            <img id="modal-image" alt="Estado"/>
            <iframe id="modal-spotify" width="300" height="80" frameborder="0" allow="encrypted-media"></iframe>
            <button id="close-modal">Cerrar</button>
        </div>
    </div>

    <template id="story-template">
        <div class="story-item" data-media-url="" data-song-url="" data-username="" data-description="">
            <img class="story-image" alt="Estado"/>
            <div class="story-description"></div>
            <div class="story-username"></div> 
        </div>
    </template>
    </> */}
    </>
  )
}
