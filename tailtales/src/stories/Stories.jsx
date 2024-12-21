import React, { useState, useEffect } from "react";
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

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
  const [userUid, setUserUid] = useState(null);
  const [username, setUsername] = useState("Usuario Anónimo");
  const [stories, setStories] = useState([]);
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "Usuario Anónimo");
        }
      } else {
        alert("Debes iniciar sesión para usar esta función.");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadStories();
    const interval = setInterval(deleteExpiredStories, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadStories = async () => {
    const storiesQuery = query(collection(db, "stories"), where("visibility", "==", 1));
    const storiesSnapshot = await getDocs(storiesQuery);

    const loadedStories = storiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setStories(loadedStories);
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

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const mediaUrl = await getDownloadURL(snapshot.ref);
        const songEmbedUrl = await selectSpotifySong();

        const description = prompt("Ingresa una descripción para tu estado:");

        await addDoc(collection(db, "stories"), {
          mediaUrl,
          songEmbedUrl: songEmbedUrl || "",
          description,
          username,
          createdAt: serverTimestamp(),
          visibility: 1,
        });
        alert("Estado creado.");
        loadStories();
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        alert("Hubo un error al intentar subir el archivo.");
      }
    };
  };

  const selectSpotifySong = async () => {
    const searchQuery = prompt("Ingresa el nombre de la canción:");
    if (!searchQuery) return "";

    try {
      const token = await getSpotifyToken();
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const track = data.tracks.items[0];
      return track ? track.external_urls.spotify : "";
    } catch (error) {
      console.error("Error al buscar la canción:", error);
      return "";
    }
  };

  const getSpotifyToken = async () => {
    const clientId = "33b642bc38f94b868d63577c016db3d9";
    const clientSecret = "08515d668a974b90984683d5360f71b7";

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  };

  const deleteExpiredStories = async () => {
    const fiveMinutesAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));

    const storiesQuery = query(
      collection(db, "stories"),
      where("createdAt", "<=", fiveMinutesAgo)
    );
    const storiesSnapshot = await getDocs(storiesQuery);

    console.log("Contador de historias borradas:", storiesSnapshot.size);

    storiesSnapshot.forEach(async (storyDoc) => {
      try {
        await deleteDoc(storyDoc.ref);
        console.log("Historia borrada:", storyDoc.id);
      } catch (error) {
        console.error("Fallo al borrar la historia:", storyDoc.id, error);
      }
    });
  };
};
