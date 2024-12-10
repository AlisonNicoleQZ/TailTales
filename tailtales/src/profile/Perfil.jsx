import React, { useState, useEffect } from "react";
import styles from './Perfil.module.css';
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import nacimiento from '../img/nacimiento.svg';
import apariencia from '../img/especie-y-raza.svg';
import ubicacion from '../img/ubicacion.svg';
import ViewPostModal from "./ViewPostModal";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export const Perfil = () => {
  const [userUid, setUserUid] = useState(null);
  const [userData, setUserData] = useState({});
  const [mediaUrls, setMediaUrls] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditPostId, setCurrentEditPostId] = useState(null);
  const [currentPost, setCurrentPost] = useState({});
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        loadUserProfile(user.uid);
        loadUserPosts(user.uid);
      } else {
        alert("Debe iniciar sesión para ver su perfil.");
        window.location.href = '/login-register';
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const loadUserPosts = async (uid) => {
    const postsQuery = query(collection(db, "posts"), where("petId", "==", uid));
    const postsSnapshot = await getDocs(postsQuery);
    const loadedPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(loadedPosts);
  };

  const handlePostModalOpen = (post = null) => {
    if (post) {
      setCurrentPost(post);
      setMediaUrls(post.mediaUrls || []);
      setIsEditing(true);
      setCurrentEditPostId(post.id);
    } else {
      setCurrentPost({});
      setMediaUrls([]);
      setIsEditing(false);
      setCurrentEditPostId(null);
    }
    setIsPostModalOpen(true);
  };

  const handlePostModalClose = () => {
    setIsPostModalOpen(false);
  };

  const handlePostSubmit = async () => {
    if (!userUid) return alert("Debes iniciar sesión para publicar.");
  
    const storage = getStorage();
    const updatedMediaUrls = [...mediaUrls];
  
    try {
      // Subir cada archivo seleccionado
      for (const file of selectedFiles) {
        if (file) {
          const fileRef = ref(storage, `posts/${userUid}/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const fileUrl = await getDownloadURL(fileRef);
          updatedMediaUrls.push(fileUrl);
        }
      }
  
      const postData = {
        petId: userUid,
        content: { text: currentPost.description || '' },
        mediaUrls: updatedMediaUrls,
        createdAt: new Date(),
        visibility: 1,
        likesCount: 0,
        sharesCount: 0,
      };
  
      if (isEditing) {
        await updateDoc(doc(db, "posts", currentEditPostId), postData);
        alert("Publicación actualizada exitosamente.");
      } else {
        await addDoc(collection(db, "posts"), postData);
        alert("Publicación creada exitosamente.");
      }
  
      // Limpia los estados
      setSelectedFiles([]);
      handlePostModalClose();
      loadUserPosts(userUid);
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al subir la publicación.");
    }
  };    

  const addMediaInput = () => {
    setSelectedFiles([...selectedFiles, null]);
  };
  
  const handleFileChange = (e, index) => {
    const files = [...selectedFiles];
    files[index] = e.target.files[0];
    setSelectedFiles(files);
  };
  
  return (
    <div>
      <title>Perfil - @{userData.username}</title>
      <header>
        <a href="/feed"><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
          <a href="/feed"><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href="/buscar"><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href="/notificaciones"><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href="/solicitudes"><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href="/perfil"><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href="/perfil"><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
      </header>

      <main>
        <img id="profile-pic" src={userData.profilePic || "../img/default-profile-image.jpg"} className={styles.fotoPerfil} alt="Foto de perfil" />
        <div className={styles.infoUser}>
          <h3 className={styles.username}>@{userData.username}</h3>
          <h4 className={styles.name}>{userData.name}</h4>
          <button className={styles.botonEditarPerfil}>
            <a href="/editar-perfil">Editar perfil</a>
          </button>
          <p className={styles.bio}>{userData.bio}</p>
          <img src={apariencia} className={`${styles.icon} ${styles.aparienciaIcon}`}/>
          <p className={styles.especie}>{userData.species}</p>
          <p className={styles.raza}>{userData.breed}</p>
          <img src={nacimiento} className={`${styles.icon} ${styles.nacimientoIcon}`}/>
          <p className={styles.nacimiento}>{userData.age} años</p>
          <img src={ubicacion} className={`${styles.icon} ${styles.ubicacionIcon}`}/>
          <p className={styles.ubicacion}>{userData.location}</p>
        </div>
        <button onClick={() => handlePostModalOpen()} className={styles.buttonPublicar}>New Post</button>

        {isPostModalOpen && (
          <div className={styles.nuevaPublicacion}>
            <h3>{isEditing ? "Editar Publicación" : "Nueva Publicación"}</h3>
            <textarea className={styles.descripcion}
              placeholder="Escribe una descripción (opcional)"
              value={currentPost.description || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
            /><br/>
            <div id="media-inputs">
  {selectedFiles.map((file, index) => (
    <div key={index}>
      <input 
        type="file" 
        accept="image/*"  className={styles.inputFile}
        onChange={(e) => handleFileChange(e, index)} 
      />
    </div>
  ))}
</div>
<button id="add-media-url" className={styles.addMedia} onClick={() => addMediaInput()}>
  + Agregar otra imagen
</button>
            <button className={styles.buttonSubir} onClick={handlePostSubmit}>{isEditing ? "Guardar cambios" : "Publicar"}</button>
            <button className={styles.buttonCancelar} onClick={handlePostModalClose}>Cancelar</button>
          </div>
        )}

        <section id="posts-section" className={styles.publicaciones}>
          {posts.map(post => (
            <div key={post.id} className={styles.publicacion}>
              <img src={post.mediaUrls[0]}
              alt="Post"
              onClick={() => handleViewPost(post)} />
              <p>{post.content.text}</p>
              <button className={styles.editarPostButton} onClick={() => handlePostModalOpen(post)}>Editar</button>
              <button className={styles.eliminarPostButton} onClick={async () => {
                await deleteDoc(doc(db, "posts", post.id));
                alert("Publicación eliminada");
                loadUserPosts(userUid);
              }}>Eliminar</button>
            </div>
          ))}
        </section>
        <ViewPostModal isOpen={isModalOpen} postData={selectedPost} onClose={closeModal} />
      </main>
    </div>
  );
};