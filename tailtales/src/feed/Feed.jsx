import React, {useState, useEffect}from 'react'
import styles from './Feed.module.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoPerfil from '../img/profile-pic.png';
import iconLike from '../img/paw-like.svg';
import iconComentarios from '../img/icon-comentarios.svg';
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {getFirestore, collection, doc, getDoc, query, where, getDocs} from "firebase/firestore";
import { NavBar } from '../NavBar';
export const Feed = () => {

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

const [posts, setPosts] = useState([]);
const [userUid, setUserUid] = useState(null);
const [userData, setUserData] = useState({});

useEffect(() => {
  const fetchPosts = async () => {
    try {
      if (!userUid) return;

      const allPosts = [];
      const friends = await getFriendsList(userUid);

      for (const friendId of friends) {
        const friendPosts = await loadUserPosts(friendId);

        for (const post of friendPosts) {
          const userDocRef = await getDoc(doc(db, "users", friendId));

          if (userDocRef.exists()) {
            post.username = userDocRef.data().username;
          }
        }

        allPosts.push(...friendPosts);
      }

      allPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      setPosts(allPosts);
    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
    }
  };

  fetchPosts();
}, [userUid]);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserUid(user.uid);
      loadUserProfile(user.uid);
    } else {
      alert("Debe iniciar sesión para ver el feed.");
      window.location.href = "/login-register";
    }
  });

  return () => unsubscribe();
}, []);

const loadUserPosts = async (uid) => {
  const postsQuery = query(collection(db, "posts"), where("petId", "==", uid));
  const postsSnapshot = await getDocs(postsQuery);

  const loadedPosts = [];
  postsSnapshot.forEach((postDoc) => {
    const postData = postDoc.data();
    postData.id = postDoc.id;
    loadedPosts.push(postData);
    
  });

  return loadedPosts;
};

const getFriendsList = async (userId) => {
  try {
    const friendDocRef = doc(db, "friendsList", userId);
    const friendDoc = await getDoc(friendDocRef);

    if (friendDoc.exists()) {
      return friendDoc.data().friends || [];
    } else {
      console.error("No se encontró el documento de amigos para el usuario:", userId);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener la lista de amigos:", error);
    return [];
  }
};

const loadUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  return (
    <>
    <title>Feed - TailTales</title>
    <div className={styles.container}>

    <NavBar/>


       <div className="main-feed">
            <section id="friend-stories" className={styles.friendStories}>
                <div id="stories-container" className={styles.storiesContainer}>
                  <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                    <div className={styles.storyIndividual}>
                    <img className={styles.story} src={fotoPerfil} alt="Imagen de perfil"/><br/>
                    <p className={styles.storyUsername}>@hcocoa</p>
                    </div>
                 </div>
            </section>
            <div className={styles.perfilContainer}>
            <a href='/perfil'>
            <img className={styles.fotoPerfil} src={userData.profilePic || "../img/default-profile-image.jpg"} alt="Imagen de perfil"/>
            <h3 className={styles.username}>@{userData.username}</h3>
            </a>
            </div>
            <section id="posts-feed" className={styles.postsFeed}>
            {posts.map((post) => (
            <div id="posts-container" className={styles.postsContainer}>
            <div key={post.id} className={styles.post}>
            <p className={styles.usernamePost}>@{post.username}</p>
            <p className={styles.textoPost}>{post.content.text}</p>
            <div className={styles.frame}>
            <img
                  src={post.mediaUrls[0]}
                  alt="Vista previa"
                  className={styles.fotoPost}
                  onClick={() => openViewPostModal(post)}
                  />
                </div>
              </div>
              </div>
              ))}
            </section>
        </div>
    </div>
    </>
  )
}
