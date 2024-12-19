import React, { useEffect, useState } from "react";
import styles from './PublicFollow.module.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, updateDoc,arrayUnion, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export const PublicFollow = () => {
  const [profiles, setProfiles] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadRequests(user.uid)
        loadProfiles(user.uid);
      } else {
        window.location.href = "/login-register";
      }
    });
  
    return () => unsubscribe();
  }, []);

  const loadRequests = async (uid) => {
    try {
      // 1. Cargar solicitudes pendientes
      const querySnapshot = await getDocs(
        query(
          collection(db, "friendRequest"),
          where("receiverId", "==", uid),
          where("status", "==", 2),
          orderBy("createdAt", "desc")
        )
      );
  
      const pendingRequests = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const requestId = docSnapshot.id;
          const requestData = docSnapshot.data();
  
          const senderDoc = await getDoc(doc(db, "users", requestData.senderId));
          if (senderDoc.exists()) {
            return {
              ...requestData,
              id: requestId,
              senderData: senderDoc.data(),
            };
          }
          return null;
        })
      );
  
      const validRequests = pendingRequests.filter((r) => r !== null);
  
      // Actualizar estado de solicitudes pendientes
      setPendingRequests(validRequests);
  
      // 2. Procesar solicitudes para hacerse amigos
      for (const request of validRequests) {
        try {
          const { id: requestId, senderId } = request;
  
          // Actualizar estado de la solicitud
          const requestDoc = doc(db, "friendRequest", requestId);
          await updateDoc(requestDoc, { status: 2 });
  
          const currentUserDoc = doc(db, "friendsList", uid);
          const senderUserDoc = doc(db, "friendsList", senderId);
  
          const currentUserSnapshot = await getDoc(currentUserDoc);
          const senderUserSnapshot = await getDoc(senderUserDoc);
  
          // Actualizar la lista de amigos del usuario actual
          if (currentUserSnapshot.exists()) {
            await updateDoc(currentUserDoc, { friends: arrayUnion(senderId) });
          } else {
            await setDoc(currentUserDoc, { friends: [senderId], blocked: [] });
          }
  
          // Actualizar la lista de amigos del remitente
          if (senderUserSnapshot.exists()) {
            await updateDoc(senderUserDoc, { friends: arrayUnion(uid) });
          } else {
            await setDoc(senderUserDoc, { friends: [uid], blocked: [] });
          }
        } catch (error) {
          console.error(`Error al procesar la solicitud de ${request.senderId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error al cargar o procesar solicitudes pendientes:", error);
    }
  };  
  
  const loadProfiles = async (uid) => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
  
        const profiles = querySnapshot.docs
          .filter((doc) => doc.id !== uid)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
        setProfiles(profiles);
      } catch (error) {
        console.error("Error al cargar perfiles recomendados:", error);
      }
    };

  return (
    <>
    <header>
    <title>Public Follow - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Amistades</h2>
            {pendingRequests.length === 0 ? (
                  <p className={styles.solicitudesPendientes}>No tienes solicitudes pendientes</p>
                ) : (
                  <div id="profiles-request-container">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className={styles.request}>
                        <img className={styles.profilePic}
                          src={
                            request.senderData.profilePic || "../img/default-profile-image.jpg"
                          }
                          alt="Profile"
                        />
                        <p className={styles.textoSolicitud}>@{request.senderData.username} te empezó a seguir</p><br />
                      </div>
                    ))}
                  </div>
                )}
           {/**
                       <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic}  alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@tacotaco empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>

            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@hcocoa empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>
            */}
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendados</h3>
                  <div>
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="profile-card"
                        onClick={() =>
                          (window.location.href = `/perfil/:=${profile.id}`)
                        }
                      >
                        <img className={styles.profilePicRecomendados}
                          src={profile.profilePic || "../img/default-profile-image.jpg"}
                          alt="Profile"
                        />
                        <p className={styles.usernameRecomendado}>{profile.name}</p><br />
                        <button className={styles.buttonSeguir}>Seguir</button>
                      </div>
                    ))}
                  </div>
            {/**
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@chispita34</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pink_waffle</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pelusacute</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
             */}
        </section>
    </main>
    </>
  )
}