import React, { useEffect, useState } from "react";
import styles from './PublicFollow.module.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import { NavBar } from "../NavBar";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, updateDoc,arrayUnion, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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


export const PublicFollow = () => {
  const [profiles, setProfiles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  //const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
       // setCurrentUser(user);
        loadFriends(user.uid)
        loadProfiles(user.uid);
      } else {
        window.location.href = "/login-register";
      }
    });
  
    return () => unsubscribe();
  }, []);

  const loadFriends = async (userId) => {
          try {
              const friendsListDoc = doc(db, "friendsList", userId);
              const friendsListSnapshot = await getDoc(friendsListDoc);
  
              if (friendsListSnapshot.exists()) {
                  const friendsData = friendsListSnapshot.data();
                  setFriends(friendsData.friends || []);
              } else {
               //   setError("No se encontró la lista de amigos.");
              }
          } catch (error) {
              console.error("Error al cargar la lista de amigos:", error);
        //      setError("Error al cargar los datos.");
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
    
    <NavBar/>

    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Amistades</h2>
                  <div id="profiles-request-container" className={styles.profilesRequestContainer}>
                    {friends.map((friendId) => (
                      <FriendItem
                      key={friendId}
                      friendId={friendId}
                  />
                    ))}
                  </div>
           {/**
                       <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic}  alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@tacotaco empezó a seguirte</p><br/>   
            </div>
            </div>

            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@hcocoa empezó a seguirte</p><br/>                
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
        </section>
    </main>
    </>
  )
}

const FriendItem = ({friendId}) => {
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
      <div className={styles.containerAmistades}>
        <div  onClick={() => navigate(`/otro-perfil/${friendId}`)}  id="profiles-request-container"  className={styles.friendItem}>
            <img
                src={friendData.profilePic || "../img/default-profile-image.jpg"}
                alt="Foto de perfil"
            />
            <p>@{friendData.username || "Usuario desconocido"} empezó a seguirte</p>
        </div>
        </div>
    );
};