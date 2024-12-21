import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import logo from "./img/logo.svg";
import feed from "./img/casa.svg";
import buscar from "./img/lupa.svg";
import notif from "./img/campana.svg";
import amistades from "./img/amistades.svg";
import publicar from "./img/camara.svg";
import perfil from "./img/perfil.svg";

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
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
  authDomain: "tailtales-78e10.firebaseapp.com",
  projectId: "tailtales-78e10",
  storageBucket: "tailtales-78e10.appspot.com",
  messagingSenderId: "365635220712",
  appId: "1:365635220712:web:38f961847c39673e93c55d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const NavBar = () => {
  const [profile, setProfile] = useState({
    privacySettings: null,
    username: "Usuario Anónimo",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await loadUserProfile(currentUser.uid);
      } else {
        alert("Debe iniciar sesión para usar esta función.");
        window.location.href = "/login-register";
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfile({
          ...profile,
          ...userDoc.data(),
        });
      } else {
        alert("No se encontraron datos del usuario.");
      }
    } catch (error) {
      console.error("Error al cargar el perfil: ", error);
      alert("Hubo un error al cargar el perfil.");
    }
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
        const description = prompt("Ingresa una descripción para tu estado:");
        const songEmbedUrl = await selectSpotifySong();

        await addDoc(collection(db, "stories"), {
          mediaUrl,
          description,
          songEmbedUrl: songEmbedUrl || "",
          username: profile.username,
          createdAt: serverTimestamp(),
          visibility: 1,
        });

        alert("Historia creada exitosamente.");
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        alert("Hubo un error al intentar crear la historia.");
      }
    };
  };

  const selectSpotifySong = async () => {
    const searchQuery = prompt("Ingresa el nombre de la canción:");
    if (!searchQuery) return "";

    try {
      const token = await getSpotifyToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const track = data.tracks.items[0];
      return track ? track.external_urls.spotify : "";
    } catch (error) {
      console.error("Error al buscar la canción:", error);
      alert("Hubo un error al buscar la canción en Spotify.");
      return "";
    }
  };

  const getSpotifyToken = async () => {
    const clientId = "33b642bc38f94b868d63577c016db3d9";
    const clientSecret = "08515d668a974b90984683d5360f71b7";

    try {
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
    } catch (error) {
      console.error("Error al obtener el token de Spotify:", error);
      alert("Hubo un error al obtener el token de Spotify.");
      return "";
    }
  };

  return (
    <>
      <a href="/feed">
        <img src={logo} className={styles.logo} alt="logo" />
      </a>
      <nav className={styles.menuNav}>
        <a href="/feed">
          <img src={feed} className={styles.feed} alt="Feed" />
        </a>
        <a href="/buscar">
          <img src={buscar} className={styles.buscar} alt="Buscar" />
        </a>
        <a href="/notificaciones">
          <img src={notif} className={styles.notif} alt="Notificaciones" />
        </a>
        {profile.privacySettings === 0 ? (
          <a href="/solicitudes-publicas">
            <img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" />
          </a>
        ) : (
          <a href="/solicitudes">
            <img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" />
          </a>
        )}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            createStory();
          }}
        >
          <img src={publicar} className={styles.publicar} alt="Publicar" />
        </a>
        <a href="/perfil">
          <img src={perfil} className={styles.perfil} alt="Perfil" />
        </a>
      </nav>
    </>
  );
};
